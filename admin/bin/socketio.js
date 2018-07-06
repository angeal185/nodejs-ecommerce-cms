const app = require('../../admin'),
_ = require('lodash'),
debug = require('debug')('app:server'),
http = require('http'),
fs = require('fs'),
config = require('../config'),
modJSON = require('../modules/modJSON'),
chalk = require('chalk');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
//var server = require('http').Server(app);
var io = require('socket.io')(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

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

/**
 * Event listener for HTTP server "error" event.
 */

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

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


//socket.io
io.sockets.on("connection", function(socket){
  console.log(chalk.blueBright('[socketio] '), chalk.greenBright('server listening'));



socket.on('updateItems', function(i){
  var udFile = './admin/data/data.json',
  outFile = './app/public/data/data.json';

  fs.copyFile(udFile, udFile +'.bak', (err) => {
      if (err) throw err;

      fs.readFile(udFile, 'utf8' , function(err, data){
        if (err) throw err;
        out = JSON.parse(data)

        out[i.type] = i.data
        console.log(JSON.stringify(out,0,2));

        _.forEach([udFile,outFile],function(toWrite){
          fs.writeFile(toWrite, JSON.stringify(out),function(err){
            if (err) throw err;
          });
        })
        socket.emit('success', 'success');


      });
  });
});




/*
  socket.on('changeMode', function(i){
    console.log('changeMode: ' + i.name);
    modJSON.path('./admin/app/data/data.json')
      .modify('mode', i.name);

  });
*/

});
