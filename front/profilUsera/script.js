const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');

const email = document.getElementById('email');
const password = document.getElementById('password');
const submit = document.getElementById('submit');

const uspesno = document.getElementById('uspesno');
const nijeUspesno = document.getElementById('nijeUspesno');
const tekst = document.getElementById('tekst');
const tekst2 = document.getElementById('tekst2');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    nijeUspesno.style.visibility = 'visible';
    tekst2.style.visibility = 'visible';
  } else {
    uspesno.style.visibility = 'visible';
    tekst.style.visibility = 'visible';
  }

  data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  };

  fetch('http://localhost:3000/api/v1/user/updateUser', {
    method: 'PATCH',
    body: JSON.stringify(data),
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
    });
});
