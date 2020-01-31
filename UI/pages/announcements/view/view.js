
const apiHost = 'https://an-it-p.herokuapp.com/api/v1';

const getAnnouncement = () => {

    const urlParams = new URLSearchParams(window.location.search);
    const annId = +urlParams.get('id');

    const url = new URL(`${apiHost}/announcements/${annId}`);

    fetch(url.toString(),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": JSON.parse(localStorage.getItem('session')).token
            }
        })
        .then(res => res.json())
        .then(final => {
            if (final.status === 'success') {
                renderAnnouncement(final.data[0]);
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            throw (err);
        });
}

const renderAnnouncement = (announcement) => {
    const title = document.querySelector("[data-an__title]");
    const status = document.querySelector("[data-an__status]");
    const text = document.querySelector("[data-an__text]");

    title.innerText = announcement.title;
    status.innerText = String(announcement.status).toUpperCase();
    text.innerText = announcement.text;
}

const initViewAnnouncementPage = () => {

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
        getAnnouncement();
    } else {
        userLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'block';
        dropDownLinksAuth.style['display'] = 'none';
        window.location.href = 'pages/signin';
    }
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

document.addEventListener("DOMContentLoaded", (event) => {
    initViewAnnouncementPage();
});