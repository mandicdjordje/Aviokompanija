const forma = document.getElementById('forma');
const submit = document.getElementsByClassName('submit');
const nazivAviona = document.getElementById('nazivAviona');
const sedistaRedovi = document.getElementById('sedistaRedovi');
const sedistaKolone = document.getElementById('sedistaKolone');

const avioniZaSelektovanje = document.getElementById('avioniZaSelektovanje');
const postojeciAvioni = document.getElementsByClassName('postojeciAvioni');
const imeAviona = document.getElementsByClassName('imeAviona');
const brojSedista = document.getElementsByClassName('brojSedista');

const query = window.location.search;

const urlParams = new URLSearchParams(query);

const from = urlParams.get('from');



let promenjivaLet = true;
let predhodniId;

function displayAirplane(users) {
  const htmlString = users.map(
    (user) =>
      `
    <div class="postojeciAvioni" onclick ="selektujAvion(${user.airplane_id})" id="${user.airplane_id}">
    <p class="imeAviona">Ime aviona ${user.name}</p>
    <p class="brojSedista">Broj sedista ${user.number_of_seats}</p>
    </div>
    `
  );

  avioniZaSelektovanje.innerHTML = htmlString.join('');
}

const loadAirplane = async () => {
  fetch('http://localhost:3000/api/v1/airplane/getAll', {
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
      displayAirplane(data.allAirplanes);

      console.log(data.allAirplanes);
    });
};

const pocetniDiv = (id) => {
  id.style.backgroundColor = 'rgb(107, 91, 149)';
};
const selektovaniDiv = (id) => {
  id.style.backgroundColor = 'rgb(255, 105, 105)';
};

const selektujAvion = async (id) => {
  data = { airplane_id: id };
  const iD = document.getElementById(`${id}`);

  if (predhodniId !== iD && predhodniId !== undefined) {
    predhodniId.style.backgroundColor = 'rgb(107, 91, 149)';
  }

  if (iD.style.backgroundColor === 'rgb(255, 105, 105)') {
    pocetniDiv(iD);
    console.log('false');
    promenjivaLet = true;
    selektovaniLet = {};
  } else {
    console.log('true');
    selektovaniDiv(iD);

    selektovaniLet = await fetch('http://localhost:3000/api/v1/airplane/get', {
      method: 'POST',
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
        // console.log(data);
        return data;
      });

    promenjivaLet = false;
    console.log(selektovaniLet);
  }

  predhodniId = iD;
};

// Napravi Avion
forma.addEventListener('submit', (e) => {
  data = {
    name: nazivAviona.value,
    rows: sedistaRedovi.value,
    columns: sedistaKolone.value,
  };

  fetch('http://localhost:3000/api/v1/airplane/create', {
    method: 'POST',
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

loadAirplane();

const backPage = () => {
  document.location.href = '../Podaci/index.html';
};

const napraviLet = (let) => {
  const podaci1 = JSON.parse(localStorage.getItem('podaci'));

  // console.log(podaci1);

  const podaci2 = selektovaniLet.avionSelektovani;
  console.log(podaci2);

  if (podaci2 !== undefined || podaci2 !== []) {
    const data = {
      ...podaci1,
      airplane_id: podaci2.airplane_id,
      avioKomp_id: podaci2.avioKomp_id,
    };
    console.log(data);

    const kreirajLet = fetch('http://localhost:3000/api/v1/flight/create', {
      method: 'POST',
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
        document.location.href = '../../../Flights/pocetna.html';
        localStorage.removeItem('podaci');
        console.log(data);
      });
  } else {
    throw new Error('Selektujte Avion');
  }
};
