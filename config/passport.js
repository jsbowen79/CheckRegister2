const GitHubStrategy = require('passport-github2');
const { manageUser } = require('../models/userManagement.js');
const { getDB } = require('../models/mongoDb.js');
const { ObjectId } = require('mongodb');

require('dotenv').config();

module.exports = function configurePassport(passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = await manageUser(profile);
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const db = await getDB();
      const _id = new ObjectId(id);
      const user = await db.collection('users').findOne({ _id });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
