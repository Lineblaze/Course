let ordersTable = document.getElementById('orders-table');

async function getOrders() {
  let dataJSON = await fetch('/getOrderTable');
  let data = await dataJSON.json();
  
  for (let i = 0; i < data.orders.length; i++) {
    ordersTable.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.recommendations[i].title} <br> ${data.recommendations[i].text}</td>
      <td>${data.teachers[i].username}</td>
      <td>${data.users[i].username}</td>
    </tr>
  `);
  }
}

getOrders();