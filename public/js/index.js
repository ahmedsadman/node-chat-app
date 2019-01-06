const socket = io();

const updateRoomsList = (rooms) => {
    const el = document.getElementById('active-rooms-selection');
    el.innerHTML = '';

    rooms.forEach((room) => {
        const option = document.createElement('option');
        const text = document.createTextNode(room);
        option.setAttribute('value', room);
        option.appendChild(text);
        el.appendChild(option);
    });

    document.getElementsByClassName('active-count')[0].innerText = `(${rooms.length})`;
};

document.getElementById('active-rooms-selection').onchange = (e) => {
    document.querySelector('input[name="room"]').value = e.target.value;
};

document.getElementById('active-rooms-selection').onclick = (e) => {
    document.querySelector('input[name="room"]').value = e.target.value;
};

// basic form validation on submit
document.getElementById('join-form').onsubmit = (e) => {
    let isValid = true;

    document.querySelectorAll('input').forEach((item) => {
        const input = item.value;
        if (!typeof input === 'string' || !input.trim().length > 0) {
            isValid = false;
        }
    });

    if (!isValid) {
        e.preventDefault();
        alert('Room and Display names are required');
    }
};

socket.emit('getActiveRooms', rooms => updateRoomsList(rooms));

socket.on('updateActiveRooms', rooms => updateRoomsList(rooms));
