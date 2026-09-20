# React Bits — JS-CSS

Componentes instalados pelo CLI shadcn a partir dos registros oficiais:

- WarpText: https://reactbits.dev/r/WarpText-JS-CSS.json
- GradualBlur: https://reactbits.dev/r/GradualBlur-JS-CSS.json
- LetterGlitch: https://reactbits.dev/r/LetterGlitch-JS-CSS.json
- SpecularButton: https://reactbits.dev/r/SpecularButton-JS-CSS.json

Dependência declarada pelo WarpText: `ogl@^1.0.11`. GradualBlur não declara dependências adicionais. React e React DOM são usados na integração; esbuild gera os arquivos estáticos.

O código GradualBlur e os dois CSS correspondem integralmente ao registro. O WarpText preserva o desenho, os shaders e os parâmetros oficiais, com ajustes de integração:

- Verificação de WebGL 2 antes de inicializar OGL.
- Callbacks opcionais `onReady` e `onError` para manter um título HTML até o primeiro desenho e restaurá-lo em caso de falha/perda do contexto.
- Verificação e limpeza em caso de falha ao vincular o programa gráfico.
- `lineColors` permite manter a segunda linha na cor da marca, inclusive ao trocar o tema.
- A área útil do texto usa 96% da largura e 94% da altura para acompanhar a tipografia do título principal, com espaço para a distorção.

A sequência `split('\n')` foi preservada diretamente do JSON, pois o CLI a alterou indevidamente durante a instalação. A integração externa em `src/effects.jsx` gerencia preferência de movimento reduzido e carregamento próximo da área visível.

O LetterGlitch usa o código oficial, com limite de densidade de pixels em 2 e limpeza do temporizador de resize ao desmontar. Não declara dependências adicionais. A integração controla visibilidade, temas e movimento reduzido.

O SpecularButton usa o shader oficial e a configuração de brilho solicitada, com integração local para todas as páginas:

- Prop opcional `target` usa um portal para acrescentar somente a camada visual ao botão ou link HTML existente, sem recriar controles ou perder handlers, semântica e foco.
- Validação de WebGL 2, limpeza de recursos, limite de DPR em 2 e alternativa nativa em caso de falha.
- Renderização sob demanda: o loop se encerra após estabilizar a posição e intensidade da luz; o foco por teclado também aciona o brilho.
- A integração externa monta apenas os controles visíveis e respeita movimento reduzido, toque e visibilidade da aba.


O Folder vem de https://reactbits.dev/r/Folder-JS-CSS.json e não declara dependências. A estrutura visual e a animação originais foram adaptadas para o espaço dos cartões, com paleta verde, abertura controlada, botão nativo de abertura, arquivos em botões separados e rótulos em português. Apenas uma pasta fica aberta por vez. Os pop-ups usam dialog nativo, Escape, foco contido e retorno do foco ao arquivo. Movimento reduzido elimina as transições sem remover a funcionalidade.

O SpecularButton acompanha também os controles inseridos dinamicamente. As medidas de layout mantêm a borda alinhada em elementos transformados.
