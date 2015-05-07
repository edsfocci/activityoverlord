/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  'new': function(req, res) {
    res.view();
  },

  create: function(req, res, next) {

    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    };

    // Create a User with the params sent from
    //  the sign-up form --> new.ejs
    // "req.params.all()" same as "req.allParams()"
    User.create(userObj, function(err, user) {

      // // If there's an error
      // if (err) return next(err);

      if (err) {
        // console.log(err);
        req.session.flash = {
          err: err.invalidAttributes
        };

        // If error redirect back to sign-up page
        return res.redirect('/user/new');
      }

      // Log User in
      req.session.authenticated = true;
      req.session.User = user;

      // After successfully creating the User
      // redirect to the show action
      // From ep1-6: //res.json(user);

      res.redirect('/user/'+user.id);
    });
  },

  // show
  findOne: function(req, res, next) {
    User.findOne(req.param('id'), function(err, user) {
      if (err) return next(err); // Catch all other errors
      if (!user) return next(); // Redirect to 404
      res.view({
        user: user
      });
    });
  },

  index: function(req, res, next) {

    // Get an array of all Users in the User collection (e.g. table)
    User.find(function(err, users) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        users: users
      });
    });
  },

  // render the edit view (e.g. /views/edit.ejs)
  edit: function(req, res, next) {

    // Find the User from the id passed in via params
    User.findOne(req.param('id'), function(err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      res.view({
        user: user
      });
    });
  },

  // process the info from edit view
  update: function(req, res, next) {

    if (req.session.User.admin) {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email'),
        admin: req.param('admin')
      };
    } else {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email')
      };
    }

    User.update(req.param('id'), userObj, function(err) {
      if (err) {
        req.session.flash = {
          err: err.invalidAttributes
        };
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {

    User.findOne(req.param('id'), function(err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function(err) {
        if (err) return next(err);

      });

      res.redirect('/user');

    });
  }
	
};

