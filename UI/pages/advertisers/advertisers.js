
const apiHost = 'http://localhost:3000/api/v1';

const getAdvertisers = () => {
    displayDataPlaceholder('Loading...');
    fetch(`${apiHost}/advertisers`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": JSON.parse(localStorage.getItem('session')).token
            }
        })
        .then(res => res.json())
        .then(final => {
            displayDataPlaceholder(final.data.length === 0 && 'No advertisers');
            if (final.status === 'success') {
                renderAnnouncements(final.data);
            } else {
                displayMessage(final.error, true);
            }
        }).catch((err) => {
            displayDataPlaceholder('There has been an error');
            displayMessage(err.message || err, true);
        });
}

const renderAdvertisers = (advertisers = []) => {
    if (advertisers && advertisers.length > 0) {
        const tableBody = document.querySelector("tbody");
        advertisers.forEach(advertiser => {
            const tr = tableBody.insertRow();
            Object.entries(advertiser).forEach(([property, value]) => {
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

const initAdvertisersPage = () => {

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
        getAdvertisers(session);
    } else {
        userLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'block';
        dropDownLinksAuth.style['display'] = 'none';
        window.location.href = 'pages/signin';
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    initAdvertisersPage();
});
