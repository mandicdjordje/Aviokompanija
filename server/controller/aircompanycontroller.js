const db = require('../models/index');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const { where } = require('sequelize');

const createCompany = async (req, res) => {
  const { naziv, adresa, promoOpis } = req.body;

  const airCompany = await db.aviokompanija.create({
    naziv: naziv,
    adresa: adresa,
    promoOpis: promoOpis,
  });

  res.status(StatusCodes.OK).json({ airCompany });
};

const createAdmin = async (req, res) => {
  const { user_id, avio_id } = req.body;

  const foundUser = await db.korisnik.findOne({ where: { user_id: user_id } });

  if (foundUser.role === 'ADMIN_AVIO') {
    throw new CustomError.BadRequestError('Korisnik je vec admin');
  }
  const createdAdmin = await db.korisnik.update(
    {
      role: 'ADMIN_AVIO',
      avio_id: avio_id,
    },
    { where: { user_id: user_id } }
  );

  res.status(StatusCodes.OK).json({ foundUser });
};

const removeAdmin = async (req, res) => {
  const { user_id } = req.body;

  const foundUser = await db.korisnik.findOne({ where: { user_id: user_id } });

  if (foundUser.role === 'USER') {
    throw new CustomError.BadRequestError('Korisnik je USER');
  }

  const removeAdmin = await db.korisnik.update(
    {
      role: 'USER',
      avio_id: null,
    },
    { where: { user_id: user_id } }
  );

  res.status(StatusCodes.OK).json({ success: true });
};

const getAllCompanies = async (req, res) => {
  const allCompanies = await db.aviokompanija.findAll();

  res.status(StatusCodes.OK).json({ allCompanies });
};

module.exports = {
  createCompany,
  createAdmin,
  removeAdmin,
  getAllCompanies,
};
