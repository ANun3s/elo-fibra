# React Bits — JS-CSS

Componentes instalados pelo CLI shadcn a partir dos registros oficiais:

- WarpText: https://reactbits.dev/r/WarpText-JS-CSS.json
- GradualBlur: https://reactbits.dev/r/GradualBlur-JS-CSS.json

Dependência declarada pelo WarpText: `ogl@^1.0.11`. GradualBlur não declara dependências adicionais. React e React DOM são usados na integração; esbuild gera os arquivos estáticos.

O código GradualBlur e os dois CSS correspondem integralmente ao registro. O WarpText preserva o desenho, os shaders e os parâmetros oficiais, com ajustes de integração:

- Verificação de WebGL 2 antes de inicializar OGL.
- Callbacks opcionais `onReady` e `onError` para manter um título HTML até o primeiro desenho e restaurá-lo em caso de falha/perda do contexto.
- Verificação e limpeza em caso de falha ao vincular o programa gráfico.

A sequência `split('\n')` foi preservada diretamente do JSON, pois o CLI a alterou indevidamente durante a instalação. A integração externa em `src/effects.jsx` gerencia pausa, preferência de movimento reduzido e carregamento próximo da área visível.
