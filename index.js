const express = require('express'),
http = require('http'),
nunjucks = require('nunjucks');
config = require('./admin/config'),
chalk = require('chalk'),

port = normalizePort(process.env.PORT || config.app.port);
path = require('path'),
bodyParser = require('body-parser'),
app = express(),
server = http.createServer(app)
debug = require('debug')('app:server');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/app'));
app.set('view engine', 'html');
nunjucks.configure('app', {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
  express: app
});

app.get('/', function(req, res){
  res.render("index.html");
});

app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
