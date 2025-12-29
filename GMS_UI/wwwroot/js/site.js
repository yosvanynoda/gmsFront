// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


document.addEventListener('DOMContentLoaded', function () {
    // On page load, check current URL and keep the relevant submenu expanded
    const currentPath = window.location.pathname;
    document.querySelectorAll('.sidebar li:has(.submenu)').forEach(function (menuItem) {
        const submenuLinks = menuItem.querySelectorAll('.submenu a');
        submenuLinks.forEach(function (link) {
            if (link.getAttribute('href') === currentPath) {
                menuItem.classList.add('active');
            }
        });
    });

    // Handle parent menu click to open submenu and navigate to first item
    document.querySelectorAll('.sidebar li:has(.submenu) > a').forEach(function (menuLink) {
        menuLink.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent navigation on parent link
            const parentLi = this.parentElement;
            const submenu = parentLi.querySelector('.submenu');
            const firstLink = submenu ? submenu.querySelector('a') : null;

            // Close all other submenus
            document.querySelectorAll('.sidebar li:has(.submenu)').forEach(function (item) {
                if (item !== parentLi) {
                    item.classList.remove('active');
                }
            });

            // Open this submenu
            parentLi.classList.add('active');

            // Navigate to the first submenu link
            if (firstLink) {
                window.location.href = firstLink.getAttribute('href');
            }
        });
    });
});