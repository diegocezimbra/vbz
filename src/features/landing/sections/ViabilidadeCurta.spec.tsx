import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const submitViability = vi.fn();
vi.mock("../lead/lead.functions", () => ({ submitViability: (a: unknown) => submitViability(a) }));

import { ViabilidadeCurta } from "./ViabilidadeCurta";

describe("ViabilidadeCurta", () => {
  beforeEach(() => {
    submitViability.mockReset().mockResolvedValue({ ok: true, crm: { delivered: true, status: "created" } });
  });

  it("tem exatamente os quatro campos pedidos", () => {
    render(<ViabilidadeCurta onContinuar={vi.fn()} />);
    for (const label of [/nome/i, /telefone/i, /endereço/i, /cidade/i]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("manda o lead e chama a continuação com os dados preenchidos", async () => {
    const onContinuar = vi.fn();
    const user = userEvent.setup();
    render(<ViabilidadeCurta onContinuar={onContinuar} />);

    await user.type(screen.getByLabelText(/nome/i), "Maria de Souza");
    await user.type(screen.getByLabelText(/telefone/i), "35998423386");
    await user.type(screen.getByLabelText(/endereço/i), "Rua das Flores, 1234");
    await user.type(screen.getByLabelText(/cidade/i), "Pouso Alegre");
    await user.click(screen.getByRole("button", { name: /solicitar viabilidade/i }));

    await waitFor(() => expect(submitViability).toHaveBeenCalledTimes(1));
    expect(onContinuar).toHaveBeenCalledWith(
      expect.objectContaining({ nome: "Maria de Souza", cidade: "Pouso Alegre" }),
    );
  });

  it("não envia com telefone inválido", async () => {
    const user = userEvent.setup();
    render(<ViabilidadeCurta onContinuar={vi.fn()} />);
    await user.type(screen.getByLabelText(/nome/i), "Maria de Souza");
    await user.type(screen.getByLabelText(/telefone/i), "359");
    await user.click(screen.getByRole("button", { name: /solicitar viabilidade/i }));
    expect(submitViability).not.toHaveBeenCalled();
    expect(await screen.findByText(/telefone com ddd/i)).toBeInTheDocument();
  });

  it("continua mesmo se o CRM falhar — não perde quem quer contratar", async () => {
    submitViability.mockRejectedValue(new Error("CRM fora"));
    const onContinuar = vi.fn();
    const user = userEvent.setup();
    render(<ViabilidadeCurta onContinuar={onContinuar} />);
    await user.type(screen.getByLabelText(/nome/i), "Maria de Souza");
    await user.type(screen.getByLabelText(/telefone/i), "35998423386");
    await user.type(screen.getByLabelText(/endereço/i), "Rua das Flores, 1234");
    await user.type(screen.getByLabelText(/cidade/i), "Pouso Alegre");
    await user.click(screen.getByRole("button", { name: /solicitar viabilidade/i }));
    await waitFor(() => expect(onContinuar).toHaveBeenCalled());
  });
});
