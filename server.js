const express = require('express');
const app = express();
const PORT = 5000;
const routes = require('./routes/index.js');
const { getDB } = require('./models/mongoDb.js');
const errorHandler = require('./errors/errorHandler.js');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger-output.json');
const configurePassport = require('./config/passport.js');
const oAuthRoutes = require('./routes/oAuth.js');
const passport = require('passport');
const session = require('express-session');

app.get('/', (req, res) => {
  res.send(`Server is running on port ${PORT}. `);
});
//Set up express and initialize OAuth
app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

configurePassport(passport);

//Routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/auth', oAuthRoutes);
app.use('/', routes);

app.use(errorHandler);

async function startServer() {
  console.log('starting server: ');
  try {
    await getDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error(error);
  }
}
startServer();
