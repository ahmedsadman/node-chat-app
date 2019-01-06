const { titleCase } = require('../utils/helper');

class Users {
    constructor() {
        this.users = [];
        this.rooms = [];
    }

    addUser(id, name, room) {
        const user = {
            id,
            name,
            room,
        };
        this.users.push(user);
        this.addRoom(room);
        return user;
    }

    addRoom(room) {
        if (this.rooms.indexOf(room) === -1) {
            this.rooms.push(room);
        }
    }

    removeRoom(room) {
        // remove a room only when no users exist in that room
        const exist = this.users.find(user => user.room === room);
        if (!exist) {
            this.rooms = this.rooms.filter(roomName => roomName !== room);
            console.log(`Removed room ${room}`);
        }
    }

    removeUser(id) {
        const user = this.getUser(id);
        if (user) {
            this.users = this.users.filter(user => user.id !== id);
            this.removeRoom(user.room);
        }
        return user;
    }

    getUser(id) {
        return this.users.find(user => user.id === id);
    }

    getRooms() {
        return this.rooms;
    }

    getUserList(room) {
        const users = this.users.filter(user => user.room === room);
        return users.map(user => user.name);
    }

    getUserByName(name, room) {
        return this.users.find(user => user.name === name && user.room === room);
    }
}

module.exports = {
    Users,
};
