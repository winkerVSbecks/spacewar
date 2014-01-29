/*
 * Serve content over a socket
 */

module.exports = function (socket) {

	var battle = require('./battle');

	// Broadcast Teams
	var sendTeams = function () {
		socket.broadcast.emit('teams', battle);
		socket.emit('teams', battle);
	};


	// Team
  socket.on('get:teams', function () {
  	sendTeams();
  });


  // Announce ready
  socket.on('begin:battle', function (team) {
  	battle[team].isReady = true;
  	sendTeams();
  });


  // Select Team
  socket.on('team:selection', function (team) {
  	battle[team].selected = true;
  	sendTeams();
  });


  // Update Battle
  socket.on('battle:update', function (u) {
  	battle[u.this.team].health = u.this.health;
  	battle[u.other.team].health = u.other.health;
  	sendTeams();
  });


  // Reset Battle
  socket.on('battle:reset', function () {
  	
  	battle.red.isReady = false;
  	battle.red.health = 50;

  	battle.blue.isReady = false;
  	battle.blue.health = 50;

		socket.broadcast.emit('battle:restarted');

  	sendTeams();
  });


  // Begin
  sendTeams();

};
