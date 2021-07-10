let usernameHTML = document.getElementById('username');
let userIdHTML = document.getElementById('user_id');

usernameHTML.innerHTML = localStorage.getItem('username');
userIdHTML.innerHTML = localStorage.getItem('user_id');