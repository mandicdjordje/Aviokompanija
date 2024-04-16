module.exports = (sequelize, DataTypes) => {
  const Korisnik = sequelize.define(
    'korisnik',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        defaultValue: 'skrivenaSifra',
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          myEmailValidator(value) {
            if (value === null) {
              throw new Error('Please enter an email!');
            }
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'USER',
        role: ['USER', 'ADMIN_AVIO', 'ADMIN_HOTEL', 'ADMIN_RENT_A_CAR', 'ROOT'],
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    { freezeTableName: true }
  );
  return Korisnik;
};
