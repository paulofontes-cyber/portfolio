# Paulo Fontes — Portfólio

Portfólio pessoal desenvolvido em React e Vite. O conteúdo está em português e reúne projetos selecionados, experiência, pesquisa e competências com base no currículo atualizado, em repositórios e em projetos desenvolvidos durante a Software Residency.

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite. Para gerar a versão estática:

```bash
npm run build
npm run preview
```

Para formatar os arquivos da aplicação, use `npm run format`.

O diretório `dist/` é o resultado da compilação. O `base: './'` em `vite.config.js` permite publicar em subdiretórios, como GitHub Pages.

## Organização

| Caminho | Conteúdo |
| --- | --- |
| `src/App.jsx` | Estrutura da página e interações |
| `src/content.js` | Projetos, experiência, habilidades e links |
| `src/styles.css` | Sistema visual, layout responsivo e animações |
| `public/` | Retrato, favicon e capturas dos projetos usados no site |
| `legacy/site-v1/` | Código da primeira versão do portfólio |
| `Portfólio - 1241181583/` | Exercícios antigos mantidos como arquivo histórico |

Para atualizar projetos ou experiência, edite `src/content.js`. O contato abre o aplicativo de e-mail do visitante; não há formulário que simule envio nem dependência de serviço externo de mensagens.

## Conteúdo e créditos

Os projetos selecionados apontam para os repositórios públicos da [Reports API](https://github.com/UNIT-Residencia-2-Squad-5/ReportsAPI), da [interface de relatórios](https://github.com/UNIT-Residencia-2-Squad-5/ReportsFrontend), do [SVO](https://github.com/paulofontes-cyber/Website-SVO) e da [interface de pesquisa](https://github.com/paulofontes-cyber/IC_INTERFACE_V1). O repositório da JotaNunes está na organização `ResidenciaJotanunes` e não é acessível publicamente; por isso, o portfólio aponta para o [protótipo do projeto no Figma](https://www.figma.com/proto/uxwuNwpQgbfX5eOc4Ju85K/JOTANUNES?node-id=117-1192&starting-point-node-id=117%3A1192).

O site traz progresso de leitura, navegação ativa, paralaxe sutil e uma linha de experiência que acompanha a rolagem. Esses efeitos usam `requestAnimationFrame` e respeitam `prefers-reduced-motion`. A navegação por teclado continua disponível.
