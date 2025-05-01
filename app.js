// Importa o módulo express, usado para criar o servidor HTTP
const express = require('express')
// Importa o módulo path, usado para trabalhar com caminhos de arquivos
const path = require('path')
// Cria uma instância do express
const app = express()
// Define a porta que o servidor vai escutar (porta definida por variável de ambiente ou 4000)
const PORT = process.env.PORT || 4000
// Inicia o servidor e escuta na porta definida
const server = app.listen(PORT, () => console.log(`server on port ${PORT}`))
const fs = require('fs')

// Importa e configura o socket.io com o servidor HTTP criado
const io = require('socket.io')(server)

// Define a pasta 'public' como pasta de arquivos estáticos (HTML, CSS, JS do frontend)
app.use(express.static(path.join(__dirname, 'public')))

// Cria um Set para armazenar os IDs dos sockets conectados (evita duplicatas)
let socketsConected = new Set()

// Escuta eventos de conexão de novos clientes via WebSocket
io.on('connection', onConnected)

/*  Função chamada sempre que um novo cliente se conecta
  *  - Adiciona o ID do socket conectado ao conjunto
  *  - Emite para todos os clientes o número total de usuários conectados
  *  - Evento chamado quando o cliente se desconecta
  *  - Remove o ID do socket desconectado do conjunto
  *  - Atualiza todos os clientes com o novo total de usuários conectados
*/

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)
  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

 // Evento de mensagem: recebe dados do cliente e envia para todos os outros clientes (menos o remetente)
  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)

    //formata a mensagem para o log
    const logEntry = `[${new Date(data.dateTime).toISOString()}] ${data.name}: ${data.message}\n`

    //adiciona o arquivo ao log
    fs.appendFile('chat.log', logEntry, (err) => {
      if (err) {
        console.error('Erro ao escrever no arquivo de log:', err)
      } else {
        console.log('Mensagem registrada no log')
      }
    })
  })

// Evento de feedback: envia o status de "usuário está digitando" para os outros clientes
  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}

// O que esse servidor faz:

//     Hospeda arquivos estáticos (interface do chat).

//     Usa Socket.IO para comunicação em tempo real.

//     Conta e emite o número total de usuários online.

//     Repassa mensagens entre os clientes.

//     Exibe mensagens de "usuário está digitando..." para outros usuários.