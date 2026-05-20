const { MongoClient } = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.MONGO_URI);
const mongoDBConnectionError = require('../errors/mongoDBConnectionError');
console.log('In mongoDB.js');
let db;

async function connectDB() {
  try {
    console.log('initializing database: ');
    await client.connect();
    db = client.db('CheckRegister');
    console.log('Connected to MongoDB');

    return db;
  } catch {
    throw new mongoDBConnectionError('Mongo DB failed to connect.');
  }
}

function getDB() {
  if (!db) {
    throw new mongoDBConnectionError('Database not initialized.');
  }
  return db;
}

module.exports = { connectDB, getDB };
