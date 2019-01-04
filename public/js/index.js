const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('newMessage: ', message);
    const html = `<li>${message.from}: ${message.text}</li>`;
    document.getElementById('messages').insertAdjacentHTML('beforeend', html);
});

document.querySelector('#message-form').onsubmit = (e) => {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: document.querySelector('input[name="message"]').value,
    }, () => {
        console.log('Got it!');
    });
    document.querySelector('input[name="message"').value = ''; // clear input
};
