const search = document.getElementById('search');
const card = document.getElementById('card');
const name = document.getElementById('name');
const cards = document.querySelectorAll('.card');
const submit = document.querySelectorAll('.submit');
const dugmeSearch = document.getElementById('dugme-search');
let isFocused = document.activeElement === search;

let searchValue;
let users = [];
const usersList = document.getElementById('user-cards');

const loadFriends = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/user/all', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    let resJson = await res.json();
    users = resJson.users;
    // displayUsers(users);
    // console.log(users);
  } catch (err) {
    console.log(err);
  }
};

const displayButton = (user) => {
  if (user.prijatelji) {
    return `Prijatelji`;
  }
  if (!user.poslatZahtev && !user.primljenZahtev) {
    return `<button id="button${user.user_id}" class="dugme-za-slanje posalji" onclick="posaljiZahtev(${user.user_id})">Posalji zahtev</button>`;
  }

  if (user.poslatZahtev && !user.primljenZahtev) {
    return `<button id="button${user.user_id}" class="dugme-za-slanje ponisti" onclick="deleteFrendship(${user.user_id})">Ponisti zahtev</button>`;
  }
  if (!user.poslatZahtev && user.primljenZahtev) {
    return `<button id="button${user.user_id}" onclick="acceptFrendship(${user.user_id})">Prihvati zahtev</button><button id="button${user.user_id}" class="dugme-za-slanje" onclick="odbiPrijateljstvo(${user.user_id})">Obrisi zahtev</button>`;
  }
};

const displayUsers = (users) => {
  let firstLetter = users;

  const htmlString = users.map(
    (user) => `
    <div class="card">
    <div class="slika-div">
      <div class="slika"><p class="prvo-slovo">${user.firstName.charAt(
        0
      )}</p></div>
    </div>
    <div class="tekst-div">
      <div class="name"><img src="../../front/SLIKE/username.png" alt="Username" height="" width=""><p class="tekst-ime">${
        user.firstName
      } ${user.lastName}</p></div>
      <div class="email"><img src="../../front/SLIKE/email.png" alt="Username" height="" width=""><p>${
        user.email
      }</p></div>
      </div> 
      <div class="submit">${displayButton(user)}</div>
    </div>
    `
  );

  usersList.innerHTML = htmlString.join('');
};

const posaljiZahtev = async (id) => {
  fetch('http://localhost:3000/api/v1/friend/sendRequest', {
    method: 'POST',
    body: JSON.stringify({
      user_id: id,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      loadFriends();
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

const acceptFrendship = async (id) => {
  fetch('http://localhost:3000/api/v1/friend/accept', {
    method: 'PATCH',
    body: JSON.stringify({
      user_id: id,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      loadFriends();
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteFrendship = async (id) => {
  fetch('http://localhost:3000/api/v1/friend/povuci', {
    method: 'DELETE',
    body: JSON.stringify({
      user_id: id,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      loadFriends();
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
const odbiPrijateljstvo = async (id) => {
  fetch('http://localhost:3000/api/v1/friend/odbi', {
    method: 'DELETE',
    body: JSON.stringify({
      user_id: id,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      loadFriends();
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

dugmeSearch.addEventListener('click', (e) => {
  dugmeSearch.style.display = 'none';
  search.focus();

  if (isFocused) {
    isFocused = false;
  }
  if (!isFocused) {
    dugmeSearch.style.display = 'none';
  }
});
search.addEventListener('input', (e) => {
  searchValue = e.target.value.toLowerCase().trim();

  dugmeSearch.style.display = 'none';

  const values = searchValue.split[' '];

  const filteredUsers = users.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchValue) ||
      user.lastName.toLowerCase().includes(searchValue)
    );
  });

  console.log(filteredUsers);
  displayUsers(filteredUsers);

  if ((search.value.length == 0)) {
    users = [];
  }

  if (search.value.length == 0) {
    isFocused = false;
    dugmeSearch.style.display = 'block';
  }
  if (isFocused) {
    console.log('Djoleeeeee');
  } else {
  }
});
users = [];
loadFriends();
