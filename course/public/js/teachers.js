let table = document.getElementById('orders-table');

async function getTeachersAndOffices() {
  let teachersJSON = await fetch('/getTeachers');
  let teachers = await teachersJSON.json();
  let officesJSON = await fetch('/getOffices');
  let offices = await officesJSON.json();
  
  for (let i = 0; i < teachers.length; i++) {
    table.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${teachers[i].username}</td>
        <td>${offices[i].model} ${offices[i].number}</td>
        <td>${teachers[i].isBusy ? "Да" : "Нет"}</td>
      </tr>
    `);
  }
  
}

getTeachersAndOffices();