const prijatelji = document.getElementById('prijatelji');
const prijatelj = document.getElementById('prijatelj');
const rows = document.getElementById('rows');
const nazad = document.getElementById('nazad');
const napred = document.getElementById('napred');

const posalji = document.getElementById('posalji');

const query = window.location.search;
const urlParams = new URLSearchParams(query);
const flight_id = urlParams.get('flight_id');

let user_id = null;
let friends = [];
let selektovaniPrijatelji = [];
let invetaitons;

const iscrtajPrijatelje = (prijatelji) => {
  let html = `<div class="row">
  <div class="column">First Name</div>
  <div class="column">Last Name</div>
  <div class="column">Invite</div>
</div>`;

  for (let i = 0; i < prijatelji.length; i++) {
    html += `
    <div class="row">
    <div class="column">${prijatelji[i].firstName}</div>
    <div class="column">${prijatelji[i].lastName}</div>
    <div class="column"><input class="checkbox" type="checkbox" id="checkbox${i}" onclick="selektujPrijatelje(value)" value="${prijatelji[i].user_id}"/></div>
    </div>`;
  }

  rows.innerHTML = html;
};

const getInvetations = async () => {
  await fetch(`http://localhost:3000/api/v1/flight/getInvitations`, {
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
      invetaitons = data;
    });
};

const getUserId = async () => {
  let id = null;

  await fetch('http://localhost:3000/api/v1/user/info', {
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
      id = data.user.user_id;
      user_id = data.user.user_id;
    })
    .catch((err) => console.log(err));
};

const fetchFriendships = async (user_id) => {
  if (!user_id) return;

  // console.log(invetaitons.getInvitations);

  await fetch(`http://localhost:3000/api/v1/friend/all/${user_id}`, {
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
      for (let i = 0; i < data.friends.length; i++) {
        let nijePozvan = true;

        console.log(data.friends);
        console.log(invetaitons.getInvitations);
        for (let j = 0; j < invetaitons.getInvitations.length; j++) {
          if (
            data.friends[i].user_id === invetaitons.getInvitations[j].from_id ||
            data.friends[i].user_id === invetaitons.getInvitations[j].to_id
          ) {
            nijePozvan = false;
          }
        }
        if (nijePozvan === true) {
          friends.push(data.friends[i]);
        }
        console.log();
      }
    });
};

const selektujPrijatelje = (selektovaniPrijatelj) => {
  // debugger;

  let indexof = selektovaniPrijatelji.indexOf(selektovaniPrijatelj);
  if (selektovaniPrijatelji.includes(selektovaniPrijatelj)) {
    selektovaniPrijatelji.splice(indexof, 1);
  } else {
    selektovaniPrijatelji = [...selektovaniPrijatelji, selektovaniPrijatelj];
  }

  if (selektovaniPrijatelji.length === 0) {
    posalji.style.display = 'none';
  } else {
    posalji.style.display = 'flex';
  }

  console.log(selektovaniPrijatelj);
};
nazad.addEventListener('click', (e) => {
  e.preventDefault();

  window.location.href = `../index.html?flight_id=${flight_id}`;
});
posalji.addEventListener('click', (e) => {
  e.preventDefault();

  fetch(`http://localhost:3000/api/v1/flight/sendinvitation`, {
    method: 'POST',
    body: JSON.stringify({
      friends_id: selektovaniPrijatelji,
      flight_id: flight_id,
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
      console.log(data);
    });
});

napred.addEventListener('click',e=>{

  window.location.href = `../../pocetna.html`

})


const initPage = async () => {
  await getUserId();
  await getInvetations();
  await fetchFriendships(user_id);
  iscrtajPrijatelje(friends);
};
initPage();
