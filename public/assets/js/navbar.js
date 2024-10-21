document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('sidebar').style.right = '0';
});

document.getElementById('close-menu').addEventListener('click', function() {
    document.getElementById('sidebar').style.right = '-300px';
});
