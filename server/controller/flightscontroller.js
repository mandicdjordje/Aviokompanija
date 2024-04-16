const db = require('../models/index');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { DataTypes } = require('sequelize');
const { where, Op } = require('sequelize');
const { model } = require('mongoose');

function time_convert(num) {
  var hours = Math.floor(num / 60);
  var minutes = num % 60;
  return hours + ':' + minutes;
}

const createFlight = async (req, res) => {
  const admin_id = req.userId;

  const {
    from,
    to,
    timeDeparture,
    timeLanding,
    distance,
    direction,
    transfer,
    firstStop,
    secondStop,
    price,
    airplane_id,
  } = req.body;

  const vremePolaska = new Date(timeDeparture);
  const vremeSletanja = new Date(timeLanding);

  const razlimaMiliS = vremeSletanja - vremePolaska;

  const rezultatVremena = razlimaMiliS / (1000 * 60 * 60);

  const airplane = await db.avion.findOne({
    where: { airplane_id: airplane_id },
  });

  const flight = await db.let.create({
    from: from,
    to: to,
    timeDeparture: timeDeparture,
    timeLanding: timeLanding,
    distance: distance,
    direction: direction,
    transfer: transfer,
    firstStop: firstStop,
    secondStop: secondStop,
    price: price,
    admin_id: admin_id,
    airplane_id: airplane_id,
    avioKomp_id: airplane.avioKomp_id,
    numberOfSeats: airplane.number_of_seats,
    numberOfRemainingSeats: airplane.number_of_seats,
  });

  res.status(StatusCodes.OK).json({ flight });
};
const getFlight = async (req, res) => {
  const { flight_id } = req.params;

  const flight = await db.let.findOne({ where: { flight_id: flight_id } });

  res.status(StatusCodes.OK).json({ flight });
};
const getAllFlights = async (req, res) => {
  const allFlights = await db.let.findAll();

  res.status(StatusCodes.OK).json(allFlights);
};

const getFlights = async (req, res) => {
  flightsInfo = await db.let.findAll({
    where: { flight_id: req.query.flight_id },
  });

  res.status(StatusCodes.OK).json({ flightsInfo });
};

const getAirplane_from_flight = async (req, res) => {
  const flight_id = req.body.flight_id;

  const flight = await db.let.findOne({ where: { flight_id: flight_id } });

  const airplane = await db.avion.findOne({
    where: { airplane_id: flight.airplane_id },
  });

  res.status(StatusCodes.OK).json(airplane);
};

const sendFriendsRequestForFlight = async (req, res) => {
  const { friends_id, flight_id } = req.body;
  const user_id = req.userId;

  let prijateljiNiz = [];
  for (let i = 0; i < friends_id.length; i++) {
    let friend = await db.prijatelji.findOne({
      where: {
        [Op.or]: [
          { from_id: user_id, to_id: friends_id[i] },
          { from_id: friends_id[i], to_id: user_id },
        ],
      },
    });

    prijateljiNiz.push(friend);

    await db.prijateljLet.create({
      from_id: user_id,
      to_id: friends_id[i],
      flight_id: flight_id,
      friends_id: prijateljiNiz[i].friends_id,
    });
  }

  const prijateljiLet = res.status(StatusCodes.CREATED).json({ prijateljiNiz });
};

// const getInvitation  = async(req,res)=>{
//   const user_id = req.userId;

//   const invitationId = req.params;

// }
const getInvitations = async (req, res) => {
  const user_id = req.userId;

  const getInvitations = await db.prijateljLet.findAll({
    where: { [Op.or]: [{ from_id: user_id }, { to_id: user_id }] },
  });

  res.status(StatusCodes.OK).json({ getInvitations });
};

const getUsersInvitations = async (req, res) => {
  const user_id = req.userId;

  const zahtevPrijatelj = await db.prijateljLet.findAll({
    where: { to_id: user_id },
    include: [
      {
        model: db.let,
        as: 'let',
        // used to force left join
        required: false,
      },
      // db.prijatelji,
      {
        model: db.prijatelji,

        // include: [
        //   {
        //     model: db.korisnik,
        //     as: 'from',
        //   },
        // ],
      },
    ],
  });

  res.status(StatusCodes.OK).json({ zahtevPrijatelj });
};

const acceptFriendRequest = async (req, res) => {
  const invitationId = req.params.invitation;

  const acceptInvitation = await db.prijateljLet.update(
    { status: 'accepted' },
    { where: { request_id: invitationId } }
  );

  res.status(StatusCodes.OK).json({ success: 'true' });
};

const declineFriendRequest = async (req, res) => {
  const invitationId = req.params.invitation;

  const deleteInvitation = await db.prijateljLet.destroy({
    where: { request_id: invitationId },
  });

  res.status(StatusCodes.ACCEPTED).json({ success: true });
};

const searchFlights = async (req, res) => {
  let { from, to, smer, stops, putnici, polazakOd, polazakDo } = req.query;
  let flights;

  let polazakDatum = new Date(polazakOd);
  let polazakDatum2 = new Date(polazakDo);

  if (to === '') {
    if (stops === 'All' && smer === 'All') {
      flights = await db.let.findAll({
        where: {
          from: from,
          [Op.or]: {
            timeDeparture: {
              [Op.between]: [polazakDatum, polazakDatum2],
            },
          },
        },
      });
    } else if (smer === 'All') {
      flights = await db.let.findAll({
        where: {
          from: from,
          transfer: stops,
          [Op.or]: {
            timeDeparture: {
              [Op.between]: [polazakDatum, polazakDatum2],
            },
          },
        },
      });
    } else if (stops === 'All') {
      flights = await db.let.findAll({
        where: {
          from: from,
          direction: smer,
          [Op.or]: {
            timeDeparture: {
              [Op.between]: [polazakDatum, polazakDatum2],
            },
          },
        },
      });
    } else {
      flights = await db.let.findAll({
        where: {
          from: from,
          transfer: stops,
          direction: smer,
          [Op.or]: {
            timeDeparture: {
              [Op.between]: [polazakDatum, polazakDatum2],
            },
          },
        },
      });
    }
  } else {
    if (stops === 'All' && smer === 'All') {
      flights = await db.let.findAll({
        where: {
          from: from,
          to: to,
          [Op.or]: {
            timeDeparture: {
              [Op.between]: [polazakDatum, polazakDatum2],
            },
          },
        },
      });
    } else if (smer === 'All') {
      flights = await db.let.findAll({
        where: {
          from: from,
          to: to,
          transfer: stops,
          [Op.or]: {
            timeDeparture: {
              [Op.between]: [polazakDatum, polazakDatum2],
            },
          },
        },
      });
    } else if (stops === 'All') {
      flights = await db.let.findAll({
        where: {
          from: from,
          to: to,
          direction: smer,
          [Op.or]: {
            timeDeparture: {
              [Op.between]: [polazakDatum, polazakDatum2],
            },
          },
        },
      });
    } else {
      flights = await db.let.findAll({
        where: {
          from: from,
          to: to,
          transfer: stops,
          direction: smer,
          [Op.or]: {
            timeDeparture: {
              [Op.between]: [polazakDatum, polazakDatum2],
            },
          },
        },
      });
    }
  }

  res.status(StatusCodes.ACCEPTED).json({ flights });
};



module.exports = {
  createFlight,
  getAllFlights,
  getAirplane_from_flight,
  getFlight,
  getFlights,
  sendFriendsRequestForFlight,
  getInvitations,
  getUsersInvitations,
  acceptFriendRequest,
  declineFriendRequest,
  searchFlights,
};
