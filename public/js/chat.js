const socket = io();

const element = {
    messages: document.getElementById('messages'),
    messageInput: document.querySelector('input[name="message"]'),
    locationButton: document.getElementById('send-location'),
    userList: document.getElementById('users'),
};

const scrollToBottom = () => {
    // heights
    const { clientHeight, scrollTop, scrollHeight } = element.messages;
    const newMessage = element.messages.querySelector('li:last-child');
    const lastMessage = element.messages.querySelector('li:nth-last-child(2)') || newMessage;
    const newMessageHeight = newMessage.clientHeight;
    const lastMessageHeight = lastMessage.clientHeight;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        console.log('Should scroll');
        // defined inside js/libs/animateScroll.js
        animateScrollTo(element.messages, scrollHeight, 800);
    }
};

socket.on('connect', () => {
    console.log('Connected to server');
    const params = getUrlParameters();

    socket.emit('join', params, (error) => {
        if (error) {
            alert(error);
            window.location.href = '/';
        } else {
            console.log('Join successful');
            document.getElementById('room-name').innerText = params.room;
            document.title = `${params.name} | Chat App`;
        }
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
    console.log('Users list', users);
    const ol = document.createElement('ol');

    users.forEach((user) => {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(user));
        ol.appendChild(li);
    });

    element.userList.innerHTML = ol.innerHTML;
});

socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = document.getElementById('message-template').innerHTML;
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
    });
    if (message.text.length) element.messages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = document.getElementById('location-message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url,
    });
    element.messages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
});

document.querySelector('#message-form').onsubmit = (e) => {
    e.preventDefault();
    socket.emit(
        'createMessage',
        {
            text: element.messageInput.value,
        },
        () => {},
    );
    element.messageInput.value = ''; // clear input
};

element.locationButton.onclick = (e) => {
    if (!navigator.geolocation) return alert('Geolocation is not supported by your browser');

    element.locationButton.disabled = true;
    element.locationButton.innerText = 'Sending Location';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });

            element.locationButton.disabled = false;
            element.locationButton.innerText = 'Send Location';
        },
        (error) => {
            alert('Unable to fetch location: ', error);
            element.locationButton.disabled = false;
            element.locationButton.innerText = 'Send Location';
        },
    );
};
