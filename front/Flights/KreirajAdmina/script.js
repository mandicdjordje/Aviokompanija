const searchUser = document.getElementById('searchUser');
const searchAircompany = document.getElementById('searchAircompany');

const userDiv = document.getElementById('user-div');
const airCompany = document.getElementById('aircompany-div');
const user = document.getElementsByClassName('user');

let dugme = document.getElementById('button');
const kreirajAdmina = document.getElementById('kreirajAdmina');
let infoAdmin = [];

// console.log(user);

const getAllUsers = (searchValue) => {
  fetch('http://localhost:3000/api/v1/user/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data.users);

      for (let i = 0; i < data.users.length; i++) {
        if (searchValue === data.users[i].email) {
          console.log(data.users[i].email);
          iscrtajUsera(data.users[i]);
          return (userDiv.style.display = 'grid');
        } else {
          userDiv.innerHTML = ``;
        }
      }
    });
};
const getAllAirCompanies = (searchValue) => {
  fetch('http://localhost:3000/api/v1/avio/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data.allCompanies);

      for (let i = 0; i < data.allCompanies.length; i++) {
        if (searchValue === data.allCompanies[i].naziv) {
          console.log(data.allCompanies[i]);
          console.log(data.allCompanies[i].naziv);

          // console.log(infoAdmin);
          iscrtajAvioKompaniju(data.allCompanies[i]);
          return (airCompany.style.display = 'grid');
        } else {
          airCompany.innerHTML = ``;
        }
      }
    });
};

// getAllAirCompanies()
const iscrtajUsera = (user) => {
  let html = `<div class='userr'>
  <div class="user">
  <div class="grid-username">
    <div>${user.firstName}</div>
    <div>${user.lastName}</div>
  </div>
  <p class="email">${user.email}</p>
  <button class="create" onclick="selectUser(${user.user_id})" id="selectUserButtom">Select</button>
</div></div>`;
  userDiv.innerHTML = html;
};
const iscrtajAvioKompaniju = (aviokompanija) => {
  let html = `<div class='userr'> <div class="user">
  <div class="aircompaniName">
    <div>${aviokompanija.naziv}</div>
  </div>
  <p class="email">${aviokompanija.adresa}</p>
  <button class="create" onclick="selectAvio(${aviokompanija.avioKomp_id})" id="selectAvioButton">Select</button>
</div> </div>`;

  airCompany.innerHTML = html;
};

const selectUser = (id) => {
  const selectUser = document.getElementById('selectUserButtom');
  fetch(`http://localhost:3000/api/v1/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data);

      if (selectUser.innerHTML === `Select`) {
        infoAdmin[0] = id;
        console.log(infoAdmin);
        selectUser.innerHTML = 'Selected';
      } else {
        selectUser.innerHTML = `Select`;
        infoAdmin[0] = null;
      }
      if (
        typeof infoAdmin[1] === 'number' &&
        typeof infoAdmin[0] === 'number'
      ) {
        dugme.style.display = 'flex';
      } else {
        dugme.style.display = 'none';
      }
    });
};
const selectAvio = (id) => {
  const selectAvio = document.getElementById('selectAvioButton');

  if (selectAvio.innerHTML === `Select`) {
    infoAdmin[1] = id;
    console.log(infoAdmin);
    selectAvio.innerHTML = 'Selected';
  } else {
    selectAvio.innerHTML = `Select`;
    infoAdmin[1] = null;
  }
  if (typeof infoAdmin[1] === 'number' && typeof infoAdmin[0] === 'number') {
    dugme.style.display = 'flex';
  } else {
    dugme.style.display = 'none';
  }
};

searchUser.addEventListener('keyup', (e) => {
  const searchValue = searchUser.value;
  e.preventDefault();
  getAllUsers(searchValue);
});
searchAircompany.addEventListener('keyup', (e) => {
  const searchValue = searchAircompany.value;
  e.preventDefault();
  getAllAirCompanies(searchValue);
});
kreirajAdmina.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(infoAdmin[0]);
  console.log(infoAdmin[1]);

  console.log(infoAdmin);
  console.log('aaa');
  fetch('http://localhost:3000/api/v1/avio/createAdmin', {
    method: 'PATCH',
    body: JSON.stringify({
      user_id: infoAdmin[0],
      avio_id: infoAdmin[1],
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      window.location.href = '../pocetna.html';

      console.log(data);
    });
});
