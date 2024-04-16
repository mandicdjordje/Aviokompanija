const user = document.getElementById('user');
const tekst = document.getElementById('tekst');
const email = document.getElementById('email');
const UkloniAdmina = document.getElementById('UkloniAdmina');
const nazadDugme = document.getElementById('nazad');

let user_id;

const izvuciAdmina = (searchValue) => {
  fetch('http://localhost:3000/api/v1/user/admin_role/ADMIN_AVIO', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((responese) => {
      return responese.json();
    })
    .then((data) => {
      for (let i = 0; i < data.admins_avio.length; i++) {
        if (searchValue === data.admins_avio[i].email) {
          UkloniAdmina.style.display = 'flex';
          user_id = data.admins_avio[i].user_id;
        } else {
          UkloniAdmina.style.display = 'none';
        }
      }
    });
};

const ukloniAdmina = () => {
  fetch(`http://localhost:3000/api/v1/user/removeAdmin/${user_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((responese) => {
      return responese.json();
    })
    .then((data) => {
      tekst.style.display = 'flex';
      setTimeout(() => {
        window.location.href = '../pocetna.html';
      }, 5000);
    });
};

email.addEventListener('keyup', (e) => {
  e.preventDefault();
  const searchValue = email.value;
  izvuciAdmina(searchValue);
});

nazadDugme.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('aa');
  window.location.href = '../pocetna.html';
});
izvuciAdmina();
