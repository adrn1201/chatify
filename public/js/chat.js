const socket = io();
const form = document.querySelector('#message-form');

socket.on('message', (message) => {
    console.log(message);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    message = e.target.elements.message;
    socket.emit('sendMessage', message.value);
    message.value = '';
});