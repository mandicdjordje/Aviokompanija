module.exports = (sequelize, DataTypes) => {
  const FriendFlight = sequelize.define(
    'prijateljLet',
    {
      request_id: {
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
  return FriendFlight;
};
