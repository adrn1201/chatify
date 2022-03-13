const joinForm = document.querySelector('#join-form');

joinForm.addEventListener('submit', function(e) {
    const username = this.elements.username;
    if (/\s/g.test(username.value)) {
        e.preventDefault();
        return swal('Display name should not contain spaces!');
    }
});