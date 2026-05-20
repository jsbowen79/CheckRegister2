const { getDB } = require('../models/mongoDb.js');
const NotFoundError = require('../errors/NotFoundError.js');
const UserDataError = require('../errors/userDataError.js');
const MongoDBConnectionError = require('../errors/mongoDBConnectionError.js');
const AppError = require('../errors/appError.js');

async function getOne(accountId) {
  try {
    const db = getDB();
    const data = await db
      .collection('accounts')
      .findOne({ accountId: accountId });
    console.log('Data: ', data);
    if (!data) {
      console.log('no data, throwing not found error.');
      throw new NotFoundError(`Account ${accountId} does not exist.`);
    }
    return data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new MongoDBConnectionError('There was a problem with the database.');
  }
}

async function getAll() {
  try {
    const db = getDB();

    const data = await db.collection('accounts').find({}).toArray();
    if (data.length === 0) {
      throw new NotFoundError('The database contains no accounts.');
    }

    return data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new MongoDBConnectionError(
      'There was a problem connecting with the database.'
    );
  }
}

async function createNewAccount(entry) {
  try {
    const db = getDB();
    const data = await db.collection('accounts').insertOne(entry);
    if (data) return data;
    else
      throw new MongoDBConnectionError(
        'There was a problem saving to the database.  Account not saved.'
      );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new MongoDBConnectionError(
      'There was a problem connecting with the database.'
    );
  }
}

async function updateDatabaseEntry(accountId, updates) {
  const db = getDB();
  if (await db.collection('accounts').findOne({ accountId: accountId })) {
    try {
      const result = await db
        .collection('accounts')
        .updateOne({ accountId: accountId }, { $set: updates });

      console.log('result: ', result);
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new MongoDBConnectionError(
        'There was a problem with the database.  Update failed.'
      );
    }
  } else {
    throw new UserDataError(
      `There is no account with account Id ${accountId}.  Try another account number`
    );
  }
}

async function deleteFromDatabase(accountId) {
  const db = getDB();
  if (await db.collection('accounts').findOne({ accountId: accountId })) {
    try {
      const result = await db
        .collection('accounts')
        .deleteOne({ accountId: accountId });
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new MongoDBConnectionError(
        'There was a problem with the database.  File deletion failed.'
      );
    }
  } else {
    throw new UserDataError(`Account Id ${accountId} does not exist.`);
  }
}

module.exports = {
  getOne,
  getAll,
  createNewAccount,
  updateDatabaseEntry,
  deleteFromDatabase,
};
