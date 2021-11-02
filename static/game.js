var socket = io({transports: ['websocket'], upgrade: false});
var selectedSubMenu = 0;
socket.on('message', function(data) {
  console.log(data);
});
var paused = false;
var name = "";
var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
	if(selectedSubMenu == 1 && paused && (event.keyCode > 32 && event.keyCode < 127))
		name = name + String.fromCharCode(event.keyCode);
	else if(selectedSubMenu == 2 && paused && ((event.keyCode > 47 && event.keyCode < 58)||(event.keyCode > 64 && event.keyCode < 71) && name.length < 6))
		name = name + String.fromCharCode(event.keyCode);
	else if(event.keyCode == 8)
	name = name.slice(0, -1);
	else
  switch (event.keyCode) {
    case 65: // A
      movement.left = (!paused);
      break;
    case 87: // W
      movement.up = (!paused);
      break;
    case 68: // D
      movement.right = (!paused);
      break;
    case 83: // S
      movement.down = (!paused);
      break;
	case 66:
	  paused = !paused;
	  break;
	case 13:
	  if(selectedSubMenu == 1)
	  {
		socket.emit("nameChange", name);
		name = "";
		selectedSubMenu = 0;
		paused = false;
	  }
	  if(selectedSubMenu == 2 && name.length == 6)
	  {
		socket.emit("colorChange", name);
		name = "";
		selectedSubMenu = 0;
		paused = false;
	  }
	  break;
	
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);
var canvas = document.getElementById('canvas');

canvas.addEventListener('click', function(event) {
  if(paused)
  {
	  if(event.clientX > 110 && event.clientX < 680)
	  {
		  if(event.clientY > 125 && event.clientY < 295)
		  {
			  selectedSubMenu = 1;
		  }
		  if(event.clientY > 300 && event.clientY < 470)
		  {
			  selectedSubMenu = 2;
		  }
	  }
  }
}, false);
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
context.font = '14px serif';
socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  for (var id in players) {
    var player = players[id];
	context.fillStyle = player.color;
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
	context.fillText(player.displayName, player.x - 7.5, player.y - 15);
    context.fill();
  }
  if(paused)
  {
	context.globalAlpha = 0.4;
	context.fillStyle = "black";
	context.fillRect(100, 100, 600, 400);
	if(selectedSubMenu == 0)
	{
		context.fillRect(110, 125, 580, 170);
		context.fillRect(110, 300, 580, 170);
	}
	else (selectedSubMenu != 0)
		context.fillStyle = "#FFFFFF";
	context.globalAlpha = 0.8;
	context.font = '14px serif';
	context.fillStyle = "#FFFFFF";
	switch(selectedSubMenu)
	{
		case 1: context.fillText("Type Name", 400 - (getTextWidth("Type Name",14) / 2 ), 155); break;
		case 2: context.fillText("Enter Hex Values for new Color", 400 - (getTextWidth("Enter Hex Values for new Color",14) / 2 ), 155); break;
	}
	context.font = '50px serif';
		if(selectedSubMenu == 2 && name.length == 6)
		context.fillStyle = "#" + name;
	if(selectedSubMenu != 0)
		context.fillText(name, 400 - (getTextWidth(name,50) / 2 ), 300);
	else
	{
		context.font = '14px serif';
		context.fillStyle = "#FFFFFF";
		context.fillText("Change Name", 400 - (getTextWidth("Change Name",14) / 2 ), 155);
		context.fillText("Change Color", 400 - (getTextWidth("Change Color",14) / 2 ), 455);
	}
	context.globalAlpha = 1;
	context.font = '14px serif';
  }
});