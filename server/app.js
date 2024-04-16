require('express-async-errors');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const friendsRouter = require('./routes/friendRoute');
const avioRouter = require('./routes/avioRoute');
const flightRouter = require('./routes/flightsRoute');
const airplaneRouter = require('./routes/airplaneRoute');
const reservationRouter = require('./routes/reservationRoute');

// routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/friend', friendsRouter);
app.use('/api/v1/avio', avioRouter);
app.use('/api/v1/flight', flightRouter);
app.use('/api/v1/airplane', airplaneRouter);
app.use('/api/v1/reservation', reservationRouter);

// middleware
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
