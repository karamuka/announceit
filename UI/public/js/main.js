
// Toggle dropdownmenu on mobile & tablet
function toggleMenu() {
    const menuToggle = document.querySelector('#menu-toggle');
    const dropdownMenu = document.querySelector('#dropdown-menu');

    dropdownMenu.style['display'] = dropdownMenu.style['display'] === "none" ? "block" : "none";
    menuToggle.src = dropdownMenu.style['display'] === "none" ? "./public/img/menu.png" : "./public/img/close.png";
}

document.addEventListener("DOMContentLoaded", (event) => {

    // Set copyright year in footer
    const copyYear = document.querySelector('#copy-year');
    copyYear.textContent = new Date().getFullYear().toString();
});

