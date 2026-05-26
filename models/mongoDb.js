const { MongoClient } = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.MONGO_URI);
const mongoDBConnectionError = require('../errors/mongoDBConnectionError');

let db;

async function connectDB() {
  if (!db) {
    try {
      console.log('initializing database: ');
      await client.connect();
      db = client.db('CheckRegister');
      console.log('Connected to MongoDB');

      return db;
    } catch {
      throw new mongoDBConnectionError('Mongo DB failed to connect.');
    }
  } else {
    return db;
  }
}

function getDB() {
  if (!db) {
    connectDB();
  }
  return db;
}

module.exports = { connectDB, getDB };
