module.exports = function(req, res, next) {
  res.locals.flash = undefined;

  if (!req.session.flash) return next();

  res.locals.flash = _.clone(req.session.flash);

  // clear flash
  req.session.flash = undefined;

  next();
};

