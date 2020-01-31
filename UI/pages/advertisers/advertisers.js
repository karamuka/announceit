
const apiHost = 'https://an-it-p.herokuapp.com/api/v1';

const getAdvertisers = () => {
    setLoading(true);
    fetch(`${apiHost}/users`,
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
                renderAdvertisers(final.data);
                if (final.data.length === 0) {
                    displayDataPlaceholder('No advertisers');
                }
            } else {
                displayMessage(final.error, true);
            }
        }).catch((err) => {
            setLoading(false);
            throw (err);
        });
}

const deleteAdv = (advId) => {
    setLoading(true)

    fetch(`${apiHost}/users/${advId}`,
        {
            method: "DELETE",
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
                removeRow(advId);
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            setLoading(false);
            throw (err);
        });
}

const removeRow = (annId) => {
    const row = document.querySelector(`[data-adv_${annId}]`);
    row.style['display'] = 'none';
}

const renderAdvertisers = (advertisers = []) => {
    advertisers = advertisers.map(advertiser => {
        return {
            firstName: advertiser.firstName,
            lastName: advertiser.lastName,
            email: advertiser.email,
            id: advertiser.id,
        }
    });

    const tblCont = document.querySelector('[data-table__container]');
    tblCont.hasChildNodes && tblCont.childNodes.forEach(n => n.remove());
    const table = document.createElement("table");
    tblCont.appendChild(table);
    const tableHead = table.createTHead();
    const headRow = tableHead.insertRow();
    const headRowData = ['', '', 'First name', 'Last name', 'E-mail'];

    headRowData.forEach(headTitle => {
        const headCell = document.createElement('th');
        const HeadText = document.createTextNode(headTitle);
        headCell.appendChild(HeadText);
        headCell.classList.add('text-left');
        headCell.setAttribute(`data-cell__${headTitle.toLowerCase().replace(' ', '')}`, '');
        headRow.appendChild(headCell);
    });

    advertisers.forEach(advertiser => {

        const bodyRow = table.createTBody().insertRow();
        bodyRow.setAttribute(`data-adv_${advertiser.id}`, '');

        const delCell = bodyRow.insertCell();
        delCell.classList.add('text-center', 'tbl-action');
        delCell.addEventListener("click", () => deleteAdv(advertiser.id))

        const viewCell = bodyRow.insertCell();
        viewCell.classList.add('text-center', 'tbl-action');

        const delImg = document.createElement('img');
        delImg.setAttribute("src", "public/img/delete.png");
        delImg.classList.add('post-action');

        const viewImg = document.createElement('img');
        viewImg.setAttribute("src", "public/img/visibility.png");
        viewImg.classList.add('post-action');

        delCell.appendChild(delImg);
        viewCell.appendChild(viewImg);

        Object
            .entries(advertiser)
            .forEach(([prop, value]) => {
                if (prop !== 'id') {
                    const rowCell = bodyRow.insertCell();
                    rowCell.classList.add("text-left");
                    rowCell.setAttribute(`data-cell__${prop.toLowerCase().replace(' ', '')}`, '');
                    const cellText = document.createTextNode(value);
                    rowCell.appendChild(cellText);
                }
            });
    });
}

const setLoading = (isLoading = true) => {
    const dataMain = document.querySelector("[data-table__container]");
    const dataFetch = document.querySelector("[data-fetching]");

    if (isLoading) {
        dataMain.style['display'] = 'none';
        dataFetch.style['display'] = 'block';
    } else {
        dataMain.style['display'] = 'block';
        dataFetch.style['display'] = 'none';
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
        getAdvertisers();
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
    initAdvertisersPage();
});
