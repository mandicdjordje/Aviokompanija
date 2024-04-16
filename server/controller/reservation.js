const db = require('../models/index');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { where } = require('sequelize');

const createReservation = async (req, res) => {
  const userId = req.userId;
  const { sediste, flight_id } = req.body;

  const User = await db.korisnik.findOne({ where: { user_Id: userId } });

  for (let i = 0; i < sediste.length; i++) {
    await db.rezervacija.create({
      imeUsera: `${User.firstName} ${User.lastName}`,
      sediste: sediste[i],
      flight_id: flight_id,
      user_id: userId,
    });

    // await db.flight.update(
    //   { numberOfRemainingSeats: -1 },
    //   {
    //     where: {
    //       flight_id: flight_id,
    //     },
    //   }
    // );
  }

  res.status(StatusCodes.OK).json({ success: true });
};

const reservedSeats = async (req, res) => {
  const { flight_id } = req.params;

  const Rezervacije = await db.rezervacija.findAll({
    where: { flight_id: flight_id },
  });

  res.status(StatusCodes.OK).json({ Rezervacije });
};

const flightFromReservation = async (req, res) => {
  const user_Id = req.userId;

  const rezervacijeUsera = await db.rezervacija.findAll({
    where: {
      user_Id: user_Id,
    },
  });

  res.status(StatusCodes.OK).json({ rezervacijeUsera });
};

const deleteAllReservationForFlight = async (req, res) => {
  const flight_id = req.params.flight_id;
  const user_Id = req.userId;

  const reservation = await db.rezervacija.destroy({
    where: { flight_id: flight_id, user_Id: user_Id },
  });

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  createReservation,
  reservedSeats,
  flightFromReservation,
  deleteAllReservationForFlight,
};
