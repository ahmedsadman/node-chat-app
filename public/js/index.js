const socket = io();

const element = {
    messages: document.getElementById('messages'),
    messageInput: document.querySelector('input[name="message"]'),
    locationButton: document.getElementById('send-location'),
};

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('newMessage: ', message);
    const html = `<li>${message.from}: ${message.text}</li>`;
    element.messages.insertAdjacentHTML('beforeend', html);
});

socket.on('newLocationMessage', (message) => {
    const html = `<li>${message.from}: <a href="${message.url}" target="_blank">My Current Location</a></li>`;
    element.messages.insertAdjacentHTML('beforeend', html);
});

document.querySelector('#message-form').onsubmit = (e) => {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: element.messageInput.value,
    }, () => {
        console.log('Got it!');
    });
    element.messageInput.value = ''; // clear input
};

element.locationButton.onclick = (e) => {
    if (!navigator.geolocation) return alert('Geolocation not supported by your browser');

    element.locationButton.disabled = true;
    element.locationButton.innerText = 'Sending Location';

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });

        element.locationButton.disabled = false;
        element.locationButton.innerText = 'Send Location';
    }, (error) => {
        alert('Unable to fetch location: ', error);
        element.locationButton.disabled = false;
        element.locationButton.innerText = 'Send Location';
    });
};
