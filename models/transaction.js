const { getDB } = require('../models/mongoDb.js');
const NotFoundError = require('../errors/NotFoundError.js');
const UserDataError = require('../errors/userDataError.js');
const MongoDBConnectionError = require('../errors/mongoDBConnectionError.js');
const { ObjectId } = require('mongodb');

async function getOneTransaction(transactionId) {
  console.log('transactionId: ', transactionId);
  try {
    const _id = new ObjectId(transactionId);
    console.log('_id: ', _id, typeof _id);
    if (_id) {
      const db = getDB();
      const data = await db.collection('transactions').findOne({ _id: _id });
      if (!data) {
        throw new NotFoundError(`Transaction ${transactionId} does not exist.`);
      }
      return data;
    } else
      throw new UserDataError(
        'You must enter a valid MongoId for the transactionId.'
      );
  } catch {
    throw new MongoDBConnectionError('There was a problem with the database.');
  }
}

async function getAllTransactions() {
  try {
    const db = getDB();

    const data = await db.collection('transactions').find({}).toArray();
    if (data.length === 0) {
      throw new NotFoundError('The database contains no transactions.');
    }

    return data;
  } catch {
    throw new MongoDBConnectionError(
      'There was a problem connecting with the database.'
    );
  }
}

async function createNewTransaction(entry) {
  try {
    const db = getDB();

    const data = await db.collection('transactions').insertOne(entry);
    if (data) return data;
    else
      throw new MongoDBConnectionError(
        'There was a problem saving to the database.  Transaction not saved.'
      );
  } catch {
    throw new MongoDBConnectionError(
      'There was a problem connecting with the database.'
    );
  }
}

async function updateTransactionEntry(transactionId, updates) {
  const _id = new ObjectId(transactionId);
  if (_id) {
    const db = getDB();
    if (await db.collection('transactions').findOne({ _id: _id })) {
      try {
        const result = await db
          .collection('transactions')
          .updateOne({ _id: _id }, { $set: updates });

        return result;
      } catch {
        throw new MongoDBConnectionError(
          'There was a problem with the database.  Update failed.'
        );
      }
    } else {
      throw new UserDataError(
        `There is no transaction with Transaction Id ${transactionId}.  Try another Transaction number`
      );
    }
  } else
    throw new UserDataError(
      'You must enter a valid MongoId for the transactionId.'
    );
}

async function deleteTransactionFromDatabase(transactionId) {
  const db = getDB();
  const _id = new ObjectId(transactionId);
  console.log('_id in delete: ', _id, typeof _id);
  if (_id) {
    if (await db.collection('transactions').findOne({ _id: _id })) {
      try {
        const result = await db
          .collection('transactions')
          .deleteOne({ _id: _id });
        return result;
      } catch {
        throw new MongoDBConnectionError(
          'There was a problem with the database.  Transaction deletion failed.'
        );
      }
    } else {
      throw new UserDataError(
        `Transaction Id ${transactionId} does not exist.`
      );
    }
  } else
    throw new UserDataError(
      'Please enter a valid MongoId for the transactionId.'
    );
}

module.exports = {
  getOneTransaction,
  getAllTransactions,
  createNewTransaction,
  updateTransactionEntry,
  deleteTransactionFromDatabase,
};
