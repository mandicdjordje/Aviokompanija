const dugmeCreateAdmin = document.getElementById('napravi-admina');
const dugmeCreateFlight = document.getElementById('napravi-let');
const dugmeRemoveAdmin = document.getElementById('ukloni-admina');


const showAdminButtons = () => {
  fetch('http://localhost:3000/api/v1/user/current', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.body.root === false) {
        dugmeCreateAdmin.style.display = 'none';
        dugmeRemoveAdmin.style.display = 'none';
      }
      if (data.body.adminAvio === false) {
        dugmeCreateFlight.style.display = 'none';
      }
      return data;
    });
};

showAdminButtons();
