/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

  'new': function(req, res) {

    res.view();
  },

  create: function(req, res, next) {

    // Check for email and password in params sent via the form; if none,
    // redirect the browser back to the sign-in form.
    if (!req.param('email') || !req.param('password')) {
      // return next({err: ["Password doesn't match password confirmation."]});

      var usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.'
      }];

      // Remember that err is the object being passed down (a.k.a. flash.err),
      // whose value is another object with the key of
      // usernamePasswordRequiredError
      req.session.flash = {
        err: usernamePasswordRequiredError
      };

      return res.redirect('/session/new');
    }

    // Try to find the User by their email address.
    User.findOneByEmail(req.param('email')).exec(function(err, user) {
      if (err) return next(err);

      // If no User is found...
      if (!user) {
        var noAccountError = [{
          name: 'noAccount',
          message: 'The email address ' + req.param('email') + ' not found.'
        }];
        req.session.flash = {
          err: noAccountError
        };
        return res.redirect('/session/new');
      }

      // Compare password from the form params to the encrypted password of the
      // User found.
      bcrypt.compare(req.param('password'), user.encryptedPassword,
        function(err, valid) {
        if (err) return next(err);

        // If the password from the form doesn't match the password from the
        // database...
        if (!valid) {
          var usernamePasswordMismatchError = [{
            name: 'usernamePasswordMismatch',
            message: 'Invalid username and password combination.'
          }];
          req.session.flash = {
            err: usernamePasswordMismatchError
          };
          return res.redirect('/session/new');
        }

        // Log User in
        req.session.authenticated = true;
        req.session.User = user;

        // Change status to online
        user.online = true;
        user.save(function(err, user) {
          if (err) return next(err);

          // If the User is also an admin, redirect to the user list
          // (e.g. /views/user/index.ejs)
          // This is used in conjunction with config/policies.js file
          if (req.session.User.admin) {
            return res.redirect('/user');
          }

          // Redirect to their profile page (e.g. /views/user/findOne.ejs)
          res.redirect('/user/' + user.id);
        });
      });
    });
  },

  destroy: function(req, res) {

    User.findOne(req.session.User.id, function(err, user) {

      var userId = req.session.User.id;

      // The User is "logging out" (e.g. destroying the session), so change the
      // online attribute to false.
      User.update(userId, {
        online: false
      }, function(err) {
        if (err) return next(err);

        // Wipe out the session (log out)
        req.session.destroy();

        // Redirect the browser to the sign-in screen
        res.redirect('/session/new');
      });
    });
  }
};

