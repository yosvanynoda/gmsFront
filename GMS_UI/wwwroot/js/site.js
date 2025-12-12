// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


document.addEventListener('DOMContentLoaded', function () {
    // Handle submenu expansion on hover
    document.querySelectorAll('.sidebar li:has(.submenu)').forEach(function (menuItem) {
        menuItem.addEventListener('mouseenter', function () {
            this.classList.add('active');
        });

        menuItem.addEventListener('mouseleave', function () {
            this.classList.remove('active');
        });
    });
});