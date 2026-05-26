const { getDB } = require('./mongoDb.js');
const MongoDBConnectionError = require('../errors/mongoDBConnectionError.js');
const AppError = require('../errors/appError.js');
const { ObjectId } = require('mongodb');

async function manageUser(profile) {
  const db = await getDB();

  const userId = profile.id;
  const username = profile.username;
  const displayName = profile.displayName;
  const email = profile.emails?.[0]?.value || 'no email';
  const createdAt = new Date();
  const lastLogin = new Date();

  const entry = { userId, displayName, username, email, createdAt, lastLogin };
  let userAccount = await db.collection('users').findOne({ userId: userId });
  if (userAccount) {
    console.log(
      'in manageUser, UserAccount Found: ',
      userAccount,
      userAccount._id
    );
    return userAccount;
  } else {
    try {
      const data = await db.collection('users').insertOne(entry);
      if (data) {
        console.log('in ManageUser, UserAccount not Found: ');
        userAccount = await db.collection('users').findOne({ userId: userId });
        console.log('User Account Created: ', userAccount, userAccount._id);
        return userAccount;
      } else
        throw new MongoDBConnectionError(
          'There was a problem saving User to the database.  User not saved.'
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
}

module.exports = { manageUser };
