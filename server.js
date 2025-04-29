const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (_req,res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`usuario conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
        console.log(messages);
        
    });
});

server.listen(5500, () => {
    console.log('Servidor rodando na porta 5500');
});
// Socket.io connection
console.log('Server is running on http://localhost:127.0.0.1:500');

