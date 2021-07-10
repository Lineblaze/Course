let navHTML = document.getElementById('nav');

if (localStorage.getItem('username') && localStorage.getItem('user_id')) {
  navHTML.insertAdjacentHTML('beforeend', `
    <p><a href="/order">Сделать заказ</a></p>
    <p><a href="/profile">Профиль</a></p>
    <p><a id="logout">Выйти</a></p>
  `);
  
  let logout = document.getElementById('logout');
  
  logout.addEventListener('click', _ => {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    window.location.reload();
  });
}

