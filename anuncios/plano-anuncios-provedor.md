# Plano Completo de Anúncios - Provedor de Internet

> Documento estratégico e operacional para aquisição de assinantes via tráfego pago (Google Ads + Meta Ads).
> Última atualização: junho/2026. Premissas baseadas no projeto de provedor próprio asset-light operando sobre rede de fibra de terceiro.

---

## 0. Campos a preencher antes de executar

Estes dados mudam números e segmentação. Preencha antes de subir campanha:

| Campo | Preencher | Usado em |
|---|---|---|
| Marca / nome | *(em definição)* | Criativos, domínio, conta |
| Cidade(s) e bairros de cobertura | _______ | Geografia (crítico) |
| Ticket médio do plano (R$/mês) | _______ | Cálculo de CAC e payback |
| Concorrentes locais a disputar | _______ | Palavras-chave e copy |
| Orçamento mensal de mídia | _______ | Alocação |
| Meta de assinantes/mês | _______ | Dimensionamento |
| Tempo médio de permanência do cliente (meses) | _______ | LTV |
| Canal de conversão (WhatsApp / form / ligação) | _______ | Estrutura de campanha |

---

## 1. Mapa de canais de anúncio (todos os possíveis)

Antes de escolher onde gastar, o inventário do que existe. Nem todo canal serve pra provedor: o filtro é sempre o mesmo - **dá pra segmentar por geografia fina?** Canal que não deixa travar bairro/CEP desperdiça a maior parte do investimento num negócio preso a endereço.

A coluna "vale pra ISP local" é opinião fundamentada, não regra: **Alta** = começa por aqui, **Média** = entra quando houver folga ou dado, **Baixa** = provavelmente é queimar dinheiro no seu caso.

### 1.1 Busca e intenção (quem já está procurando)

| Canal | O que faz | Geo fina? | Vale pra ISP local |
|---|---|---|---|
| **Google Pesquisa** | Anúncio de texto para quem busca contratar | Sim, por raio/bairro | **Alta** - carro-chefe |
| **Google Performance Max** | IA distribui em toda a rede Google | Sim, mas menos controle | **Média** - só com dados de conversão |
| **Google Display** | Banners na rede de sites | Sim | Baixa - muito clique sem intenção |
| **Microsoft/Bing Ads** | Busca no Bing e parceiros | Sim | Baixa/Média - pouco volume no BR, mas CPC barato |
| **Google Business Profile** | Ficha no Maps e busca local | Nativo | **Alta** - e é grátis |
| **Comparadores de plano** | Sites que comparam provedores | Depende do site | Média - lead pronto, mas comissionado |

### 1.2 Social e descoberta (quem ainda não procura)

| Canal | O que faz | Geo fina? | Vale pra ISP local |
|---|---|---|---|
| **Meta (Instagram/Facebook)** | Feed, Reels, Stories | Sim, pin + raio | **Alta** - volume e marca no bairro |
| **Click-to-WhatsApp (Meta)** | Anúncio que abre conversa direta | Sim | **Alta** - encurta o caminho até a venda |
| **TikTok Ads** | Vídeo curto | Sim, por cidade | Média - alcance barato, público mais jovem |
| **Kwai Ads** | Vídeo curto, público C/D | Sim, por cidade | Média - CPM baixo, casa com o perfil de muitos ISPs |
| **LinkedIn Ads** | B2B | Fraca (cidade) | Baixa - só se vender link dedicado pra empresa |
| **X, Pinterest, Snapchat** | Social diverso | Fraca | Baixa - público e geo não compensam |

### 1.3 Vídeo e áudio

| Canal | O que faz | Geo fina? | Vale pra ISP local |
|---|---|---|---|
| **YouTube (via Google Ads)** | Vídeo pré-roll e in-feed | Sim | Média - bom pra marca, caro pra conversão |
| **Spotify / podcast** | Áudio segmentado | Cidade | Baixa/Média - marca, difícil medir venda |
| **Rádio local** | Spot em emissora da cidade | Cidade/região | **Média/Alta** - em cidade do interior ainda converte |
| **TV regional / afiliada** | Comercial em bloco local | Região | Média - caro, mas dá autoridade a provedor novo |

### 1.4 Geolocalizado e programático

| Canal | O que faz | Geo fina? | Vale pra ISP local |
|---|---|---|---|
| **Waze Ads** | Pin patrocinado no trajeto | Excelente, por raio | **Alta** - geo é o forte dele |
| **Programática (DSP)** | Compra automatizada de mídia | Sim, por polígono | Média - só com volume e alguém operando |
| **Portais e jornais locais** | Banner no site da cidade | Nativa | Média - audiência certa, inventário pequeno |
| **Retargeting (Meta + Google)** | Reimpacta quem já visitou | Herda do site | **Alta** - o lead mais barato que existe |

### 1.5 Offline e presença física (subestimado em ISP)

| Canal | O que faz | Geo fina? | Vale pra ISP local |
|---|---|---|---|
| **Porta a porta / panfletagem** | Time na rua onde a fibra passa | Máxima, rua a rua | **Alta** - historicamente o de melhor CAC em ISP regional |
| **Outdoor, painel LED, busdoor** | Mídia externa | Boa, por ponto | Média - marca, não mede venda |
| **Carro de som** | Anúncio itinerante | Máxima | Média - barato, funciona em cidade pequena |
| **Patrocínio local** | Time, festa, evento de bairro | Máxima | Média - marca e simpatia, difícil atribuir |
| **Feira, quiosque em mercado** | Ponto de venda temporário | Máxima | **Média/Alta** - venda assistida, tira dúvida na hora |

### 1.6 Parcerias e indicação (o melhor CAC, quase sempre)

| Canal | O que faz | Geo fina? | Vale pra ISP local |
|---|---|---|---|
| **Indicação de cliente (member-get-member)** | Cliente traz vizinho por bônus | Natural | **Alta** - costuma bater qualquer mídia paga |
| **Imobiliárias e corretores** | Indicam a quem acabou de alugar/comprar | Máxima | **Alta** - pega o gatilho de mudança na origem |
| **Síndicos e administradoras** | Acesso ao condomínio inteiro | Máxima | **Alta** - um contrato destrava dezenas de casas |
| **Comércio local** | Padaria, mercado, loja de informática | Máxima | Média - baixo custo, exige gestão |
| **Assistência técnica / instalador** | Indica quem já tem problema de rede | Máxima | Média - lead qualificadíssimo, volume baixo |

### 1.7 Canais próprios (custo zero de mídia)

| Canal | O que faz | Vale pra ISP local |
|---|---|---|
| **SEO local** | Ranquear "internet fibra [cidade]" | **Alta** - tráfego composto, sem CPC |
| **Google Business Profile** | Ficha, avaliações, fotos | **Alta** - decide quem aparece no Maps |
| **Grupos de bairro (Facebook/WhatsApp)** | Presença orgânica na comunidade | **Alta** - é onde a reclamação de provedor acontece |
| **Reclame Aqui** | Reputação pública | **Alta** - não é mídia, mas define conversão |
| **Base própria (e-mail, SMS, WhatsApp)** | Upgrade, reativação, indicação | **Alta** - vender pra quem já é cliente é o mais barato |

### 1.8 O que isso muda na prática

Três leituras que saem do mapa acima:

1. **Os canais de maior retorno em ISP regional raramente são os mais caros.** Indicação, imobiliária e síndico costumam entregar CAC menor que qualquer campanha - e escalam devagar, por isso mídia paga continua necessária.
2. **Reputação não é canal de mídia, mas decide a conversão de todos eles.** Reclame Aqui e grupo de bairro são consultados antes de assinar. Investir em anúncio com reputação ruim é pagar para levar gente até a objeção.
3. **Canal sem geografia fina é desperdício estrutural aqui**, não questão de otimização. Por isso Waze e porta a porta aparecem alto, e LinkedIn e Pinterest aparecem baixo.

O restante deste documento aprofunda os dois canais que sustentam o volume previsível - **Google Ads e Meta Ads** - porque são os que escalam com orçamento e se medem com precisão. Os demais entram como complemento, na ordem de prioridade da coluna acima.

---

## 2. Sumário executivo

O objetivo é montar uma máquina de aquisição de assinantes previsível, com dois motores complementares:

- **Google Ads = captura de demanda.** Pega quem **já está procurando** internet agora (mudou de casa, brigou com a operadora, quer trocar). Lead mais quente, intenção alta, conversão mais rápida. É o carro-chefe de venda direta.
- **Meta Ads = criação de demanda.** Alcança quem **ainda não está procurando** mas tem o perfil. Constrói marca no bairro, gera leads por oferta, alimenta o funil. É volume e marca.

A espinha dorsal dos dois é a mesma e inegociável: **geografia travada na cobertura real de fibra.** Anunciar fora da área onde a rede passa é queimar dinheiro - o lead quer assinar e você não consegue instalar.

A regra de ouro que rege todo o plano: **otimizar por venda e CAC, não por custo de lead.** Lead barato que não vira assinante não paga a conta.

---

## 3. Particularidades do mercado de ISP (por que internet não é e-commerce)

Quem trata anúncio de provedor como anúncio de loja online quebra a cara. As diferenças que moldam todo o plano:

1. **É preso a endereço.** Só vende pra quem mora onde a fibra passa. Geografia é o filtro número 1, acima de qualquer interesse.
2. **Decisão domiciliar, não impulso.** Quem decide é o responsável pela casa (25-55 anos), geralmente em conjunto com a família. Ticket recorrente, não compra única.
3. **Demanda fortemente acionada por gatilhos de vida:** mudança de casa, briga com a operadora atual, casamento/saída da casa dos pais, abertura de negócio/home office, queda recorrente da internet vigente.
4. **Concorrência local feroz e por reputação.** Reclame Aqui, grupos de Facebook de bairro e boca a boca pesam muito. O cliente troca por raiva (queda, atendimento ruim), não só por preço.
5. **LTV alto e recorrente.** Um assinante que fica 24-36 meses justifica um CAC bem mais alto do que parece à primeira vista - por isso o foco em retenção e em lead qualificado.

---

## 4. Estrutura de funil e divisão de canais

Pense em três temperaturas. Cada canal atua mais forte em uma etapa:

**Topo (frio) - descoberta e marca**
Quem não conhece você e não está procurando. Canal: Meta (Advantage+, vídeo curto, awareness no bairro) + YouTube/Display do Google como apoio.
Objetivo: alcance, reconhecimento, primeiros leads por oferta.

**Meio (morno) - consideração**
Já te viu ou está pesquisando opções. Canal: Google Pesquisa (intenção) + retargeting Meta de quem visitou o site/engajou.
Objetivo: lead qualificado, agendamento, conversa no WhatsApp.

**Fundo (quente) - conversão**
Está decidindo agora. Canal: Google Pesquisa em termos de alta intenção ("trocar de provedor [cidade]") + retargeting de quem visitou a página de planos.
Objetivo: venda / contratação.

Regra de alocação inicial sugerida: comece com peso maior em **Google Pesquisa** (maior intenção) e use Meta para volume e marca, depois rebalanceie pelo CAC real de cada canal.

---

## 5. GOOGLE ADS - plano detalhado

### 4.1 Campanhas a criar (em ordem de prioridade)

**Campanha 1 - Pesquisa | Intenção direta (carro-chefe)**
Anúncios de texto para quem pesquisa contratar internet. Maior prioridade de orçamento.

**Campanha 2 - Pesquisa | Troca de provedor (lead quentíssimo)**
Termos de quem está insatisfeito com a operadora atual. Separada da Campanha 1 para controlar lance e copy específicos (a dor é diferente).

**Campanha 3 - Performance Max (escala, depois de ter dados)**
Só depois que Pesquisa estiver convertendo e você tiver dados de conversão. Distribui por YouTube, Display, Maps, Gmail. Trave bem a geografia e exclua clientes atuais, senão gasta em lugar errado. Não é o primeiro a ligar.

**Campanha 4 - Display/YouTube (marca, opcional)**
Topo de funil, awareness. Só quando houver folga de orçamento.

### 4.2 Palavras-chave por grupo (Pesquisa)

Use **correspondência de frase** e **exata**. Adicione a cidade/bairro real em cada termo.

**Grupo A - Intenção direta de contratar**
- "internet fibra [cidade]"
- "provedor de internet [cidade]"
- "plano de internet [cidade]"
- "internet via fibra perto de mim"
- "melhor internet [bairro]"
- "internet residencial [cidade]"

**Grupo B - Troca / insatisfação (alta conversão)**
- "trocar de provedor [cidade]"
- "cancelar [concorrente]"
- "[concorrente] reclamação"
- "internet melhor que [concorrente]"
- "internet que não cai [cidade]"

**Grupo C - Mudança / casa nova**
- "instalar internet [cidade]"
- "internet pra casa nova [cidade]"
- "como contratar internet [bairro]"

**Grupo D - Problema (consideração)**
- "internet caindo o que fazer"
- "internet lenta [cidade]"

**Palavras-chave negativas (essenciais - evitam desperdício):**
grátis, free, emprego, vaga, vagas, curso, como funciona, o que é, salário, reclamação trabalhista, segunda via [se não quiser suporte], gratuito, download, velocidade teste (avalie caso a caso).

### 4.3 Segmentos de público (o "sinal de perfil")

Adicione **em modo observação** na Pesquisa (não restrinja - só observe e ajuste lance):

- **In-market - "Serviços de Internet e Telefonia / Provedores de Internet"** - pessoas que o Google detecta pesquisando ativamente para contratar. O mais relevante.
- **Eventos da vida - "Mudança recente"** - cliente ideal de internet nova.
- **Customer Match (sua base)** - suba a lista de assinantes para (a) criar semelhantes e (b) **excluir** quem já é cliente.
- **Afinidade (tecnologia, games)** - fraco, só observação.

### 4.4 Geografia (crítico)

- Desenhe o raio/cidade/bairros **exatamente** sobre a cobertura de fibra.
- Configure como **"Presença: pessoas que estão regularmente no local"**, NÃO "interesse no local" - senão você paga por gente de fora pesquisando sobre sua cidade.
- Se houver várias regiões, considere campanhas separadas por região para mensurar e ajustar lance por área.

### 4.5 Lances e conversão

- Objetivo de conversão: **WhatsApp, formulário de lead ou ligação** (defina o principal).
- Comece com **Maximizar conversões**; depois de ~30 conversões, migre para **CPA desejado** baseado no seu CAC alvo.
- Instale acompanhamento de conversões e o tag do Google no site/landing antes de subir qualquer real.

---

## 6. META ADS - plano detalhado

### 5.1 O contexto 2026 (mudou muito)

O Meta cortou a segmentação detalhada: interesses específicos foram agrupados em categorias amplas e as exclusões detalhadas foram removidas. A plataforma agora empurra tudo para o **Advantage+ com IA** - você dá poucas dicas e o algoritmo acha o comprador. Segmentar demais virou contraproducente e limita a IA.

A exceção que joga a seu favor: **negócio local de nicho ainda se beneficia de controle manual**, principalmente de geografia. É exatamente o seu caso.

### 5.2 Campanhas a criar

**Campanha 1 - Conversão/Lead | Advantage+ com geo travada (principal)**
Objetivo de lead ou conversão. Geografia na cobertura, idade 25-55, e interesses só como **sugestão inicial** para a IA (ela expande além se achar melhor). O peso do resultado está no **criativo**, não no público.

**Campanha 2 - Retargeting (quente)**
Reimpacta quem visitou o site (especialmente página de planos/preços), engajou com posts ou abriu o formulário e não terminou. Lead mais barato de converter. Oferta de urgência aqui ("primeira mensalidade grátis", "instalação grátis até sexta").

**Campanha 3 - Lookalike (semelhantes da base)**
Quando tiver base de assinantes: suba a lista (respeitando LGPD) e crie semelhante 1%-2% dentro da geografia. Costuma ser o melhor público frio. Se o lookalike vier menor que ~100 mil pessoas, sua base ainda é pequena - invista em crescê-la antes de escalar.

### 5.3 Públicos e segmentação (em ordem de valor)

1. **Públicos personalizados (base própria):** clientes do CRM (cross-sell/upgrade), visitantes do site (Pixel), engajamento no Instagram/Facebook. Mais valioso.
2. **Lookalike 1%-2%** da base de assinantes, dentro da cobertura.
3. **Retargeting** por temperatura: visitou página de planos (7 dias), abandonou formulário, clientes antigos para reativação.
4. **Frio por interesse/demografia (para começar, sem dados):** idade 25-55, responsável pelo domicílio; sinal de **"mudou recentemente de residência"** se disponível; interesse amplo em tecnologia/streaming/games como dica leve. Após ~50 conversões, crie lookalike dessas conversões.

### 5.4 Geografia no Meta

- Desenhe por **pin + raio** sobre as ruas com fibra (1-2 km por pin conforme densidade).
- Use **"pessoas que moram neste local"** (não "estiveram recentemente aqui") - internet residencial é decisão de morador.
- Campanhas/conjuntos separados por bairro permitem criativo "a fibra chegou no [bairro]", que converte muito mais que genérico.

---

## 7. Criativos e copy (o que mais pesa em 2026)

Com a segmentação automatizada, **o criativo é a principal alavanca de performance.** Entregue variedade de ângulos e formatos para a IA testar.

### 6.1 Ângulos de mensagem (teste vários, não só "assine já")

- **Dor da queda:** "Cansou de internet que cai na hora do jogo / da reunião / da novela?"
- **Troca com raiva do concorrente:** "Tá pagando caro e a internet vive caindo? A gente resolve."
- **Velocidade/estabilidade:** foco em fibra de verdade, ping baixo (gamer), estabilidade pra home office.
- **Chegada no bairro (local):** "A fibra chegou no [bairro]. Seja dos primeiros."
- **Oferta/urgência:** instalação grátis, primeira mensalidade, sem fidelidade no primeiro mês.
- **Prova social local:** depoimento de vizinho, "X famílias já conectadas no [bairro]".
- **Atendimento humano:** "Aqui você fala com gente da cidade, não com robô" - diferencial contra as gigantes.

### 6.2 Formatos

- Vídeo curto vertical (Reels/Stories) - maior peso.
- Imagem estática com oferta clara.
- Carrossel (planos, velocidades, benefícios).
- Use 3-5 variações por ângulo para a IA distribuir.

### 6.3 Estrutura de quiz/lead (melhor que "assine já")

No frio, em vez de pedir contratação direta, capture com baixa fricção:
- Lead ad ou WhatsApp com 2-3 perguntas: "Qual seu bairro?" / "Internet é pra casa ou empresa?" / "Quanto paga hoje?"
- Isso qualifica o lead (você já sabe se está na cobertura) e reduz custo por lead útil.

---

## 8. Estrutura de conversão e tecnologia

Antes de gastar o primeiro real, monte a base de mensuração - sem isso você anuncia no escuro:

- **Pixel do Meta** + **Tag do Google** instalados no site/landing.
- **API de Conversões (Meta)** e **acompanhamento de conversões offline** para registrar vendas que fecham por WhatsApp/telefone - fundamental num negócio onde a venda termina fora do site.
- **Landing page por região/oferta** OU fluxo direto de WhatsApp (em muitos ISPs regionais o WhatsApp converte melhor que landing).
- **Verificador de cobertura por CEP** na landing: filtra na hora quem está fora da área, economiza atendimento e dinheiro.
- **CRM** ligado para registrar lead - venda - permanência e alimentar os públicos.

---

## 9. Orçamento e alocação (modelo para preencher)

Sem o orçamento real fica genérico, então segue o **modelo de cálculo** - preencha com seus números:

**Cálculo de CAC máximo sustentável:**
```
LTV = ticket mensal (R$) x meses médios de permanência x margem
CAC máximo saudável ~ LTV / 3   (regra prática conservadora)
```
Exemplo ilustrativo (troque pelos seus dados): ticket R$ 100, permanência 24 meses, margem 50% -> LTV = R$ 1.200 -> CAC máximo ~R$ 400. Isso te diz quanto pode pagar por assinante adquirido.

**Alocação inicial sugerida (ajuste pelo CAC real após 30 dias):**

| Canal / campanha | % do orçamento inicial | Papel |
|---|---|---|
| Google Pesquisa (intenção direta + troca) | 45% | Venda direta, maior intenção |
| Meta Advantage+ (lead frio + geo) | 30% | Volume e marca |
| Retargeting (Meta + Google) | 15% | Conversão barata |
| Reserva para teste/escala (PMax, lookalike) | 10% | Descoberta |

**Os primeiros 30 dias são pesquisa paga, não venda.** Trate o orçamento inicial como investimento em descobrir quais termos, públicos e criativos convertem. Não julgue pelo CPL dos primeiros dias.

---

## 10. Métricas e KPIs

Acompanhe na ordem de importância (a última é a que importa de verdade):

1. **CAC (custo de aquisição por assinante)** - gasto total / assinantes fechados. O número-rei.
2. **Taxa lead -> venda** - quantos leads viram assinante. Mede qualidade, não volume.
3. **Custo por lead qualificado** (lead dentro da cobertura) - não o lead bruto.
4. **Payback (meses para recuperar o CAC)** - quanto tempo até o assinante pagar o que custou adquirir.
5. **ROAS / LTV:CAC** - saúde de longo prazo (mire 3:1 ou melhor).
6. CTR, CPC, CPM - métricas de diagnóstico, não de decisão.

**Armadilha a evitar:** otimizar por CPL baixo. Lead barato que não fecha venda é prejuízo disfarçado. Exclua compradores recentes dos públicos para não desperdiçar impressão.

---

## 11. Cronograma de implementação - primeiros 90 dias

**Semana 0 - Fundação (antes de gastar)**
Instalar Pixel, Tags, API de Conversões. Montar landing/WhatsApp + verificador de CEP. Desenhar mapa de cobertura. Definir oferta. Subir base no Customer Match (LGPD ok).

**Semanas 1-4 - Lançamento e descoberta**
Subir Google Pesquisa (Grupos A e B) + Meta Advantage+ com geo. Orçamento de teste. Coletar dados. Sem julgar resultado ainda. Refinar negativas diariamente na primeira semana.

**Semanas 5-8 - Otimização**
Cortar termos/criativos/públicos que não convertem. Dobrar nos que funcionam. Ligar retargeting (já há tráfego para reimpactar). Migrar lances para CPA desejado. Criar lookalike das primeiras conversões.

**Semanas 9-12 - Escala**
Ligar Performance Max e Lookalike com base nos dados. Escalar orçamento em incrementos de 20-30% por semana (nunca dobrar de uma vez - desestabiliza entrega e custo). Expandir geografia conforme a rede crescer.

---

## 12. Cuidados de LGPD e marca

- **Customer Match / listas:** só suba dados de quem **consentiu** receber comunicação. Envio de base não consentida gera risco de multa.
- **Concorrentes em palavra-chave:** usar nome do concorrente como palavra-chave de pesquisa é prática comum e permitida, MAS **não use a marca do concorrente no texto do anúncio** (risco jurídico de marca). Mire na dor, não no nome, dentro do criativo.
- **Promessas de velocidade:** siga as regras da Anatel - anuncie velocidade como "nominal máxima" e evite promessa absoluta de estabilidade que possa virar processo no Procon/Reclame Aqui.

---

## 13. Resumo de uma página (o essencial)

- **Google = capturar quem procura. Meta = criar demanda em quem tem perfil.**
- **Geografia travada na cobertura é o filtro nº 1** nos dois canais.
- No **Google**, segmente por **palavra-chave de intenção** (direta + troca) + público **in-market de provedores** em observação.
- No **Meta**, dê **poucas dicas e deixe o Advantage+ trabalhar**; o **criativo** é a maior alavanca.
- Públicos mais valiosos: **sua base (Customer Match/Pixel) -> lookalike -> retargeting -> frio por interesse**.
- **Otimize por CAC e venda, não por CPL.** LTV:CAC mire 3:1.
- Primeiros **30 dias = pesquisa paga**. Escale só o que comprovar conversão, em incrementos de 20-30%.
- Monte **mensuração (Pixel/Tags/API de Conversões) e verificador de CEP** ANTES de gastar.
