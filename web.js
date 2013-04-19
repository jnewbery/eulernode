var express = require('express'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  routes = require('./routes/index'),
  api_v1 = require('./routes/api_v1'),
  conf = require('./conf');

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: conf.session.secret }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.locals.pretty = true; // for development only
});

var uristring = process.env.MONGOLAB_URI ||
                process.env.MONGOHQ_URL ||
                'mongodb://localhost/eulernode';

mongoose.connect(uristring);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo DB connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

var LoginToken = mongoose.model('LoginToken');

function authenticateFromLoginToken(req, res, next) {
  var cookie = JSON.parse(req.cookies.logintoken);

  LoginToken.findOne({ username: cookie.username,
                       series: cookie.series,
                       token: cookie.token }, (function(err, token) {
    if (!token) {
      res.redirect('/login');
      return;
    }

    User.findOne({ username: token.username }, function(err, user) {
      if (user) {
        req.session.user_id = user.id;
        req.currentUser = user;

        token.token = token.randomToken();
        token.save(function() {
          res.cookie('logintoken', token.cookieValue, {
            // set the cookie to expire in two weeks from now
            expires: new Date(Date.now() + 2 * 604800000), path: '/'
          });
          next();
        });
      } else {
        res.redirect('/login');
      }
    });
  }));
}

var User = mongoose.model('User');

function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/login');
      }
    });
  } else if (req.cookies.logintoken) {
    authenticateFromLoginToken(req, res, next);
  } else {
    res.redirect('/login');
  }
}

app.get('/', loadUser, routes.index);
app.get('/login', routes.login_page);
app.post('/login', routes.login);
app.get('/register', routes.register_page);
app.post('/register', routes.register);
app.get('/logout', loadUser, routes.logout);

// API
app.get('/v1/problems', api_v1.problem_list);
app.post('/v1/problems', api_v1.problem_post);
app.get('/v1/problems/:id', api_v1.problem);

// for testing, export the app itself
module.exports = app;

if (process.env.NODE_ENV != 'test') {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}

