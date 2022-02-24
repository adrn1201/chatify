const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const io = new Server(server);

const ejsMate = require('ejs-mate');
const Filter = require('bad-words');
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

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }

        io.emit('message', message);
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        const { latitude, longitude } = coords;
        io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!');
    });
});

server.listen(port, () => {
    console.log(`Serving on port ${port}!`);
});