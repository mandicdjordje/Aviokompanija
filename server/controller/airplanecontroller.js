const db = require('../models/index');

const { StatusCodes, OK, CREATED } = require('http-status-codes');
const CustomError = require('../errors');

const createAirplane = async (req, res) => {
  const user_id = req.userId;

  const { name, rows, columns } = req.body;

  const admin = await db.korisnik.findOne({ where: { user_id: user_id } });

  const avion = await db.avion.create({
    name: name,
    rows: rows,
    columns: columns,
    number_of_seats: rows * columns,
    avioKomp_id: admin.avio_id,
    admin_id: user_id,
  });

  if (avion.name === '') {
    avionKonacno = await db.avion.update(
      { name: 'Boing 747' },
      { where: { name: '' } }
    );
  }

  res.status(StatusCodes.CREATED).json({ avion });
};

const getAllAirplanes = async (req, res) => {
  const user_id = req.userId;

  const admin = await db.korisnik.findOne({ where: { user_id: user_id } });

  const allAirplanes = await db.avion.findAll({
    where: { avioKomp_id: admin.avio_id },
  });

  res.status(StatusCodes.CREATED).json({ allAirplanes });
};

const selektovaniAvion = async (req, res) => {
  const airplane_id = req.body.airplane_id;

  const avionSelektovani = await db.avion.findOne({
    where: { airplane_id: airplane_id },
  });

  res.status(StatusCodes.OK).json({ avionSelektovani });
};

module.exports = { createAirplane, getAllAirplanes, selektovaniAvion };
