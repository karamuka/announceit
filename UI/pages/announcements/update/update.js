
const apiHost = 'https://an-it-p.herokuapp.com/api/v1';

const getAnnouncement = () => {

    setLoading(true);

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
            setLoading(false);
            if (final.status === 'success') {
                renderAnnouncement(final.data[0]);
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            setLoading(false);
            throw (err);
        });
}

const updateAnnouncement = (event) => {
    event.preventDefault();

    setLoading(true);

    const urlParams = new URLSearchParams(window.location.search);
    const annId = +urlParams.get('id');
    const url = new URL(`${apiHost}/announcements/${annId}`);

    const announcement = {};
    const fields = document.querySelectorAll(".form-control input, .form-control textarea");
    fields.forEach(({ name, value }) => {
        announcement[name] = value;
    });

    fetch(url.toString(),
        {
            method: "PATCH",
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
                displayMessage(final.message);
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            setLoading(false);
            throw (err);
        });
}

const updateAnnouncementStatus = (newStatus) => {

    setLoading(true);

    const urlParams = new URLSearchParams(window.location.search);
    const annId = +urlParams.get('id');
    const url = new URL(`${apiHost}/announcements/${annId}`);

    fetch(url.toString(),
        {
            method: "PATCH",
            body: JSON.stringify({ status: newStatus }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": JSON.parse(localStorage.getItem('session')).token
            }
        })
        .then(res => res.json())
        .then(final => {
            setLoading(false);
            if (final.status === 'success') {
                displayMessage(final.message);
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            setLoading(false);
            throw (err);
        });
}

const renderAnnouncement = (announcement) => {
    const title = document.querySelector("[data-ann__title]");
    const text = document.querySelector("[data-ann__text]");
    const start = document.querySelector("[data-ann__start]");
    const end = document.querySelector("[data-ann__end]");
    const status = document.querySelector("[data-filter__status]");

    status.value = announcement.status;
    title.value = announcement.title;
    text.value = announcement.text;
    start.value = announcement.startDate;
    end.value = announcement.endDate;
}

const initUpdateAnnouncementPage = () => {

    const session = JSON.parse(localStorage.getItem('session'));
    const currentUser = document.querySelector("[data-current__user]");
    const dropDownLinks = document.querySelector("[data-dropdown__menu__links]");
    const dropDownLinksAuth = document.querySelector("[data-dropdown__menu__links__auth]");
    const navLinks = document.querySelector("[data-nav__links]");
    const userLinks = document.querySelector("[data-user__links]");
    const annDetails = document.querySelector("[data-ann__details]");
    const annStatus = document.querySelector("[data-ann__status]");
    const filterStatus = document.querySelector("[data-filter__status]");
    filterStatus.addEventListener("change", () => updateAnnouncementStatus(filterStatus.value))

    if (session) {
        navLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'none';
        dropDownLinksAuth.style['display'] = 'block';
        userLinks.style['display'] = 'block';
        currentUser.innerHTML = 'Howdy ' + session.firstName;
        if (session.isAdmin) {
            annDetails.style['display'] = 'none';
        } else {
            annStatus.style['display'] = 'none';
        }
        getAnnouncement();
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
    initUpdateAnnouncementPage();
});