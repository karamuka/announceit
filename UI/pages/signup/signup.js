const apiHost = 'https://an-it-p.herokuapp.com';

const signUp = (event) => {
    event.preventDefault();

    const user = {};
    const fields = document.querySelectorAll(".form-control input");
    fields.forEach(({ name, value }) => {
        user[name] = value;
    });

    fetch(`${apiHost}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(final => {
            if (final.status === 'success') {
                localStorage.setItem("session", JSON.stringify(final.data));
                window.location.href = 'pages/announcements';
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            displayMessage(err.message || err, true);
        });
}

const displayMessage = (message, isError = false) => {
    const dialog = document.querySelector("[data-dialog]");
    const dialogMessage = document.querySelector("[data-dialog__message]");

    dialog.className = isError ? 'dialog-error' : 'dialog-info';
    dialogMessage.innerHTML = String(message).toLocaleUpperCase();
    dialog.style['display'] = 'block';

    setTimeout(() => {
        dialog.style['display'] = 'none';
    }, 5000);
}