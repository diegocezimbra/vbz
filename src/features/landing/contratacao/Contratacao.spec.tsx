import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const submitViability = vi.fn();
const checkCoverage = vi.fn();
const checkCredit = vi.fn();
vi.mock("../lead/lead.functions", () => ({ submitViability: (a: unknown) => submitViability(a) }));
vi.mock("./cobertura.functions", () => ({ checkCoverage: (a: unknown) => checkCoverage(a) }));
vi.mock("./credito.functions", () => ({ checkCredit: (a: unknown) => checkCredit(a) }));

import { Contratacao } from "./Contratacao";

const COBERTURA_OK = {
  status: "disponivel", logradouro: "Rua das Violetas", bairro: "Novo Yara",
  cidade: "Pouso Alegre", uf: "MG", message: "Temos fibra no seu endereço.",
};

async function chegarNoPassoDeDados(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("CEP"), "37550340");
  await user.type(screen.getByLabelText("Número"), "450");
  await user.click(screen.getByRole("button", { name: /consultar disponibilidade/i }));
  await user.click(await screen.findByRole("button", { name: /^continuar$/i }));
  await user.click(screen.getByRole("button", { name: /turbo/i }));
  await user.click(screen.getByRole("button", { name: /^continuar$/i }));
  await user.type(screen.getByLabelText(/nome completo/i), "Maria de Souza");
  await user.type(screen.getByLabelText("CPF"), "52998224725");
  await user.type(screen.getByLabelText(/nascimento/i), "1990-04-12");
  await user.type(screen.getByLabelText(/e-mail/i), "maria@exemplo.com");
  await user.type(screen.getByLabelText("Telefone"), "35998423386");
}

describe("Contratacao", () => {
  beforeEach(() => {
    submitViability.mockReset().mockResolvedValue({ ok: true, crm: { delivered: true, status: "created" } });
    checkCoverage.mockReset().mockResolvedValue(COBERTURA_OK);
    checkCredit.mockReset().mockResolvedValue({ decision: "aprovado", message: "Análise aprovada." });
  });

  it("espelha o lead no CRM ao sair do passo de dados, antes do fim do funil", async () => {
    const user = userEvent.setup();
    render(<Contratacao />);

    await chegarNoPassoDeDados(user);
    await user.click(screen.getByRole("button", { name: /^continuar$/i }));

    await waitFor(() => expect(submitViability).toHaveBeenCalledTimes(1));
    const enviado = submitViability.mock.calls[0][0].data;
    expect(enviado.nome).toBe("Maria de Souza");
    expect(enviado.cidade).toBe("Pouso Alegre");
    expect(enviado.endereco).toContain("Rua das Violetas, 450");
  });

  it("não trava o funil quando o CRM falha — quem quer contratar continua", async () => {
    submitViability.mockRejectedValue(new Error("CRM fora"));
    const user = userEvent.setup();
    render(<Contratacao />);

    await chegarNoPassoDeDados(user);
    await user.click(screen.getByRole("button", { name: /^continuar$/i }));

    expect(await screen.findByRole("heading", { name: /análise de crédito/i })).toBeInTheDocument();
  });

  it("segue pra análise manual quando a consulta de crédito explode", async () => {
    checkCredit.mockRejectedValue(new Error("Radar fora"));
    const user = userEvent.setup();
    render(<Contratacao />);

    await chegarNoPassoDeDados(user);
    await user.click(screen.getByRole("button", { name: /^continuar$/i }));
    await user.click(await screen.findByRole("button", { name: /fazer análise de crédito/i }));

    expect(await screen.findByText(/conferência rápida/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^continuar$/i })).toBeEnabled();
  });
});
