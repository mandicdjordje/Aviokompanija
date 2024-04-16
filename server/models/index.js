const { Sequelize, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('projekat', 'root', 'mandicnikola', {
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('connected..');
  })
  .catch((err) => {
    console.log('Error' + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.korisnik = require('../models/korisnik-2')(sequelize, DataTypes);
db.prijatelji = require('../models/friends-2')(sequelize, DataTypes);

db.let = require('../models/flights-2')(sequelize, DataTypes);
db.aviokompanija = require('../models/airplanecompany-2')(sequelize, DataTypes);
db.avion = require('../models/airplane')(sequelize, DataTypes);
db.rezervacija = require('../models/rezervacija')(sequelize, DataTypes);
db.prijateljLet = require('../models/friendsFlight')(sequelize, DataTypes);

db.sequelize
  .sync()
  .then((data) => {
    console.log('Table and model sync successfully');
  })
  .catch((err) => {
    console.log('Error syncing the table and model');
  });

db.korisnik.prototype.encryptPassword = async function (canditatePassword) {
  const salt = await bcrypt.genSalt(10);
  let encryptetPassword = await bcrypt.hash(canditatePassword, salt);
  console.log(encryptetPassword);
  return encryptetPassword;
};

db.korisnik.prototype.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

// Relationships

db.aviokompanija.hasMany(db.korisnik, {
  foreignKey: 'avio_id',
});

db.korisnik.belongsTo(db.aviokompanija, {
  foreignKey: 'avio_id',
});

db.korisnik.belongsToMany(db.korisnik, {
  through: db.prijatelji,
  foreignKey: 'from_id',
  as: 'From',
});
db.korisnik.belongsToMany(db.korisnik, {
  through: db.prijatelji,
  foreignKey: 'to_id',
  as: 'To',
});

db.korisnik.hasMany(db.let, {
  foreignKey: 'admin_id',
});

db.let.belongsTo(db.korisnik, {
  foreignKey: 'admin_id',
});

db.aviokompanija.hasMany(db.avion, {
  foreignKey: 'avioKomp_id',
});
db.avion.belongsTo(db.aviokompanija, {
  foreignKey: 'avioKomp_id',
});

db.korisnik.hasMany(db.avion, {
  foreignKey: 'admin_id',
});
db.avion.belongsTo(db.korisnik, {
  foreignKey: 'admin_id',
});

db.aviokompanija.hasMany(db.let, {
  foreignKey: 'avioKomp_id',
});
db.let.belongsTo(db.aviokompanija, {
  foreignKey: 'avioKomp_id',
});

db.avion.hasMany(db.let, {
  foreignKey: 'airplane_id',
});
db.let.belongsTo(db.avion, {
  foreignKey: 'airplane_id',
});
db.let.hasMany(db.rezervacija, {
  foreignKey: 'flight_id',
});

db.rezervacija.belongsTo(db.let, {
  foreignKey: 'flight_id',
});

db.korisnik.hasMany(db.rezervacija, {
  foreignKey: 'user_id',
});
// db.rezervacija.belongsTo(db.korisnik, {
//   foreignKey: 'user_id',
// });
db.korisnik.belongsToMany(db.korisnik, {
  through: db.prijateljLet,
  foreignKey: 'from_id',
  as: 'FromFriend',
});
db.korisnik.belongsToMany(db.korisnik, {
  through: db.prijateljLet,
  foreignKey: 'to_id',
  as: 'ToFriend',
});

db.let.hasMany(db.prijateljLet, {
  foreignKey: 'flight_id',
});

db.prijateljLet.belongsTo(db.let, {
  foreignKey: 'flight_id',
});

db.prijatelji.hasMany(db.prijateljLet, {
  foreignKey: 'friends_id',
});
db.prijateljLet.belongsTo(db.prijatelji, {
  foreignKey: 'friends_id',
});
module.exports = db;
