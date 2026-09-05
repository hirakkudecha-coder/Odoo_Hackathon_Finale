require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Urban Furniture Backend Server Running `);
    console.log(` Port:    ${PORT}`);
    console.log(` Env:     ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health:  http://localhost:${PORT}/api/health`);
    console.log(` Heartbeat: http://localhost:${PORT}/api/health/heartbeat`);
    console.log(`=========================================`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
