# Casa do Morango Prime

Landing page da Casa do Morango Prime, em Santa Bárbara d’Oeste. Desenvolvida com React, TypeScript e Vite, com imagens ilustrativas Prime baseadas em `inspiração.png`, flutuação automática e esteira contínua de benefícios.

## Executar localmente

```sh
npm install
npm run dev
```

Abra `http://localhost:5173`. Os dados da loja e os links de contato ficam em `src/constants/business.ts`.

## Verificação

```sh
npm run build
npm run lint
npm exec playwright -- test
```

Os testes utilizam o Google Chrome instalado e verificam desktop e celular, navegação, pedidos por WhatsApp, movimento automático, movimento reduzido e falha no carregamento da imagem. O servidor local é iniciado automaticamente, se necessário.

Com o servidor ativo, `node scripts/visual-check.mjs` gera capturas em cinco larguras e verifica transbordamento horizontal. Os arquivos de revisão ficam em `.cache/`, fora do Git.

## Publicação

O build estático é gerado em `dist/`. Defina `VITE_SITE_URL` com o domínio HTTPS definitivo, conforme `.env.example`, para incluir o endereço canônico e a imagem de compartilhamento nos metadados.

As fontes e imagens são servidas localmente. Os créditos e licenças estão em `public/credits.html`. A preferência por movimento reduzido desativa a animação do topo e suaviza a flutuação na seção de cuidado. A esteira inicia automaticamente, pausa no hover ou foco pelo teclado e retoma ao retirar o mouse ou o foco.
