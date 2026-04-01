const mongoose = require('mongoose');

const buildMongoUri = () => {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  const host = process.env.MONGO_HOST || '127.0.0.1';
  const port = process.env.MONGO_PORT || '27017';
  const dbName = process.env.MONGO_DB_NAME || 'zenithcare_hospital';

  return `mongodb://${host}:${port}/${dbName}`;
};

const connectDB = async () => {
  const mongoUri = buildMongoUri();
  await mongoose.connect(mongoUri);
  return mongoose.connection;
};

const disconnectDB = async () => {
  await mongoose.connection.close();
};

module.exports = {
  mongoose,
  connectDB,
  disconnectDB,
  buildMongoUri
};
