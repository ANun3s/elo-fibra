# elo — internet no ritmo da sua vida

Site conceitual de um provedor de internet residencial, com identidade original, layout responsivo e temas claro e escuro.

## Páginas

- `/`: apresentação, planos demonstrativos e perguntas frequentes.
- `/servicos/`: fibra óptica, Wi-Fi 6, rede mesh, instalação, suporte e comparação de planos.
- `/clientes/`: relatos ilustrativos com filtros por assunto.

## Executar localmente

As páginas usam HTML, CSS e JavaScript, com duas ilhas React na página inicial: WarpText e GradualBlur, do React Bits. Os arquivos publicados em `dist` já incluem o bundle dos efeitos.

Para editar os componentes React, instale Node.js e pnpm, depois execute:

```sh
pnpm install --frozen-lockfile
pnpm run build
```

O build gera apenas `dist/assets/effects.js`, `effects.css` e os avisos de licença. Ele preserva os arquivos HTML, estilos e imagens existentes. Após alterações em `src`, gere novamente o bundle antes de publicar.

Na pasta do projeto, execute com Python 3:

```sh
python3 -m http.server 4173 --directory dist
```

Abra `http://localhost:4173`. Sirva a pasta `dist` como raiz do site: os links das páginas internas usam caminhos absolutos a partir dessa raiz.

## Estrutura

```text
dist/
  index.html            # Página inicial
  servicos/index.html   # Serviços
  clientes/index.html   # Experiências dos clientes
  styles.css            # Tokens e estilos compartilhados
  pages.css             # Estilos das páginas internas
  app.js                # Tema, menu, detalhes de planos e filtros
  assets/living-room.png
  assets/effects.*      # Bundle React gerado e avisos de licença
src/
  effects.jsx          # Integração dos efeitos, pausa e alternativa estática
  warp-section.css     # Composição visual das ilhas React
  components/          # Componentes JS-CSS do registro oficial React Bits
scripts/build.mjs      # Bundle isolado com esbuild
DESIGN-SYSTEM.md         # Direção visual e regras de interface
.openai/hosting.json     # Identificação da publicação existente no Sites
```

Os arquivos em `dist` são o código-fonte editável e devem permanecer versionados. Para hospedar, publique essa pasta em um servidor de arquivos estáticos com suporte a `index.html` em subdiretórios. A publicação atual usa Sites; enviar o código ao GitHub não configura implantação automática.

## Interações e acessibilidade

- Tema persistido no navegador e preferência inicial do sistema.
- Navegação mobile com estado acessível.
- Detalhes de planos em diálogo nativo, com retorno do foco.
- Filtros de relatos com indicação da seleção e contagem anunciada.
- Navegação por teclado, foco visível, HTML semântico e redução de movimento.
- WarpText em uma faixa verde antes dos planos, com os parâmetros solicitados. A GPU só é inicializada perto da área visível; o componente pausa a renderização fora da tela e quando a aba está oculta.
- Botão para pausar/retomar. Movimento reduzido ou WebGL 2 indisponível mantém o título HTML legível; perda do contexto gráfico também restaura o texto.
- GradualBlur na base da foto principal: 6rem, intensidade 2, cinco camadas, curva bezier e progressão exponencial. A legenda fica acima do desfoque e o efeito não intercepta cliques.

## Conteúdo demonstrativo

A marca, os planos e os valores são conceituais. Os relatos são explicitamente fictícios, não avaliações reais. Não há contratação, cobrança ou consulta de cobertura. A imagem da sala foi gerada por IA para este projeto.
