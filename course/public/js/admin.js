let select = document.getElementById('teacher_id');
let select_del = document.getElementById('teacher_id_delete');

async function getTeachersAndOffices() {
  let teachersJSON = await fetch('/getTeachers');
  let teachers = await teachersJSON.json();
  
  for (let i = 0; i < teachers.length; i++) {
    select.insertAdjacentHTML('beforeend', `
      <option value="${teachers[i].id}">${teachers[i].username}</option>
    `);
    select_del.insertAdjacentHTML('beforeend', `
      <option value="${teachers[i].id}">${teachers[i].username}</option>
    `);
  }
  
}

getTeachersAndOffices();