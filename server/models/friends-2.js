module.exports = (sequelize, DataTypes) => {
  const Prijatelj = sequelize.define(
    'prijatelj',
    {
      friends_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.STRING,
        status: ['sent', 'accepted'],
        defaultValue: 'sent',
      },
    },
    { freezeTableName: true }
  );
  return Prijatelj;
};
