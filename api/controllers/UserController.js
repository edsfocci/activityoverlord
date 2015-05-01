/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  new: function(req, res) {
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = undefined;
    res.view();
  },

  create: function(req, res, next) {

    // Create a User with the params sent from
    //  the sign-up form --> new.ejs
    User.create( req.params.all(), function(err, user) {

      // // If there's an error
      // if (err) return next(err);

      if (err) {
        console.log(err.invalidAttributes);
        req.session.flash = {
          err: err.invalidAttributes
        };

        // If error redirect back to sign-up page
        return res.redirect('/user/new');
      }

      // After successfully creating the User
      // redirect to the show action
      res.json(user);
//      req.session.flash = undefined;
    });
  }
	
};

