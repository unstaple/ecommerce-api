require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => logger.error('Database connection failed', err));