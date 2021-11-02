// Dependencies
var counter = 1;
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var {Server} = require("socket.io");
var io = new Server(server);
var lastUpdateTime = (new Date()).getTime();
var currentTime = (new Date()).getTime();
var timeDifference = currentTime - lastUpdateTime;
app.set('port', process.env.PORT || 80);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(process.env.PORT || 80, function() {
  console.log('Starting server on port process.env.PORT || 80');
});
// Add the WebSocket handlers
io.on('connection', function(socket) {
});
var players = {};
io.on('connection', function(socket) {
  socket.on('disconnect', function() {
	  players[socket.id] = {};
  });
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300,
	  color: "#" + Math.floor(Math.random() * 0x1000000).toString(16),
	  name: socket.id.toString(),
	  displayName: "player" + counter.toString()
    };
	counter++;
  });
  socket.on('nameChange', function(name) {
	  players[socket.id].displayName = name;
  });
  socket.on('colorChange', function(name)
  {
	 players[socket.id].color = "#" + name;
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5 * timeDifference;
    }
    if (data.up) {
      player.y -= 5 * timeDifference;
    }
    if (data.right) {
      player.x += 5 * timeDifference;
    }
    if (data.down) {
      player.y += 5 * timeDifference;
    }
  });
});
setInterval(function() {
  io.sockets.emit('state', players);
  currentTime = (new Date()).getTime();
  timeDifference = (currentTime - lastUpdateTime) / 60;
  lastUpdateTime = currentTime;
}, 1000 / 60);
