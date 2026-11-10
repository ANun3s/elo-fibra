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


Folder usa o registro oficial JS-CSS em `docs/Folder-JS-CSS.registry.json` (https://reactbits.dev/r/Folder-JS-CSS.json), sem dependências adicionais. A fonte e o CSS oficiais foram atualizados em 15/10/2026. Na página de planos, cada pasta contém cinco miniaturas com os tópicos do plano; ao escolher uma, o diálogo CardSwap abre com o tópico selecionado em destaque e permite navegar pelos demais. Cores, escala, rótulos em português e controle de abertura seguem o projeto. Apenas uma pasta fica aberta por vez. Dialog nativo, Escape, foco contido e retorno para a pasta preservam acessibilidade; `prefers-reduced-motion` é respeitado pelo componente.

O SpecularButton acompanha também os controles inseridos dinamicamente. As medidas de layout mantêm a borda alinhada em elementos transformados.

A base da identidade usa preto, branco e cinza. Pastas e botões usam azul-marinho com texto branco. O WarpText mantém a distorção, com refraction=0 na integração para evitar franjas coloridas. As fotografias preservam suas cores originais.


FoldText e BubbleMenu foram instalados a partir de https://reactbits.dev/r/FoldText-JS-CSS.json e https://reactbits.dev/r/BubbleMenu-JS-CSS.json. Ambos declaram gsap@^3.13.0. Os arquivos foram restaurados diretamente dos JSONs antes da adaptação para preservar escapes.

FoldText mantém a animação e os parâmetros de dobra originais. A integração usa trigger=mount para repetir a cada abertura da resposta, fonte e cor herdadas e stagger limitado a 0,65 segundo no parágrafo inteiro. A divisão por caracteres agrupa palavras para evitar quebras no meio delas. Movimento reduzido exibe tudo imediatamente.

BubbleMenu ganhou modo inline para preservar os links do rodapé visíveis e acessíveis, com entrada por IntersectionObserver, rotação suave de 5 graus, paleta azul-marinho e GSAP com limpeza ao desmontar. O modo inline usa navegação comum, sem semântica de menu de aplicativo.

FoldText aceita reversed e onReverseComplete para reverter a mesma timeline, incluindo interrupções. A integração mantém details aberto durante o recolhimento e o fecha ao concluir a dobra; cliques repetidos alternam a direção sem recriar a animação.

## PillNav
Fonte: https://reactbits.dev/r/PillNav-JS-CSS.json (JS-CSS). Dependências declaradas instaladas: gsap e react-router-dom. A geometria e os timelines dos círculos do componente original foram preservados. Adaptações elo: links nativos para as três páginas estáticas, estilos isolados do BubbleMenu, logo como botão retrátil, Escape, inert nos controles recolhidos, layout móvel, movimento reduzido e ações de tema/planos.

## InfiniteMenu
Fonte exata: https://reactbits.dev/r/InfiniteMenu-JS-CSS.json. Dependência: gl-matrix ^3.4.3. Preserva esfera, discos, shaders e controle arcball do React Bits. Adaptado aos seis relatos ilustrativos existentes, com monogramas SVG locais, área de leitura, controles anterior/próximo, lista HTML acessível, movimento reduzido, fallback WebGL, pausa fora da tela e liberação do contexto ao desmontar. O toque vertical preserva a rolagem da página.

## DecryptedText
Fonte: https://reactbits.dev/r/DecryptedText-JS-CSS.json. Dependência oficial motion ^12.23.12 instalada. Código do registro preservado e estendido com animateOn="scroll", scrollVelocity e disabled. Um único listener passivo mede a velocidade; os intervalos variam de 85 a 25 ms e a revelação de 850 a 280 ms, sem reiniciar o progresso. Disparo na entrada durante rolagem; termina ao parar e cancela fora da tela/aba. Texto original estável para leitores de tela e células com largura original para evitar mudança de layout. Somente parágrafos de apoio de uma lista explícita são aprimorados. Títulos, hero, planos, comparação, FAQ, relatos animados, menus e botões são excluídos. Respeita prefers-reduced-motion.


GradualBlur global: fonte reconferida no registro oficial, idêntica à versão existente e sem novas dependências. A ilha page-blur monta uma faixa fixa inferior nas três páginas (4–6rem, strength 2, cinco camadas, curva bezier exponencial). Não captura eventos, desaparece no final da página, durante diálogos e navegação por teclado; respeita movimento/transparência reduzidos e impressão. O desfoque local da imagem inicial permanece.

## GooeyNav
Fonte: https://reactbits.dev/r/GooeyNav-JS-CSS.json (JS-CSS), sem dependências adicionais. Integrado somente aos atalhos Fibra/Wi-Fi/Instalação na página de serviços, com os parâmetros solicitados (15 partículas, distâncias 90/10, raio 100, 600ms e variação 300ms). Mantém os links nativos e Enter, sincroniza o item ativo com o hash, limpa temporizadores, respeita movimento reduzido e exclui SpecularButton nesta ilha. Estilos/partículas isolados, paleta navy e filtro SVG para preservar as cores em ambos os temas.

## Lanyard / equipe
Fonte exata: https://reactbits.dev/r/Lanyard-JS-CSS.json. O registro não declara dependências, mas os imports requerem three, @react-three/fiber, @react-three/drei, @react-three/rapier e meshline, instalados explicitamente. React/React DOM alinhados a 19.2.x conforme o peer dependency do Fiber; pnpm peers check passa.

card.glb e lanyard.png oficiais de DavidHDev/react-bits, src/assets/lanyard. Esbuild usa loaders de arquivo para GLB/PNG (este projeto não usa Vite). Física, corda, malha e composição independente das faces preservadas. Adaptações: imports locais, DPR limitado a 1.5, limpeza da textura composta, interpolação limitada após pausas, cancelamento de ponteiro, callbacks de prontidão/interação e acabamento fosco com material básico para preservar o contraste do texto do crachá. A câmera usa a posição/gravity solicitadas, com fov 14 para dar destaque ao perfil.

A seção estática /servicos/#equipe apresenta três perfis explicitamente demonstrativos e ilustrações SVG autorais. O bundle 3D é separado e carregado somente perto da seção; os canvases existem somente para crachás visíveis e com a aba ativa. Fallback estático para movimento reduzido, ausência de JavaScript e falha de WebGL/carregamento. Conteúdo dos perfis permanece em HTML acessível. Touch-action pan-y preserva a rolagem vertical.

## Revisão de experiência — 2026-09-20
PillNav passou a permanecer aberto e fixo, com links centralizados no desktop, alvos de 44 px no celular e compensação automática de altura. A logo volta para a página inicial. O estado ativo acompanha Planos por hash. O cabeçalho HTML anterior ao React agora usa a mesma estrutura visual.

A introdução WarpText/LetterGlitch dura até 4,5 segundos, depois restaura o título HTML. O desfoque global foi reduzido a 20–32 px e aparece apenas durante a rolagem. DecryptedText atua uma vez, em apoio curto, com duração menor; FoldText mantém abertura e reversão com menor espera. O observador de SpecularButton ignora mutações que não adicionam/removem controles. As pastas foram colocadas depois do preço, benefícios e CTA no DOM. Consulte `docs/design-audit.md` para evidências e limites da revisão.

Ajuste posterior solicitado: WarpText e LetterGlitch voltaram a permanecer ativos enquanto o início está visível e a aba ativa, sem encerramento após 4,5 s. Movimento reduzido continua respeitado. A grade inline de BubbleMenu não herda mais a margem especial do quarto item do menu original, mantendo os quatro balões com o mesmo espaço.

2026-09-21: rodapé substituído, a pedido do usuário, por layout editorial baseado na referência fornecida: duas colunas de links, divisória com losango, metadados e marca elo ampliada. O novo rodapé estático é comum às três páginas, usa os tokens de tema e substitui a integração BubbleMenu anterior.

## AccordionGallery — serviços na página inicial
Fonte: https://reactbits.dev/r/AccordionGallery-JS-CSS.json (cópia do registro em docs/AccordionGallery-JS-CSS.registry.json). Dependência GSAP ^3.13.0 atendida pela versão ^3.15.0 instalada. Adaptações: links semânticos, rótulos em português, carregamento lazy das imagens, setas movem o foco, hover apenas em dispositivos compatíveis e layout vertical em telas pequenas. Integração em src/service-gallery.jsx; fotos ilustrativas do Unsplash e imagem residencial existente. As dúvidas permanecem em /planos/#duvidas.
Fotos: images.unsplash.com/photo-1558494949-ef010cbdcc31 (infraestrutura), photo-1496181133206-80ce9b88a853 (computador), photo-1521737711867-e3b97375f902 (equipe).

## CardSwap — detalhes dos planos
Fonte oficial: https://reactbits.dev/r/CardSwap-JS-CSS.json; registro original preservado em docs/CardSwap-JS-CSS.registry.json. GSAP já instalado satisfaz ^3.13.0. Componente adaptado com método next(), avanço manual, limpeza de timelines, bloqueio de cliques durante transições, suporte a movimento reduzido e cartões inativos fora do foco/leitura. Janela compartilhada entre Ver detalhes e arquivos das pastas; fecha por X, Esc ou clique externo e devolve foco ao controle original. A troca automática foi desativada para permitir a leitura. Interface segue temas claro/escuro e usa área rolável em telas baixas.
