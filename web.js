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

mongoose.connect('mongodb://localhost/eulernode');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo DB connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

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


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
