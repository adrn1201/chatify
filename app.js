const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const io = new Server(server);

const ejsMate = require('ejs-mate');
const port = process.env.PORT || 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined!');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!');
    });
});

server.listen(port, () => {
    console.log(`Serving on port ${port}!`);
});