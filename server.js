const express = require('express');
const app = express();
const PORT = 5000;
const routes = require('./routes/index.js');
const { connectDB } = require('./models/mongoDb.js');
const errorHandler = require('./errors/errorHandler.js');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger-output.json');
app.get('/', (req, res) => {
  res.send(`Server is running on port ${PORT}. `);
});

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/', routes);
app.use(errorHandler);

async function startServer() {
  console.log('starting server: ');
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error(error);
  }
}
startServer();
