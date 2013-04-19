var mongoose = require("mongoose");
var crypto = require('crypto');

var problemSchema = mongoose.Schema({
    _id: Number,
    name: String,
    description: String,
    answer: String,
    updated: { "type": Date, "default": Date.now }
});

problemSchema.methods.evaluate = function () {
  // TODO: properly check the solution or scrap this function
  console.log("You solution was correct");
};

// compile the Problem schema
var Problem = mongoose.model('Problem', problemSchema);


userSchema = new mongoose.Schema({
  username: { type: String, index: { unique: true } },
  hashed_password: String,
  salt: String
});

userSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password; });

userSchema.method('authenticate', function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
});

userSchema.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
});

userSchema.method('encryptPassword', function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

// compile the User schema
var User = mongoose.model('User', userSchema);

loginTokenSchema = new mongoose.Schema({
  username: { type: String, index: true },
  series: { type: String, index: true },
  token: { type: String, index: true }
});

loginTokenSchema.method('randomToken', function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
});

loginTokenSchema.pre('save', function(next) {
  // Automatically create the tokens
  this.token = this.randomToken();

  if (this.isNew)
    this.series = this.randomToken();

  next();
});

loginTokenSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});

loginTokenSchema.virtual('cookieValue')
  .get(function() {
    return JSON.stringify({ username: this.username, token: this.token, series: this.series });
});

// compile the LoginToken schema
var LoginToken = mongoose.model('LoginToken', loginTokenSchema);
