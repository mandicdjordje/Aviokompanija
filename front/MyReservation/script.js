let flights;
let rezervacije;
let flight_id_parametar;

const getFlightsIdFromReservation = (rezervacije) => {
  let flights_ids = [];
  let promenjiva = false;

  for (let i = 0; i < rezervacije.length; i++) {
    if (flights_ids.length === 0) {
      flights_ids.push(rezervacije[i].flight_id);
    }
    for (let j = 0; j < flights_ids.length; j++) {
      if (rezervacije[i].flight_id !== flights_ids[j]) {
        promenjiva = true;
      } else {
        promenjiva = false;
        break;
      }
    }

    if (promenjiva === true) {
      flights_ids.push(rezervacije[i].flight_id);
    }
    promenjiva = false;
  }

  for (let i = 0; i < flights_ids.length; i++) {
    flights_ids[i] = `flight_id=${flights_ids[i]}`;
  }
  flights_ids = flights_ids.toString();
  flights_ids = flights_ids.replace(/,/g, '&');
  return flights_ids;
};

const showInfo = (id) => {
  let flight_id = document.getElementById(id);
  if (flight_id.style.display === 'none') {
    flight_id.style.display = 'grid';
    flight_id.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
  } else {
    flight_id.style.display = 'none';
  }
};

const showModal = async (button_id, flight_id) => {
  let modal = document.getElementById('myModal');
  console.log(flight_id);
  let btn = document.getElementById(button_id);

  let span = document.getElementsByClassName('close')[0];

  if ((modal.style.display = 'none')) {
    modal.style.display = 'block';
  } else {
    modal.style.display = 'none';
  }

  span.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  console.log('Djole');

  flight_id_parametar = flight_id;
  // fetch(
  //   `http://localstorage:3000/api/v1/reservation/deleteAllForFlight/${flight_id}`,
  //   {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   }
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       return console.log('Uspesno izbrisane rezervacije');
  //     })
  // );
};
const izbrisiSveRezervacije = () => {
  console.log(flight_id_parametar);
};
const iscrtajRezervaciju = (flights, rezervacije) => {
  let sekcija5 = document.getElementById('sekcija-5');
  let html = '';

  let sedistauLetu = [];

  for (let i = 0; i < flights.length; i++) {
    const ulepsanTimeDeparture = dayjs(flights[i].timeDeparture).format(
      'HH:mm DD-MM-YYYY'
    );
    const ulepsanTimeLanding = dayjs(flights[i].timeLanding).format(
      'HH:mm DD-MM-YYYY'
    );
    html += `<div class="let-div">
    <div class="let-element-1">
      <button class="button-info" onclick="showInfo('show-more-info-${flights[i].flight_id}')">
        <p class="button-word">Show</p>
        <p class="button-word">More</p>
        <p class="button-word">Info</p>
      </button>
    </div>
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
      <div class="dugme-let-economy">
        <p>Otkazi</p>
        <p>Rezervacije</p>
      </div>
      <div class="dugme-let-buisness" onclick ="showModal('obrisi-${flights[i].flight_id}', '${flights[i].flight_id}')" id= "obrisi-${flights[i].flight_id}">
        <p>Otkazi Sve</p>
        <p>Rezervacije</p>
      </div>
    </div>
  </div>
  <div class="show-more-info" id="show-more-info-${flights[i].flight_id}" style="display:none;">
  <div class="show-more-info-tekst">
    <h1>Selektovana sedista</h1>
  </div>
  <div class="show-more-info-sedista">`;

    for (let j = 0; j < rezervacije.length; j++) {
      if (flights[i].flight_id === rezervacije[j].flight_id) {
        html += `<p>${rezervacije[j].sediste}</p>`;
      }
    }

    html += `</div>
  <div class="show-more-info-cena-karte">
    <p>Po putniku cena karte je</p>
    <p>${flights[i].price} din</p>

  </div>
  <div class="show-more-info-tekst">`;

    if (flights[i].firstStop === null) {
      html += '<h1><h1>';
    } else {
      html += `<h1>${flights[i].firstStop}</h1>`;
    }
    if (flights[i].secondStop === null) {
      html += '<h1><h1>';
    } else {
      html += `<h1>${flights[i].secondStop}</h1>`;
    }
    html += ` </div>
            </div>`;
  }
  html += `<div id="myModal" class="modal" display="none">
                  <!-- Modal content -->
                  <div class="modal-content">
                    <div class="modal-header">
                      <h2>Izbrisi rezervaciju</h2>
                      <div>
                        <span class="close">&times;</span>
                      </div>
                    </div>
                    <div class="modal-body">
                      <div class="dugme-let-buisness" onclick="izbrisiSveRezervacije()">
                        <p>Potvrdi</p>
                        <p></p>
                      </div>
                    </div>
                  </div>
                </div>`;

  sekcija5.innerHTML = html;
};

const finalFunction = async () => {
  rezervacije = await fetch(
    `http://localhost:3000/api/v1/reservation/userReservation`,
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
      console.log(data.rezervacijeUsera);
      return data.rezervacijeUsera;
    });

  let flight_idsString = getFlightsIdFromReservation(rezervacije);
  let flights = await fetch(
    `http://localhost:3000/api/v1/flight?${flight_idsString}`,
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
      return data.flightsInfo;
    });

  console.log(flights);

  iscrtajRezervaciju(flights, rezervacije);
};

finalFunction();
