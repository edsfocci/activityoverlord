/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {

    name: {
      type: 'string',
      required: true
    },

    title: {
      type: 'string'
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    encryptedPassword: {
      type: 'string'
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }

  },

  beforeValidation: function(values, next) {
//    console.log(values);
    if (typeof values.make_admin === 'undefined') {
/*      if (values.make_admin === 'unchecked') {
        values.admin = false;
      } else if (values.make_admin[1] === 'on') {
        values.admin = true;
      }*/
      values.admin = false;
    } else if (values.make_admin === 'on') {
      values.admin = true;
    }
    next();
  },

  beforeCreate: function(values, next) {

    // This checks to make sure the password and password confirmation match
    // before creating record
    if (!values.password || values.password != values.confirmation) {
      return next({err: ["Password doesn't match password confirmation"]});
    }

    require('bcrypt').hash(values.password, 10, function(err, encryptedPassword)
      {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      // values.online= true;
      next();
    });
  }

};

