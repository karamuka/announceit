const apiHost = 'https://an-it-p.herokuapp.com/api/v1';

const createAnnouncement = (event) => {
    event.preventDefault();

    setLoading(true);

    const announcement = {};
    const fields = document.querySelectorAll(".form-control input, .form-control textarea");
    fields.forEach(({ name, value }) => {
        announcement[name] = value;
    });

    fetch(`${apiHost}/announcements`,
        {
            method: "POST",
            body: JSON.stringify(announcement),
            headers: {
                "Content-Type": "application/json",
                "Authorization": JSON.parse(localStorage.getItem('session')).token
            }
        })
        .then(res => res.json())
        .then(final => {
            setLoading(false);
            if (final.status === 'success') {
                displayMessage(final.status, false);
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

const initCreateAnnouncementPage = () => {

    const session = JSON.parse(localStorage.getItem('session'));
    const currentUser = document.querySelector("[data-current__user]");
    const dropDownLinks = document.querySelector("[data-dropdown__menu__links]");
    const dropDownLinksAuth = document.querySelector("[data-dropdown__menu__links__auth]");
    const navLinks = document.querySelector("[data-nav__links]");
    const userLinks = document.querySelector("[data-user__links]");

    if (session) {
        navLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'none';
        dropDownLinksAuth.style['display'] = 'block';
        userLinks.style['display'] = 'block';
        currentUser.innerHTML = 'Howdy ' + session.firstName;
    } else {
        userLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'block';
        dropDownLinksAuth.style['display'] = 'none';
        window.location.href = 'pages/signin';
    }
}

const setLoading = (isLoading = true) => {
    const actionBtn = document.querySelector("[data-action__dispatcher]");
    const dataMain = document.querySelector("[data-main]");
    const dataFetch = document.querySelector("[data-fetching]");

    if (isLoading) {
        dataMain.style['display'] = 'none';
        dataFetch.style['display'] = 'block';
        actionBtn.style['opacity'] = 0.7;
        actionBtn.setAttribute('disabled', true);
    } else {
        dataMain.style['display'] = 'block';
        dataFetch.style['display'] = 'none';
        actionBtn.style['opacity'] = 1;
        actionBtn.removeAttribute('disabled');
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    initCreateAnnouncementPage();
});
