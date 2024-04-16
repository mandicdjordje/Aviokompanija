const nextButton = document.getElementById('nextButton');

const mestoPolaska = document.getElementById('mestoPolaska');
const mestoSletanja = document.getElementById('mestoSletanja');
const vremePolaska = document.getElementById('vremePolaska');
const vremeSletanja = document.getElementById('vremeSletanja');
const distance = document.getElementById('distance');
const cena = document.getElementById('cena');
const smer = document.getElementById('Smer');
const Presedanja = document.getElementById('Presedanja');
const prvoPresedanje = document.getElementById('firstStop_value');
const drugoPresedanje = document.getElementById('secondStop_value');

const forma = document.getElementById('forma');

const submit = document.getElementById('submit');

function checkRequired(inputArr) {
  let valid = true;
  inputArr.forEach(function (input) {
    if (input.value.trim() === '') {
      console.log('error');
      valid = false;
      throw new Error('Unesite sve podatke');
    } else {
      console.log('uspesno');
      valid = true;
    }
  });
  return valid;
}
const posaljiZahtev = (data) => {
  const podaci = JSON.stringify(data);

  localStorage.setItem('podaci', podaci);

  const queryString = new URLSearchParams(data).toString();

  document.location.href = `../Avion/index.html?${queryString}`;
};

submit.addEventListener('click', (e) => {
  e.preventDefault();

  if (Presedanja.value === 'Direct') {
    checkRequired([
      mestoPolaska,
      mestoSletanja,
      vremePolaska,
      vremeSletanja,
      distance,
      cena,
      smer,
    ]);
    const data = {
      from: mestoPolaska.value,
      to: mestoSletanja.value,
      timeDeparture: vremePolaska.value,
      timeLanding: vremeSletanja.value,
      distance: distance.value,
      transfer: Presedanja.value,
      price: cena.value,
      direction: smer.value,
    };
    posaljiZahtev(data);
  } else if (Presedanja.value === 'One Stop') {
    checkRequired([
      mestoPolaska,
      mestoSletanja,
      vremePolaska,
      vremeSletanja,
      distance,
      cena,
      smer,
      prvoPresedanje,
    ]);
    const data = {
      from: mestoPolaska.value,
      to: mestoSletanja.value,
      timeDeparture: vremePolaska.value,
      timeLanding: vremeSletanja.value,
      distance: distance.value,
      transfer: Presedanja.value,
      price: cena.value,
      direction: smer.value,

      prvoPresedanje: prvoPresedanje.value,
    };
    posaljiZahtev(data);
  } else {
    checkRequired([
      mestoPolaska,
      mestoSletanja,
      vremePolaska,
      vremeSletanja,
      distance,
      cena,
      smer,
      prvoPresedanje,
      drugoPresedanje,
    ]);
    const data = {
      from: mestoPolaska.value,
      to: mestoSletanja.value,
      timeDeparture: vremePolaska.value,
      timeLanding: vremeSletanja.value,
      distance: distance.value,
      transfer: Presedanja.value,
      firstStop: prvoPresedanje.value,
      secondStop: drugoPresedanje.value,
      price: cena.value,
      direction: smer.value,
    };
    posaljiZahtev(data);
  }
});

console.log(localStorage.getItem('podaci'));

const backPage = () => {
  document.location.href = '../../../Flights/pocetna.html';
  localStorage.removeItem('podaci');
};
const nextPage = () => {
  document.location.href = '../Avion/index.html';
};

const presedanjePocetna = () => {
  if (Presedanja.value === 'Direct') {
    document.getElementById('firstStop').style.display = 'none';
    document.getElementById('secondStop').style.display = 'none';
    console.log(Presedanja.value);
  }
};
Presedanja.addEventListener('change', (e) => {
  e.preventDefault();
  console.log(Presedanja.value);
  presedanjePocetna();
  if (Presedanja.value === 'Direct') {
    document.getElementById('firstStop').style.display = 'none';
    document.getElementById('secondStop').style.display = 'none';
    console.log('aa');

    e.preventDefault();
    console.log(Presedanja.value);
  }
  if (Presedanja.value === 'One Stop') {
    document.getElementById('firstStop').style.display = 'inline';
    document.getElementById('secondStop').style.display = 'none';
  }
  if (Presedanja.value === 'Two Stops') {
    document.getElementById('firstStop').style.display = 'inline';
    document.getElementById('secondStop').style.display = 'inline';
  }
});

presedanjePocetna();
