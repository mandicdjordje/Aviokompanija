// const Korisnik = require('../models/korisnik');
const db = require('../models/index');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');

const register = async (req, res, next) => {
  const encriptedPassword = await db.korisnik.prototype.encryptPassword(
    req.body.password
  );

  const isFirstAccount = await db.korisnik.findOne();
  const role = isFirstAccount ? 'USER' : 'ROOT';

  const korisnik = db.korisnik.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: encriptedPassword,
    email: req.body.email,
    role: role,
    isVerified: false,
    token: '',
  });

  res.status(StatusCodes.CREATED).json({ success: true, });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const korisnik = await db.korisnik.findOne({ where: { email: email } });

  if (!korisnik) {
    throw new CustomError.UnauthenticatedError('Invaliddd Credentials');
  }

  const isPasswordCorrect = await bcrypt.compare(password, korisnik.password);

  console.log(isPasswordCorrect);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  user_id = korisnik.user_id;
  const token = jwt.sign({ user_id, role: korisnik.role }, 'my_secret_key', {
    expiresIn: '48h',
  });

  korisnik.isVerified = true;
  console.log(korisnik.toJSON());
  res.status(StatusCodes.OK).json({ msg: 'login', token: token });
};

module.exports = {
  register,
  login,
};
