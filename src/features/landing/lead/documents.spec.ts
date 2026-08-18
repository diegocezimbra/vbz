import { describe, expect, it } from "vitest";

import { isValidCEP, isValidCPF, maskCEP, maskCPF, onlyDigits } from "./documents";

describe("maskCEP", () => {
  it("formata 8 dígitos", () => expect(maskCEP("37550000")).toBe("37550-000"));
  it("formata parcial", () => expect(maskCEP("3755")).toBe("3755"));
  it("descarta excedente", () => expect(maskCEP("375500001234")).toBe("37550-000"));
});

describe("isValidCEP", () => {
  it("aceita 8 dígitos", () => expect(isValidCEP("37550-000")).toBe(true));
  it("recusa curto", () => expect(isValidCEP("3755")).toBe(false));
});

describe("maskCPF", () => {
  it("formata 11 dígitos", () => expect(maskCPF("52998224725")).toBe("529.982.247-25"));
  it("formata parcial", () => expect(maskCPF("529982")).toBe("529.982"));
});

describe("isValidCPF", () => {
  it("aceita CPF com dígito verificador correto", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
  });
  it("recusa dígito verificador errado", () => {
    expect(isValidCPF("529.982.247-26")).toBe(false);
  });
  it("recusa sequência repetida", () => {
    expect(isValidCPF("111.111.111-11")).toBe(false);
  });
  it("recusa tamanho errado", () => {
    expect(isValidCPF("529.982.247")).toBe(false);
  });
});

describe("onlyDigits", () => {
  it("tira tudo que não é dígito", () => expect(onlyDigits("(35) 9-98a4")).toBe("359984"));
});
