const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // emitted to the specific user who joined
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

    // emit to all except the joined user
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    // when user creates a message in his browser
    socket.on('createMessage', (message) => {
        console.log('createMessage: ', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
