const db = require('../models/index');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { and, Op, where } = require('sequelize');

const sendRequestforFriendship = async (req, res) => {
  const firstuserId = req.userId;
  const second_user_id = req.body.user_id;

  const korisnikSend = await db.korisnik.findOne({
    where: { user_id: firstuserId },
  });
  const korisnikRecived = await db.korisnik.findOne({
    where: { user_id: second_user_id },
  });

  console.log(korisnikSend);
  console.log(korisnikRecived);

  if (!firstuserId) {
    CustomError.BadRequestError('Korisnik nije poslat');
  }

  const prijateljstvo = await db.prijatelji.create({
    from_id: korisnikSend.user_id,
    to_id: korisnikRecived.user_id,
  });

  res
    .status(StatusCodes.OK)
    .json({ success: true, korisnikSend, korisnikRecived });
};

const acceptFrendship = async (req, res) => {
  const firstuserId = req.userId;
  const second_user_id = req.body.user_id;

  const updateFrendship = await db.prijatelji.update(
    {
      status: 'accepted',
    },
    {
      where: { from_id: second_user_id, to_id: firstuserId },
    }
  );

  const prijateljstvo = await db.prijatelji.findOne({
    where: { from_id: second_user_id, to_id: firstuserId },
  });

  res.status(StatusCodes.OK).json({ updateFrendship });
};

const deliteFrendship = async (req, res) => {
  const firstuserId = req.userId;
  const second_user_id = req.body.user_id;

  const prijateljstvo = await db.prijatelji.destroy({
    where: { from_id: firstuserId, to_id: second_user_id },
  });

  res.status(StatusCodes.OK).json({ success: true });
};
const odbiPrijateljstvo = async (req, res) => {
  const firstuserId = req.userId;
  const second_user_id = req.body.user_id;

  const prijateljstvo = await db.prijatelji.destroy({
    where: { from_id: second_user_id, to_id: firstuserId },
  });

  res.status(StatusCodes.OK).json({ success: true });
};

const sendRequestForFlight = async (req, res) => {};

const getAllFriends = async (req, res) => {
  const userId = req.params.user_id;
  let usersfriends_id = [];

  const prijatelji = await db.prijatelji.findAll({
    where: {
      status: 'accepted',
      [Op.or]: [{ from_id: userId }, { to_id: userId }],
    },
  });

  for (let i = 0; i < prijatelji.length; i++) {
    if (prijatelji[i].from_id != userId) {
      usersfriends_id.push(prijatelji[i].from_id);
    }
    if (prijatelji[i].to_id != userId) {
      usersfriends_id.push(prijatelji[i].to_id);
    }
  }

  let friends = [];
  for (let i = 0; i < usersfriends_id.length; i++) {
    const prijateljiKorisnika = await db.korisnik.findOne({
      where: { user_Id: usersfriends_id[i] },
    });
    friends.push(prijateljiKorisnika);
  }
  // console.log(friends);
  // console.log(usersfriends_id);

  res.status(StatusCodes.OK).json({ friends });
};

module.exports = {
  sendRequestforFriendship,
  acceptFrendship,
  deliteFrendship,
  odbiPrijateljstvo,
  sendRequestForFlight,
  getAllFriends,
};
