module.exports = (sequelize, DataTypes) => {
  const AvioKompanija = sequelize.define(
    'avioKompanija',
    {
      avioKomp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      naziv: {
        type: DataTypes.STRING,
        unique: true,
      },
      adresa: {
        type: DataTypes.STRING,
        defaultValue: 'Tamo neka adresa',
      },
      promoOpis: {
        type: DataTypes.STRING,
        defaultValue: 'Ovo je promo opis',
      },
    },
    { freezeTableName: true }
  );

  return AvioKompanija;
};
