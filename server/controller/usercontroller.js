const db = require('../models/index');

const jwt = require('jsonwebtoken');
const { StatusCodes, OK } = require('http-status-codes');
const CustomError = require('../errors');
const localStorage = require('node-localstorage');
const { logLevel } = require('live-server');
const { Sequelize, Op, literal, where } = require('sequelize');

const getCurrentInfo = async (req, res) => {
  const userId = req.userId;

  const currentUser = await db.korisnik.findOne({ where: { user_id: userId } });

  const body = {};

  if (currentUser.role === 'ADMIN_AVIO') {
    body.adminAvio = true;
  } else body.adminAvio = false;

  if (currentUser.role === 'ROOT') {
    body.root = true;
  } else body.root = false;

  res.status(StatusCodes.OK).json({ body });
};

const getCurrentUser = async (req, res) => {
  const user_id = req.userId;

  const user = await db.korisnik.findOne({ where: { user_id: user_id } });

  res.status(StatusCodes.OK).json({ user });
};
const getUser = async (req, res) => {
  const user_id = req.params.user_id;

  console.log(user_id);

  const user = await db.korisnik.findOne({ where: { user_id: user_id } });

  res.status(StatusCodes.OK).json({ user });
};
const getUsersInfo = async (req, res) => {
  // console.log(req.query);

  const data = await db.korisnik.findAll({
    where: {
      user_id: req.query.user_id,
    },
  });

  res.status(StatusCodes.OK).json({ data });
};
const updateUser = async (req, res) => {
  const userId = req.userId;

  const { firstName, lastName, email, password } = req.body;

  const encriptedPassword = await db.korisnik.prototype.encryptPassword(
    password
  );

  const user = await db.korisnik.update(
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: encriptedPassword,
    },
    { where: { user_id: userId } }
  );

  res.status(StatusCodes.OK).json({ success: true });
};
const getAllUsers = async (req, res) => {
  const userId = req.userId;

  const users = await db.korisnik.findAll({
    // attributes: {
    //   include: [
    //     literal(`(
    //       SELECT COUNT(*) FROM prijatelj
    //     )`),
    //     'prijatelj',
    //   ],
    // },

    where: { role: 'USER', user_id: { [Op.not]: userId } },
    raw: true,
  });

  const friends = await db.prijatelji.findAll({ raw: true });

  for (let i = 0; i < users.length; i++) {
    users[i].poslatZahtev = false;
    users[i].primljenZahtev = false;
    users[i].prijatelji = false;
    for (let j = 0; j < friends.length; j++) {
      // logika za poslat zahtev
      if (
        friends[j].from_id === userId &&
        friends[j].to_id === users[i].user_id
      ) {
        users[i].poslatZahtev = true;
      }

      if (
        friends[j].to_id === userId &&
        friends[j].from_id === users[i].user_id
      ) {
        users[i].primljenZahtev = true;
      }

      if (
        friends[j].to_id === userId &&
        friends[j].from_id === users[i].user_id &&
        friends[j].status === 'accepted'
      ) {
        users[i].poslatZahtev = false;
        users[i].primljenZahtev = false;

        users[i].prijatelji = true;
      }

      if (
        friends[j].to_id === users[i].user_id &&
        friends[j].from_id === userId &&
        friends[j].status === 'accepted'
      ) {
        users[i].poslatZahtev = false;
        users[i].primljenZahtev = false;

        users[i].prijatelji = true;
      }
    }
  }

  res.status(StatusCodes.OK).json({ users });
};
const getAdmin = async (req, res) => {
  const admin_status = req.params.admin_status;
  console.log(admin_status);
  admins_avio = await db.korisnik.findAll({ where: { role: admin_status } });

  res.status(StatusCodes.OK).json({ admins_avio });
};
const paginateUsers = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const resultUsers = users.slice(startIndex, endIndex);

  res.status(StatusCodes.OK).json({ resultUsers, page, limit });
};
const removeAdmin = async (req, res) => {
  const user_id = req.params.user_id;

  user = await db.korisnik.update(
    { role: 'USER', avio_id: null },
    { where: { user_id: user_id } }
  );

  res.status(StatusCodes.OK).json({ user });
};
module.exports = {
  updateUser,
  getAllUsers,
  getCurrentInfo,
  paginateUsers,
  getCurrentUser,
  getUser,
  getUsersInfo,
  getAdmin,
  removeAdmin,
};
