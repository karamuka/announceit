const apiHost = 'https://an-it-p.herokuapp.com/api/v1';

const signIn = (event) => {
    event.preventDefault();
    setLoading(true);
    const user = {};
    const fields = document.querySelectorAll(".form-control input");
    fields.forEach(({ name, value }) => {
        user[name] = value;
    });

    fetch(`${apiHost}/auth/signin`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(final => {
            setLoading(false);
            if (final.status === 'success') {
                localStorage.setItem("session", JSON.stringify(final.data));
                window.location.href = 'pages/announcements';
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            setLoading(false);
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

const initSigInPage = () => {
    localStorage.removeItem('session');
    const dropDownLinks = document.querySelector("[data-dropdown__menu__links]");
    const dropDownLinksAuth = document.querySelector("[data-dropdown__menu__links__auth]");
    const navLinks = document.querySelector("[data-nav__links]");
    const userLinks = document.querySelector("[data-user__links]");

    navLinks.style['display'] = 'block';
    dropDownLinks.style['display'] = 'block';
    dropDownLinksAuth.style['display'] = 'none';
    userLinks.style['display'] = 'none';
}

const setLoading = (isLoading = true) => {
    const actionBtn = document.querySelector("[data-action__dispatcher]");
    if (isLoading) {
        actionBtn.style['opacity'] = 0.7;
        actionBtn.setAttribute('disabled', true);
    } else {
        actionBtn.style['opacity'] = 1;
        actionBtn.removeAttribute('disabled');
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    initSigInPage();
});