
const apiHost = 'https://an-it-p.herokuapp.com';

const getAnnouncements = () => {
    displayDataPlaceholder('Loading...');
    fetch(`${apiHost}/announcement`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": JSON.parse(localStorage.getItem('session')).token
            }
        })
        .then(res => res.json())
        .then(final => {
            displayDataPlaceholder(final.data.length === 0 && 'No announcemnts');
            if (final.status === 'success') {
                renderAnnouncements(final.data);
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            displayDataPlaceholder('There has been an error');
            displayMessage(err.message || err, true);
        });
}

const renderAnnouncements = (announcements = []) => {
    if (announcements && announcements.length > 0) {
        const tableBody = document.querySelector("tbody");
        announcements.forEach(announcement => {
            const tr = tableBody.insertRow();
            Object.entries(announcement).forEach(([property, value]) => {
                const td = tr.insertCell();
                td.innerHTML = value;
            });

        });
    }
}

const displayDataPlaceholder = (placeholderText = '') => {
    const loading = document.querySelector("[data-placeholder]");
    loading.innerHTML = placeholderText;
}

const initAnnouncementsPage = () => {

    const session = JSON.parse(localStorage.getItem('session'));
    const currentUser = document.querySelector("[data-current__user]");
    const dropDownLinks = document.querySelector("[data-dropdown__menu__links]");
    const dropDownLinksAuth = document.querySelector("[data-dropdown__menu__links__auth]");
    const navLinks = document.querySelector("[data-nav__links]");
    const userLinks = document.querySelector("[data-user__links]");
    const viewAdvertisers = document.querySelector("[data-view__advertisers]");

    if (session) {
        navLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'none';
        dropDownLinksAuth.style['display'] = 'block';
        userLinks.style['display'] = 'block';
        currentUser.innerHTML = 'Howdy ' + session.firstName;
        getAnnouncements(session);
        if (!session.isAdmin) {
            viewAdvertisers.style['display'] = 'none'
        }
    } else {
        userLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'block';
        dropDownLinksAuth.style['display'] = 'none';
        window.location.href = 'pages/signin';
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    initAnnouncementsPage();
});