module.exports = (sequelize, DataTypes) => {
  const Rezervacija = sequelize.define(
    'Rezervacija',
    {
      rezervacija_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      imeUsera: {
        type: DataTypes.STRING,
        require: true,
      },
      sediste: {
        type: DataTypes.STRING,
      },
    },
    { freezeTableName: true }
  );

  return Rezervacija;
};
