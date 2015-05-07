/**
 * Allow a logged-in User to see, edit, and update her own profile
 * Allow admins to see everyone
 */

module.exports = function(req, res, ok) {

  var sessionUserMatchesId = req.session.User.id === req.param('id');
  var isAdmin = req.session.User.admin;

  // The requested id does not match the User's id,
  // and this is not an admin
  if (!(sessionUserMatchesId || isAdmin)) {
    var noRightsError = [{
      name: 'noRights',
      message: 'You must be an admin.'
    }];
    req.session.flash = {
      err: noRightsError
    };
    return res.redirect('/session/new');
  }

  ok();

};

