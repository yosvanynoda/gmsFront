// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.sidebar a[href="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
            document.querySelectorAll('.sidebar a[href="#"]').forEach(function (el) {
                if (el.id !== link.id) {
                    el.parentElement.classList.remove('active');
                }
            });
        });
    });
     
   
});