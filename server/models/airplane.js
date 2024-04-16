module.exports = (sequelize, DataTypes) => {
  const Avion = sequelize.define(
    'avion',
    {
      airplane_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      rows: {
        type: DataTypes.INTEGER,
        require: true,
      },
      columns: {
        type: DataTypes.INTEGER,
        require: true,
      },
      number_of_seats: {
        type: DataTypes.INTEGER,
      },
    },
    { freezeTableName: true }
  );
  return Avion;
};
