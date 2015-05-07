/**
 * Allow any admin user.
 */
module.exports = function(req, res, ok) {

  // Admin is allowed, proceed to controller
  if (req.session.User && req.session.User.admin) {
    return ok();
  }

  // Non-admin is not allowed
  else {
    var requiredAdminError = [{
      name: 'requiredAdminError',
      message: 'You must be an admin.'
    }];
    req.session.flash = {
      err: requiredAdminError
    };
    res.redirect('/session/new');
  }
};

