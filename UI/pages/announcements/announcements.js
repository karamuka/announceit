
const apiHost = 'https://an-it-p.herokuapp.com/api/v1';

const getAnnouncements = (status = '') => {
    setLoading(true);

    const url = new URL(`${apiHost}/announcements`);
    url.searchParams.append('status', status);

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
                renderAnnouncements(final.data);
                if (final.data.length === 0) {
                    displayDataPlaceholder('No announcemnts');
                }
            } else {
                displayMessage(final.error, true);
            }
        })
        .catch((err) => {
            setLoading(false);
            throw (err);
        });
}

const deleteAnn = (annId) => {
    setLoading(true)

    fetch(`${apiHost}/announcements/${annId}`,
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
                removeRow(annId);
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
    const row = document.querySelector(`[data-ann_${annId}]`);
    row.style['display'] = 'none';
}

const renderAnnouncements = (announcements = []) => {
    announcements = announcements.map(announcement => {
        return {
            title: announcement.title,
            status: announcement.status,
            dateCreated: announcement.createdAt,
            id: announcement.id,
        }
    });

    const tblCont = document.querySelector('[data-table__container]');
    tblCont.hasChildNodes && tblCont.childNodes.forEach(n => n.remove());
    const table = document.createElement("table");
    tblCont.appendChild(table);
    const tableHead = table.createTHead();
    const headRow = tableHead.insertRow();
    const headRowData = ['', '', '', 'Title', 'Status', 'Date created'];

    headRowData.forEach(headTitle => {
        const headCell = document.createElement('th');
        const HeadText = document.createTextNode(headTitle);
        headCell.appendChild(HeadText);
        headCell.classList.add('text-left');
        headCell.setAttribute(`data-cell__${headTitle.toLowerCase().replace(' ', '')}`, '');
        headRow.appendChild(headCell);
    });

    announcements.forEach(announcement => {

        const bodyRow = table.createTBody().insertRow();
        bodyRow.setAttribute(`data-ann_${announcement.id}`, '');

        const editCell = bodyRow.insertCell();
        editCell.classList.add('text-center', 'tbl-action');

        const delCell = bodyRow.insertCell();
        delCell.classList.add('text-center', 'tbl-action');
        delCell.addEventListener("click", () => deleteAnn(announcement.id))

        const viewCell = bodyRow.insertCell();
        viewCell.classList.add('text-center', 'tbl-action');

        const editLink = document.createElement('a');
        editLink.setAttribute("href", `pages/announcements/update/?id=${announcement.id}`);

        const viewLink = document.createElement('a');
        viewLink.setAttribute("href", `pages/announcements/view/?id=${announcement.id}`);

        const editImg = document.createElement('img');
        editImg.setAttribute("src", "public/img/edit.png");
        editImg.classList.add('post-action');

        const delImg = document.createElement('img');
        delImg.setAttribute("src", "public/img/delete.png");
        delImg.classList.add('post-action');

        const viewImg = document.createElement('img');
        viewImg.setAttribute("src", "public/img/visibility.png");
        viewImg.classList.add('post-action');

        editLink.appendChild(editImg);
        viewLink.appendChild(viewImg);

        editCell.appendChild(editLink);
        delCell.appendChild(delImg);
        viewCell.appendChild(viewLink);

        Object
            .entries(announcement)
            .forEach(([prop, value]) => {
                if (prop !== 'id') {
                    const rowCell = bodyRow.insertCell();
                    rowCell.classList.add("text-left");
                    rowCell.setAttribute(`data-cell__${String(prop).toLowerCase().replace(' ', '')}`, '');
                    const cellText = document.createTextNode(prop === 'status' ? String(value).toUpperCase() : value);
                    rowCell.appendChild(cellText);
                }
            });
    });
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
    const filterStatus = document.querySelector("[data-filter__status]");
    filterStatus.addEventListener("change", () => getAnnouncements(filterStatus.value))

    if (session) {
        navLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'none';
        dropDownLinksAuth.style['display'] = 'block';
        userLinks.style['display'] = 'block';
        currentUser.innerHTML = 'Howdy ' + session.firstName;
        getAnnouncements();
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
    initAnnouncementsPage();
});