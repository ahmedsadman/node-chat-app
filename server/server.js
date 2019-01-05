const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id); // remove from previous room, if any
        users.addUser(socket.id, params.name, params.room);

        // tell everyone to update their user list
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // emitted to the specific user who joined
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

        // emit to all except the joined user
        socket.broadcast
            .to(params.room)
            .emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    // when user creates a message in his browser
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage: ', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit(
            'newLocationMessage',
            generateLocationMessage('Admin', coords.latitude, coords.longitude),
        );
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        const user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
