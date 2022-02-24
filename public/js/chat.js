const socket = io();
const form = document.querySelector('#message-form');
const locationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
    console.log(message);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    message = e.target.elements.message;
    socket.emit('sendMessage', message.value);
    message.value = '';
});

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        socket.emit('sendLocation', { latitude, longitude });
    }, (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }, { enableHighAccuracy: true });
});