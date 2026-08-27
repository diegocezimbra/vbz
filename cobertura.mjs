/** Regras de cobertura da VBZ. Sem I/O aqui: so a decisao, para poder testar. */

function normalizar(v) {
  return (v || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim()
}

/** Lista de `VBZ_COVERAGE_CITIES`, no formato "Cidade-UF,Cidade-UF". */
export function cidadesAtendidas(env) {
  return (env || "").split(",").map(normalizar).filter(Boolean)
}

/**
 * Decide a cobertura de um endereco.
 *
 * Lista VAZIA devolve `verificar`, nunca `disponivel`: vazio significa "ainda nao
 * sabemos onde atendemos", e afirmar cobertura inexistente faz a pessoa assinar e
 * descobrir na instalacao que nao da. O padrao seguro e prometer conferencia.
 *
 * A comparacao inclui a UF porque nome de cidade se repete entre estados.
 */
export function decidirCobertura(cidade, uf, atendidas) {
  if (!atendidas.length) {
    return {
      status: "verificar",
      mensagem: "Recebemos seu endereço. Vamos confirmar a viabilidade técnica e te retornar.",
    }
  }
  const chave = normalizar(`${cidade}-${uf}`)
  if (atendidas.includes(chave)) {
    return { status: "disponivel", mensagem: "Boa notícia: a VBZ atende o seu endereço." }
  }
  return {
    status: "fora",
    mensagem: "Ainda não chegamos nesse endereço - mas queremos te avisar quando chegar.",
  }
}
