# elo — internet no ritmo da sua vida

Site conceitual de um provedor de internet residencial, com identidade original, layout responsivo e temas claro e escuro.

## Páginas

- `/`: apresentação, planos demonstrativos e perguntas frequentes.
- `/servicos/`: fibra óptica, Wi-Fi 6, rede mesh, instalação, suporte e comparação de planos.
- `/clientes/`: relatos ilustrativos com filtros por assunto.

## Executar localmente

As páginas usam HTML, CSS e JavaScript, com efeitos React na página inicial: WarpText, GradualBlur, LetterGlitch, Folder e SpecularButton, do React Bits. Os arquivos publicados em `dist` já incluem o bundle dos efeitos.

Para editar os componentes React, instale Node.js e pnpm, depois execute:

```sh
pnpm install --frozen-lockfile
pnpm run build
```

O build gera `dist/assets/effects.js`, `effects.css`, `specular-buttons.js`, `specular-buttons.css` e os avisos de licença. Ele preserva os arquivos HTML, estilos e imagens existentes. Após alterações em `src`, gere novamente o bundle antes de publicar.

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
  assets/effects.*      # Efeitos da abertura e avisos de licença
  assets/specular-buttons.* # Brilho dos botões nas três páginas
src/
  effects.jsx          # Integração dos efeitos e alternativa estática
  plan-folders.jsx     # Pastas dos três planos e pop-ups de vantagens
  plan-folders.css     # Pastas verdes responsivas e janelas de detalhes
  warp-section.css     # Composição visual das ilhas React
  specular-buttons.jsx # Integração do brilho com os controles HTML existentes
  specular-buttons.css # Ajustes visuais dos botões
  components/          # Componentes JS-CSS do registro oficial React Bits
scripts/build.mjs      # Bundle isolado com esbuild
DESIGN-SYSTEM.md         # Direção visual e regras de interface
.openai/hosting.json     # Identificação da publicação existente no Sites
```

Os arquivos em `dist` são o código-fonte editável e devem permanecer versionados. Para hospedar, publique essa pasta em um servidor de arquivos estáticos com suporte a `index.html` em subdiretórios. A publicação atual usa Sites; enviar o código ao GitHub não configura implantação automática.

## Interações e acessibilidade

- Tema persistido no navegador e preferência inicial do sistema.
- SpecularButton nos botões, ações de plano, filtros, menu, tema, navegação de serviços e perguntas frequentes. O shader usa a configuração solicitada; as cores, rótulos e ações originais permanecem. Apenas os controles visíveis criam canvas, e a renderização para quando o brilho se estabiliza. Em toque, movimento reduzido ou sem WebGL 2, os controles mantêm o comportamento nativo.
- Navegação mobile com estado acessível.
- Uma pasta interativa em cada plano, com arquivos clicáveis de velocidade, Wi-Fi e usos. Os detalhes abrem em diálogo nativo, com Escape, foco contido e retorno ao arquivo. Uma única pasta fica aberta por vez; toque e teclado são suportados.
- Filtros de relatos com indicação da seleção e contagem anunciada.
- Navegação por teclado, foco visível, HTML semântico e redução de movimento.
- Uma única instância de WarpText no título principal, preservando o texto, as quebras responsivas e as duas cores da identidade. Os parâmetros de distorção seguem a configuração solicitada; a tipografia e a altura acompanham o título existente. A GPU só é inicializada perto da área visível; o componente pausa a renderização fora da tela e quando a aba está oculta.
- LetterGlitch no fundo da abertura, com atualização de 50ms, suavização e vinheta central. Opacidade de 24% no tema claro e 20% no escuro, ainda menor no celular; uma máscara suaviza as bordas. O fundo é decorativo e não intercepta cliques.
- Animações automáticas sem botão na interface. Movimento reduzido ou WebGL 2 indisponível mantém o título HTML legível; perda do contexto gráfico também restaura o texto.
- O LetterGlitch é desmontado fora da área visível e quando a aba está oculta; a preferência de movimento reduzido desativa as duas animações.
- Espaçamento das seções ampliado para 136px no desktop e 88px no celular.
- GradualBlur na base da foto principal: 6rem, intensidade 2, cinco camadas, curva bezier e progressão exponencial. A legenda fica acima do desfoque e o efeito não intercepta cliques.

## Conteúdo demonstrativo

A marca, os planos e os valores são conceituais. Os relatos são explicitamente fictícios, não avaliações reais. Não há contratação, cobrança ou consulta de cobertura. A imagem da sala foi gerada por IA para este projeto.
