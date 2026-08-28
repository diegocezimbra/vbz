import process from "node:process";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

/**
 * Cidades atendidas, separadas por vírgula em `VBZ_COVERAGE_CITIES`
 * (ex.: "Pouso Alegre-MG,Santa Rita do Sapucaí-MG").
 *
 * Sem a env, NENHUM endereço é declarado "disponível": o retorno vira `verificar` e a
 * página promete conferência, não cobertura. Inventar cobertura é a pior mentira que
 * uma landing de provedor pode contar - o cliente assina e descobre na instalação.
 */
function servedCities(): string[] {
  return (process.env.VBZ_COVERAGE_CITIES ?? "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
}

function decide(cidade: string, uf: string): { status: CoverageStatus; message: string } {
  const cities = servedCities();
  if (!cities.length) {
    return {
      status: "verificar",
      message: "Recebemos seu endereço. Vamos confirmar a viabilidade técnica e te retornar.",
    };
  }
  const key = `${cidade}-${uf}`.toLowerCase();
  if (cities.includes(key) || cities.includes(cidade.toLowerCase())) {
    return { status: "disponivel", message: "Boa notícia: temos fibra VBZ no seu endereço." };
  }
  return {
    status: "fora",
    message: "Ainda não chegamos nesse endereço - mas queremos avisar quando chegar.",
  };
}

export const checkCoverage = createServerFn({ method: "POST" })
  .inputValidator(z.object({ cep: z.string().min(8).max(9) }))
  .handler(async ({ data }): Promise<CoverageResult> => {
    const digits = data.cep.replace(/\D/g, "");
    const empty = { logradouro: "", bairro: "", cidade: "", uf: "" };

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
        signal: AbortSignal.timeout(VIACEP_TIMEOUT_MS),
      });
      const body = (await response.json()) as Record<string, string | boolean>;
      if (body.erro) {
        // CEP inexistente/genérico NÃO é "fora da área": tratar como fora manda embora
        // quem só errou um dígito - ou quem digitou o CEP geral da cidade, que a base
        // dos Correios não resolve.
        return {
          ...empty,
          status: "nao_encontrado",
          message:
            "Não encontrei esse CEP. Confere os números - ou siga assim mesmo que a gente confirma o endereço com você.",
        };
      }
      const cidade = String(body.localidade ?? "");
      const uf = String(body.uf ?? "");
      return {
        logradouro: String(body.logradouro ?? ""),
        bairro: String(body.bairro ?? ""),
        cidade,
        uf,
        ...decide(cidade, uf),
      };
    } catch (error) {
      // ViaCEP fora do ar não pode matar a venda: segue pra conferência manual.
      console.error("[cobertura] ViaCEP indisponível:", error);
      return {
        ...empty,
        status: "verificar",
        message: "Não consegui consultar o CEP agora. Seguimos e confirmamos com você.",
      };
    }
  });
