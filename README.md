# Projeto: Site com Chat em Tempo Real e Integração com Twitch

## Descrição

Este é um site simples, desenvolvido com HTML e CSS básico, sem o uso de frameworks como Tailwind CSS ou Bootstrap. Ele foi projetado especificamente para computadores com tela no formato 16:9, sem foco em responsividade.

O projeto tem como principal objetivo demonstrar conhecimentos em:

- HTML e CSS básico
- JavaScript com Node.js
- Aplicação de APIs e bibliotecas com foco no desenvolvimento *server-side*
- Integração entre o lado do servidor e o cliente

## Funcionalidades

- **Chat online em tempo real** usando WebSockets
  - Validação de campo de mensagem
  - Armazenamento das mensagens em log

- **Integração com a API da Twitch.tv**
  - Exibição interativa do conteúdo atual do canal **FuriaTV**
 
- **Integração com a API da PandaScore**
  - Exibe as informações sobre as futuras partidas da FURIA  

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- WebSockets
- API da Twitch.tv
- API da PandaScore
- express
- socket.io
- nodemon

---

## Observações

- Este site é voltado para fins de demonstração e aprendizado.
- Não possui layout responsivo ou suporte para dispositivos móveis.
- os arquivos presentes na pasta 'public' são os principais para a exibição em tela, sendo o `main.html` o conteúdo do home e o `index.html` o conteúdo do chat.
- o arquivo `app.js` é responsavel pela inicialização do servidor utilizando o socket.io.
- o `main.js` faz ligação do client-side com o server-side buscando as informações passadas pelos usuários e direcionando-a para o server e depois o caminho inverso.
- o arquivo `chat.log` contem as informações salvas pelo site que foram passadas pelo chat.
- Para iniciar o servidor usar a seguinte syntaxe no terminal:
  
  `npm run dev`

em seguida em seu navegador escrever `localhost:4000/`

- foi criado um script dentro do package.json para facil inicilização, entretando, é necessario as seguintes ferramentas: nodemon, socket.io, express.
