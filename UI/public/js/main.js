
function toggleMenu() {
    const menuToggle = document.querySelector('#menu-toggle');
    const dropdownMenu = document.querySelector('#dropdown-menu');

    dropdownMenu.style['display'] = dropdownMenu.style['display'] === "none" ? "block" : "none";
    menuToggle.src = dropdownMenu.style['display'] === "none" ? "./public/img/menu.png" : "./public/img/close.png";
}

const init = () => {
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
        currentUser.innerHTML = 'Howdy ' + String(session.firstName).toLocaleLowerCase();
    } else {
        userLinks.style['display'] = 'none';
        dropDownLinks.style['display'] = 'block';
        dropDownLinksAuth.style['display'] = 'none';
        currentUser.innerHTML = '';
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    const copyYear = document.querySelector('#copy-year');
    copyYear.textContent = new Date().getFullYear().toString();
    init();
});