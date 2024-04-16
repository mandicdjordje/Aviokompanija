module.exports = (sequelize, DataTypes) => {
  const Let = sequelize.define(
    'let',
    {
      flight_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      from: {
        type: DataTypes.STRING,
      },
      to: {
        type: DataTypes.STRING,
      },
      timeDeparture: {
        type: DataTypes.DATE,
      },
      timeLanding: {
        type: DataTypes.DATE,
      },
      distance: {
        type: DataTypes.INTEGER,
      },
      direction: {
        type: DataTypes.STRING,
        direction: ['One way', 'Round Trip'],
      },
      transfer: {
        type: DataTypes.STRING,
        transfer: ['Direct', 'One Stop', 'Two Stops'],
      },
      firstStop: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      secondStop: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      price: {
        type: DataTypes.INTEGER,
      },
      numberOfSeats: {
        type: DataTypes.INTEGER,
      },
      numberOfRemainingSeats: {
        type: DataTypes.INTEGER,
      },
    },
    { freezeTableName: true }
  );
  return Let;
};
