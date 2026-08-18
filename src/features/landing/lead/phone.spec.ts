import { describe, expect, it } from "vitest";

import { maskPhoneBR, phoneToE164, isValidPhoneBR } from "./phone";

describe("maskPhoneBR", () => {
  it("formata celular de 11 dígitos", () => {
    expect(maskPhoneBR("35998423386")).toBe("(35) 99842-3386");
  });

  it("formata fixo de 10 dígitos", () => {
    expect(maskPhoneBR("3532212233")).toBe("(35) 3221-2233");
  });

  it("formata parcialmente enquanto a pessoa digita", () => {
    expect(maskPhoneBR("35")).toBe("(35");
    expect(maskPhoneBR("359")).toBe("(35) 9");
    expect(maskPhoneBR("3599842")).toBe("(35) 99842");
  });

  it("ignora o que não for dígito e nunca passa de 11 dígitos", () => {
    expect(maskPhoneBR("(35) 99842-3386999")).toBe("(35) 99842-3386");
    expect(maskPhoneBR("abc35def99842")).toBe("(35) 99842");
  });
});

describe("phoneToE164", () => {
  it("prefixa +55", () => {
    expect(phoneToE164("(35) 99842-3386")).toBe("+5535998423386");
  });

  it("não duplica o 55 quando já veio com código do país", () => {
    expect(phoneToE164("+55 35 99842-3386")).toBe("+5535998423386");
  });
});

describe("isValidPhoneBR", () => {
  it("aceita 10 e 11 dígitos", () => {
    expect(isValidPhoneBR("(35) 3221-2233")).toBe(true);
    expect(isValidPhoneBR("(35) 99842-3386")).toBe(true);
  });

  it("recusa curto demais e DDD inválido", () => {
    expect(isValidPhoneBR("(35) 9984")).toBe(false);
    expect(isValidPhoneBR("(05) 99842-3386")).toBe(false);
  });
});
