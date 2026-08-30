import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  checkCepInCoverage,
  fetchCepAddress,
  normalizeCep,
  type CepAddress,
} from "./coverage-polygons";

export type CoverageStatus = "disponivel" | "verificar" | "fora" | "nao_encontrado";

export interface CoverageResult {
  status: CoverageStatus;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  message: string;
}

const VIACEP_TIMEOUT_MS = 6000;

export const checkCoverage = createServerFn({ method: "POST" })
  .inputValidator(z.object({ cep: z.string().min(8).max(9) }))
  .handler(async ({ data }): Promise<CoverageResult> => {
    const empty = { logradouro: "", bairro: "", cidade: "", uf: "" };
    const cep = normalizeCep(data.cep);
    if (!cep) {
      return {
        ...empty,
        status: "nao_encontrado",
        message: "CEP inválido. Confere os números para consultar a cobertura.",
      };
    }

    try {
      const result = await checkCepInCoverage(cep);
      if (!result.address) {
        return {
          ...empty,
          status: "nao_encontrado",
          message:
            "Não encontrei esse CEP. Confere os números - ou siga assim mesmo que a gente confirma o endereço com você.",
        };
      }

      const address = result.address;
      if (!result.point) {
        return {
          logradouro: address.logradouro,
          bairro: address.bairro,
          cidade: address.cidade,
          uf: address.uf,
          status: "verificar",
          message: "Recebemos seu endereço. Vamos confirmar a viabilidade técnica e te retornar.",
        };
      }

      if (result.matchedAreas.length > 0) {
        return {
          logradouro: address.logradouro,
          bairro: address.bairro,
          cidade: address.cidade,
          uf: address.uf,
          status: "disponivel",
          message: "Boa notícia: temos fibra VBZ no seu endereço.",
        };
      }

      return {
        logradouro: address.logradouro,
        bairro: address.bairro,
        cidade: address.cidade,
        uf: address.uf,
        status: "fora",
        message: "Ainda não chegamos nesse endereço - mas queremos avisar quando chegar.",
      };
    } catch (error) {
      console.error("[cobertura] consulta por poligono falhou:", error);
      const address = await tryAddressFallback(cep);
      return {
        logradouro: address?.logradouro ?? "",
        bairro: address?.bairro ?? "",
        cidade: address?.cidade ?? "",
        uf: address?.uf ?? "",
        status: "verificar",
        message: "Não consegui consultar o CEP agora. Seguimos e confirmamos com você.",
      };
    }
  });

async function tryAddressFallback(cep: string): Promise<CepAddress | null> {
  try {
    return await Promise.race([
      fetchCepAddress(cep),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), VIACEP_TIMEOUT_MS)),
    ]);
  } catch {
    return null;
  }
}
