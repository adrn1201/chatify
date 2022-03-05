const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const io = new Server(server);

const ejsMate = require('ejs-mate');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');
const port = process.env.PORT || 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error)
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`));

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }

        io.emit('message', generateMessage(message));
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        const { latitude, longitude } = coords;
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
        }
    });
});

server.listen(port, () => {
    console.log(`Serving on port ${port}!`);
});