const routes = require('express').Router();
const asyncHandler = require('../errors/asyncHandler.js');
const passport = require('passport');

routes.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/github' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);
routes.get('/github', asyncHandler(passport.authenticate('github')));
routes.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully.' });
    });
  });
});

module.exports = routes;
