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
