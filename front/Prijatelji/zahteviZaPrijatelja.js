const getInvitations = async () => {
  let invitations = await fetch(
    'http://localhost:3000/api/v1/flight/getUsersInvitations',
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
      return data.zahtevPrijatelj;
    });
  return invitations;
};

const createQueryUser_id = (niz) => {
  popunjenNiz = [];

  for (let i = 0; i < niz.length; i++) {
    popunjenNiz[i] = `user_id=${niz[i].from_id}`;
  }

  let string = popunjenNiz.join('&');
  return string;
};

const createQueryFlight_id = (nizFlight_id) => {
  let prazanNiz = [];

  for (let i = 0; i < nizFlight_id.length; i++) {
    prazanNiz[i] = `flight_id=${nizFlight_id[i].flight_id}`;
  }

  let query = prazanNiz.join('&');
  return query;
};

const prijateljiInfo = async (query) => {
  let prijateljiInfo = await fetch(
    `http://localhost:3000/api/v1/user?${query}`,
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
      return data.data;
    });

  return prijateljiInfo;
};
const flightsInfo = async (query) => {
  let letInformacije = fetch(`http://localhost:3000/api/v1/flight?${query}`, {
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
      return data.flightsInfo;
    });

  return letInformacije;
};

const ispisPoziva = (invitation, friendsInfo, flightInfo) => {
  let poziviZaLetove = document.getElementById('poziviZaLetove');
  let html = '<div class="poziviZaLetove" id="poziviZaLetove">';

  // console.log(invitation);

  for (let i = 0; i < flightInfo.length; i++) {
    for (let j = 0; j < invitation.length; j++) {
      if (invitation[j].status === 'accepted') continue;

      if (flightInfo[i].flight_id === invitation[j].flight_id) {
        for (let k = 0; k < friendsInfo.length; k++) {
          if (invitation[j].from_id === friendsInfo[k].user_id) {
            html += `<div class="pozivZaLet">
            
              <p class="tekst">${friendsInfo[j].firstName}</p>
              <p class="tekst">Ime Aviona</p>
              <p class="tekst">From -> ${flightInfo[i].from}</p>
              <div class="submit">
                <button class="dugme potvrdi" onclick =potvrdi(${flightInfo[i].flight_id},${invitation[j].request_id})>Potvrdi</button>
              </div>
              <p class="tekst">${friendsInfo[j].lastName}</p>
              <p class="tekst">${flightInfo[i].timeDeparture}</p>
              <p class="tekst">To -> ${flightInfo[i].to}</p>
              <div class="submit">
              <button class="dugme odbij"  onclick='odbij(${invitation[j].request_id})'>Odbij</button>
            </div>
             </div>`;
          }
        }
      }
    }
  }
  poziviZaLetove.innerHTML = html;
};

const potvrdi = (flight_id, invitation) => {
  window.location.href = `../Flights/Let/index.html?flight_id=${flight_id}&invitation=${invitation}`;
  console.log('aa');
};
const odbij = async (invitation_id) => {
  await fetch(
    `http://localhost:3000/api/v1/flight/invitation/delete/${invitation_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then(function (response) {
    response.json();
  });
};

const initPage = async () => {
  let invitations = await getInvitations();
  let queryUserId = createQueryUser_id(invitations);

  if (queryUserId.length !== 0) {
    let queryFlightId = createQueryFlight_id(invitations);
    const friends = await prijateljiInfo(queryUserId);
    const infoFlights = await flightsInfo(queryFlightId);
    ispisPoziva(invitations, friends, infoFlights);
  }

  console.log(invitations);
  // console.log(friends);
  // console.log(infoFlights);
};

initPage();
