const mesta = document.getElementById('mesta');
const container = document.querySelector('.container');
const row = document.querySelector('.row');
const potvrdi = document.getElementById('potvrdi');
const nazad = document.getElementById('nazad');

const query = window.location.search;
const urlParams = new URLSearchParams(query);
const flight_id = urlParams.get('flight_id');
const invitation = urlParams.get('invitation');

let avionInfo = null;
let brojac = 0;
let broj = 0;
let selektovanaSedista = [];
let objekat = {};
let cenaJedneKarte;

let rezervisanaSedista;
const dobijAvion = async (flight_id) => {
  data = { flight_id: flight_id };

  await fetch('http://localhost:3000/api/v1/flight/getAirplane', {
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
      iscrtajSedista(data.rows, data.columns);
      avionInfo = data;
      broj = data.columns;
    });

  await getReservedSeats(flight_id);
};

const getReservedSeats = async (flight_id) => {
  await fetch(`http://localhost:3000/api/v1/reservation/flight/${flight_id}`, {
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
      rezervisanaSedista = data.Rezervacije;

      // console.log(rezervisanaSedista);
      for (let i = 0; i < rezervisanaSedista.length; i++) {
        rezervisanaSedista[i].sediste;

        const sediste = document.getElementById(rezervisanaSedista[i].sediste);
        if (sediste) sediste.classList = 'seat occupied';
      }
    });
};

const getFlight = async (flight_id) => {
  await fetch(`http://localhost:3000/api/v1/flight/${flight_id}`, {
    method: 'GET',

    'Content-Type': 'application/json',
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      cenaJedneKarte = data.flight.price;
      return cenaJedneKarte;
    });
};

dobijAvion(flight_id);

function iscrtajSedista(rows, columns) {
  let html = '';

  for (let i = 0; i < rows; i++) {
    html += '<div class="row">';

    for (let j = 0; j < columns; j++) {
      html += `<div class="seat" id="${i + 1}-${
        j + 1
      }" onclick="selektujSediste(${i + 1}, ${j + 1})" ></div>`;
    }

    html += '</div>';
  }

  container.innerHTML = html;
}

function selektujSediste(red, kolona) {
  const sediste = `${red}-${kolona}`;
  console.log(sediste);
  const selektovano = selektovanaSedista.includes(sediste);

  if (!selektovano) {
    selektovanaSedista.push(sediste);
  } else {
    selektovanaSedista.splice(selektovanaSedista.indexOf(sediste), 1);
  }

  console.log(selektovanaSedista);
}
const displayColumns = (rows) => {
  htmlString = rows.map(
    (column) => `<div class="seat" column="${column}"></div>`
  );

  return (row.innerHTML = htmlString.join(''));
};

const pravljenjeNiza = (broj) => {
  niz = [];
  for (let i = 1; i <= broj; i++) {
    niz.push(i);
  }
  return niz;
};
const createRows = (rows, htmlElement) => {
  for (let i = 1; i <= rows; i++) {
    container.innerHTML += `<div class="row" id="${i}" row=${i}>${htmlElement}</div>`;
  }
  console.log(container);
};

getFlight(flight_id);
container.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
  ) {
    e.target.classList.toggle('selected');
    if (e.target.classList.contains('selected')) {
      brojac += 1;
    } else {
      brojac -= 1;
    }
  }

  if (brojac === 0) {
    mesta.innerHTML = `Selektujte sedista za rezervaciju`;
  }
  if (brojac === 1) {
    mesta.innerHTML = `Selektovali ste ${brojac} sediste i cena je ${cenaJedneKarte}`;
  } else {
    mesta.innerHTML = `Selektovali ste ${brojac} sedista i cena je ${
      cenaJedneKarte * brojac
    }`;
  }
});

const prihvatiInvitaciju = async (invitation) => {
  const prihvatiPoziv = await fetch(
    `http://localhost:3000/api/v1/flight/invitation/${invitation}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  ).then((response) => {
    return response.json();
  });

  return prihvatiPoziv;
};

const kreirajRezervaciju = async (selektovanaSedista) => {
  if (selektovanaSedista.length) {
    const rezervacija = await fetch(
      'http://localhost:3000/api/v1/reservation/create',
      {
        method: 'POST',
        body: JSON.stringify({
          sediste: selektovanaSedista,
          flight_id: flight_id,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);

        window.location.href = `../Let/PozoviPrijatelje/index.html?flight_id=${flight_id}`;
      });
  } else {
    alert('Selektujte sedista');
  }
};

const potvrdiFunkcija = async () => {
  if (typeof invitation === 'string') {
    const prihvatiPoziv = await prihvatiInvitaciju(invitation);
  }
  const rezervacija = await kreirajRezervaciju(selektovanaSedista);
};

nazad.addEventListener('click', (e) => {
  e.preventDefault();

  window.location.href = '../pocetna.html';
  // document.location.href =
});

// potvrdi.addEventListener('click', (e) => {
//   console.log(selektovanaSedista);

//   if (selektovanaSedista.length) {
//     fetch('http://localhost:3000/api/v1/reservation/create', {
//       method: 'POST',
//       body: JSON.stringify({
//         sediste: selektovanaSedista,
//         flight_id: flight_id,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);

//         window.location.href = `../Let/PozoviPrijatelje/index.html?flight_id=${flight_id}`;
//       });
//   } else {
//     alert('Selektujte sedista');
//   }
// });
