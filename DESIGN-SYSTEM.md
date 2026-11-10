# elo — design system

Conceito original de provedor residencial. Público: pessoas que trabalham, estudam e se divertem em casa. Objetivo: comparar planos e conhecer a proposta de conexão. Marca, preços e condições são demonstrativos.

1. **Direção:** precisão editorial, superfícies neutras e contraste em preto e branco, com ações em azul-marinho. O logotipo conectado elo é a assinatura da marca. Fotografia arquitetônica comunica tranquilidade e vida conectada.
2. **Grid:** máximo de 1280 px, base de 12 colunas; margens de 64 px no desktop, 32 px no tablet e 22 px no mobile.
3. **Tipografia:** system sans-serif; hero 88–104 px no desktop / 52 px no mobile, títulos 56 / 38 px, subtítulos 24 px, corpo 16–18 px, labels 14 px e metadados 12 px. Pesos 400, 500 e 600; tracking negativo apenas em títulos.
4. **Cores:** claro: fundo #fafafa, superfície #ffffff, texto #111111, secundário #626262, marca #000000. Escuro: fundo #0a0a0a, superfície #171717, texto #fafafa, secundário #b3b3b3, marca #ffffff. Fotografias preservam as cores originais. Botões e pastas usam azul-marinho #142c4d, com texto branco #ffffff; hover #1d3c65 e filtro selecionado #244a7a. As animações da abertura permanecem neutras; o WarpText não separa os canais de cor.
5. **Cantos:** 8, 12, 16, 24, 32 px e pill. Mídias 12 px, ações pill; evitar repetição de cartões decorativos.
6. **Espaçamento:** escala 4, 8, 12, 16, 24, 32, 48, 64, 96 e 128 px.
7. **Componentes:** navegação fixa e sempre visível, botões primário/secundário/texto, seletor de tema, cards de planos, detalhes de plano em dialog nativo, perguntas frequentes em details e rodapé.
8. **Estados:** hover discreto, active, foco visível, navegação mobile expandida, plano selecionado e dialog aberto/fechado. Sem simular cobertura, contratação ou integrações inexistentes.
9. **Motion:** feedback 160 ms; interface 260 ms; revelação pontual 600 ms, easing cubic-bezier(.2,.7,.2,1). prefers-reduced-motion desativa movimento e smooth scroll.
10. **Responsivo:** abaixo de 900 px, hero reduz escala e benefícios reorganizam; abaixo de 640 px, navegação compacta, cards empilhados, hero em 52 px, botões confortáveis e imagem com recorte próprio.

## Acessibilidade

HTML semântico, link para pular ao conteúdo, foco de teclado, rótulos em controles de ícone, contraste dos tokens, dialog com fechamento por Escape e restauração de foco, áreas de toque de no mínimo 44 px e tema persistido apenas neste navegador.

## Páginas internas

- `/servicos/`: explicação detalhada de fibra, Wi-Fi 6, mesh, instalação e suporte, com casa interativa, processo de instalação e perfis demonstrativos.
- `/planos/`: planos horizontais, pastas interativas com cinco miniaturas por plano, detalhes CardSwap e tabela de comparação acessível.
- `/clientes/`: relatos explicitamente ilustrativos, sem avaliações ou estatísticas apresentadas como reais. Filtros por assunto com estado `aria-pressed` e contagem anunciada por `aria-live`.
- Navegação e rodapé conectam todas as páginas. `aria-current` identifica a página ativa. Os tokens e a preferência de tema são compartilhados.
- Layout editorial com título e introdução em colunas no desktop; empilhamento no celular. Tabela com rolagem restrita ao seu contêiner em telas pequenas.

## Rolagem e profundidade — 26/09/2026

`dist/scroll-motion.js` e `dist/scroll-motion.css` são compartilhados pelas quatro rotas. A linha superior acompanha o progresso de leitura; a palavra do rodapé se desloca suavemente dentro do recorte. Imagens selecionadas da home e de Serviços usam parallax reversível dentro da própria moldura. Títulos, preços, botões, pastas e cenas React mantêm os controles existentes.

A cena mesh em Serviços representa dois equipamentos ilustrativos em CSS 3D, com faces, sombras e ligação de sinal. Rotação e altura acompanham a rolagem; ponteiro fino adiciona inclinação discreta com retorno amortecido. Sem capturar a roda do mouse nem adicionar um contexto WebGL.

Movimento reduzido mantém a cena estática, remove parallax e oculta a linha de progresso. Cálculos de efeitos locais limitados aos elementos próximos à janela; requestAnimationFrame sob demanda, sem loop permanente. Layout responsivo e texto explicativo independente dos efeitos.
