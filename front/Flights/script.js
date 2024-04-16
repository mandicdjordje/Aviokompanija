// const letovi = document.getElementById('letovi');
// const dugmeLet = document.getElementById('dugmeLet');
// const dugmeCreateFlight = document.getElementById('createFlight');
// const dugmeCreateAdmin = document.getElementById('createAdmin');

// const showFlightButton = () => {
//   fetch('http://localhost:3000/api/v1/user/current', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       if (data.body.adminAvio === false) {
//         dugmeCreateFlight.style.display = 'none';
//       }
//       return data;
//     });
// };

// const allFlights = () => {
//   fetch('http://localhost:3000/api/v1/flight/getAll', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       ispisiAvione(data);
//     });
// };

// const ispisiAvione = (users) => {
//   htmlString = users.map(
//     (user) => `

//   <div class="let">
//   <p class="letElement">${user.timeDeparture}</p>
//   <p class="letElement">${user.from}</p>
//   <p class="letElement">${user.timeLanding}</p>
//   <p class="letElement">${user.to}</p>
//   <p class="letElement">${user.transfer}</p>
//   <p class="letElement">Koliko traje let</p>
//   <p class="letElement">${user.price} &euro;</p>

//   <div class='button'>
//   <input type="submit" value="Selektuj" class="dugmeLet" id="${user.flight_id}" onclick="selektujLet(${user.flight_id})" />
//   </div>
// </div>
//   `
//   );

//   letovi.innerHTML = htmlString.join('');
// };

// const selektujLet = (id) => {
//   window.location.href = `../Flights/Let/index.html?flight_id=${id}`;
// };

// dugmeCreateFlight.addEventListener('click', (e) => {
//   e.preventDefault();
//   window.location.href = '../Flights/Kreiraj/Podaci/index.html';
// });

// dugmeCreateAdmin.addEventListener('click', (e) => {
//   e.preventDefault();
//   window.location.href = '../Flights/KreirajAdmina/pocetna.html';
// });
// dugmeRemoveAdmin.addEventListener('click', (e) => {
//   e.preventDefault();
//   window.location.href = '../Flights/RemoveAdmin/index.html';
// });

// initButtons();
// allFlights();

//

const from = document.getElementById('from');
const to = document.getElementById('to');
const smer = document.getElementById('ticketWay');
const stops = document.getElementById('stops');
const pretraziLet = document.getElementById('pretrazi-let');

const polazakOd = document.getElementById('polazak-od');
const polazakDo = document.getElementById('polazak-do');

const sekcija5 = document.getElementById('sekcija-5');
const putniciSelect = document.getElementById('putnici-select');
const economy = document.getElementById('economy-ukupno');

const dugmeDodajEconomy = document.getElementById('dugme-dodaj-1');
const dugmeOduzmiEconomy = document.getElementById('dugme-oduzimi-1');
const ukupanBrojEconomy = document.getElementById('broj-economy');
const karticeDiv = document.getElementById('slike-divovi');
const range = document.getElementById('range');

let todayDate = new Date().toISOString().slice(0, 10);

let brojOdraslih = 1;
let brojDece = 0;
ukupanBrojEconomy.innerHTML = brojOdraslih;

const dateOfXDay = (xDay = 1) => {
  // Get today's date
  let today = new Date();
  // Change the date by adding 1 to it (today + 1 = tomorrow)
  today.setDate(today.getDate() + xDay);
  // return yyyy-mm-dd format
  return today.toISOString().split('T')[0];
};

polazakOd.value = todayDate;
polazakDo.value = dateOfXDay(1);

// const showAdminButtons = () => {
//   fetch('http://localhost:3000/api/v1/user/current', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       if (data.body.root === false) {
//         dugmeCreateAdmin.style.display = 'none';
//         dugmeRemoveAdmin.style.display = 'none';
//       }
//       if (data.body.adminAvio === false) {
//         dugmeCreateFlight.style.display = 'none';
//         console.log('aaaa');
//       }
//       return data;
//     });
// };

// showAdminButtons();
if (brojOdraslih == 0) {
  dugmeOduzmiEconomy.style.cursor = 'not-allowed';
}

dugmeDodajEconomy.addEventListener('click', (e) => {
  brojOdraslih = brojOdraslih + 1;
  let ukupno = brojOdraslih;
  dugmeOduzmiEconomy.style.cursor = 'pointer';

  economy.innerHTML = `Economy ${brojOdraslih}`;
  ukupanBrojEconomy.innerHTML = brojOdraslih;
});
dugmeOduzmiEconomy.addEventListener('click', (e) => {
  if (brojOdraslih !== 1) {
    brojOdraslih = brojOdraslih - 1;
  }
  if (brojOdraslih == 1) {
    dugmeOduzmiEconomy.style.cursor = 'not-allowed';
  }
  let ukupno = brojOdraslih;

  ukupanBrojEconomy.innerHTML = brojOdraslih;
  economy.innerHTML = `Economy ${brojOdraslih}`;
});

const prikaziPutnike = () => {
  if (putniciSelect.style.display === 'grid') {
    putniciSelect.style.display = 'none';
  } else {
    putniciSelect.style.display = 'grid';
  }
};

const ispisLeta = (flights) => {
  let html = `<div class="uputstva">
    <div class="klase">
      <div class="klasa">Economy</div>
      <div class="klasa">Business</div>
    </div>
  </div>`;

  for (i = 0; i < flights.length; i++) {
    const ulepsanTimeDeparture = dayjs(flights[i].timeDeparture).format(
      'HH:mm DD-MM-YYYY'
    );
    const ulepsanTimeLanding = dayjs(flights[i].timeLanding).format(
      'HH:mm DD-MM-YYYY'
    );

    html += `<div class="let-div">
    <div class="let-element">
      <p class="elementi-let">${flights[i].from}</p>
      <p class="elementi-let">${flights[i].to}</p>
    </div>
    <div class="let-element">
      <p class="elementi-let">${ulepsanTimeDeparture}</p>
      <p class="elementi-let-duzinaLeta">Duzina Leta</p>
      <p class="elementi-let">${ulepsanTimeLanding}</p>
    </div>
    <div class="let-element">
      <p class="elementi-let">${flights[i].direction}</p>
      <p class="elementi-let">${flights[i].transfer}</p>
    </div>
    <div class="dugmad-let">
      <div class="dugme-let-economy" id=flight-${flights[i].flight_id} onclick= selektujLet(${flights[i].flight_id})> 
        <p>Cena po putniku</p>
        <p>${flights[i].price} din</p>
      </div>

      <div class="dugme-let-buisness">
        <p>Nije dostupno</p>
      </div>
    </div>
  </div>`;
  }

  sekcija5.innerHTML = html;
};

const selektujLet = (id) => {
  window.location.href = `../Flights/Let/index.html?flight_id=${id}`;
};
pretraziLet.addEventListener('click', (e) => {
  e.preventDefault();
  let podaci;
  if (from.value == '') {
    alert('Unesite polje from');
  }
  console.log(to.value);
  console.log(polazakOd.value);
  console.log(polazakDo.value);
  console.log(stops.value);
  fetch(
    `http://localhost:3000/api/v1/flight/searchFlights?from=${from.value}&to=${
      to.value
    }&smer=${smer.value}&stops=${
      stops.value
    }&putnici=${+ukupanBrojEconomy.innerHTML}&polazakOd=${
      polazakOd.value
    }&polazakDo=${polazakDo.value}`,
    {
      method: 'GET',
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
      if (data.flights.length >= 1) {
        ispisLeta(data.flights);
      }
    });
});
