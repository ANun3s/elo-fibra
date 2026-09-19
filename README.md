# elo — internet no ritmo da sua vida

Site conceitual de um provedor de internet residencial, com identidade original, layout responsivo e temas claro e escuro.

## Páginas

- `/`: apresentação, planos demonstrativos e perguntas frequentes.
- `/servicos/`: fibra óptica, Wi-Fi 6, rede mesh, instalação, suporte e comparação de planos.
- `/clientes/`: relatos ilustrativos com filtros por assunto.

## Executar localmente

O projeto usa HTML, CSS e JavaScript puros. Não requer instalação de pacotes ou etapa de build.

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

## Conteúdo demonstrativo

A marca, os planos e os valores são conceituais. Os relatos são explicitamente fictícios, não avaliações reais. Não há contratação, cobrança ou consulta de cobertura. A imagem da sala foi gerada por IA para este projeto.
