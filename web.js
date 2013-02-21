var express = require('express'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  routes = require('./routes'),
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
});

mongoose.connect('mongodb://localhost/eulernode');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo DB connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

app.get('/', routes.index);
app.get('/v1/problems', api_v1.problem_list);
app.post('/v1/problems', api_v1.problem_post);
app.get('/v1/problems/:id', api_v1.problem);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});