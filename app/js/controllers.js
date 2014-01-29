'use strict';

/* Controllers */

angular.module('spacewar.controllers', [])

	// ---------------------------
	// Pick Teams Controller
	// ---------------------------
	.controller('PickTeamsCtrl', function ($scope, $location, socket) {

		$scope.selectTeam = function (name) {

			if( !$scope.teams[name].selected )
				socket.emit('team:selection', name);

			$location.path('/battle/' + name);

  	};


  	$scope.spectate = function () {
  		
  		$location.path('/battle');
  	
  	};

  	// get teams
  	socket.emit('get:teams');

  	// receive team updates
    socket.on('teams', function (data) {
    
      $scope.teams = data;
    
    });
  
  })


  // ---------------------------
	// Battle Controller
	// ---------------------------
  .controller('BattleCtrl', function ($scope, $routeParams, socket) {

  	$scope.battle = {
  		state   : 'notStarted',
  		result  : '',
  		message : ''
  	};
    $scope.this = $routeParams.name;
    $scope.batleResult = '';
    $scope.other = $scope.this === 'blue' ? 'red' : 'blue';


    // Send that your are ready
  	$scope.playerReady = function () {
  		socket.emit('begin:battle', $scope.this);
  	};

    // get teams
  	socket.emit('get:teams');

  	// receive team updates
    socket.on('teams', function (data) {
      $scope.teams = data;

      if ( $scope.teams[$scope.this].isReady 
  				&& $scope.teams[$scope.other].isReady 
  				&& $scope.battle.state === 'notStarted' )
      	$scope.battle.state = 'started';

      $scope.checkBattleResult();

    });


    // receive battle restart
    socket.on('battle:restarted', function (data) {
    	socket.emit('get:teams');
    	$scope.battle = {
	  		state   : 'notStarted',
	  		result  : '',
	  		message : ''
	  	};
    });


    // Update health to keep battle in sync
    $scope.updateHealth = function () {

    	var update = {
    		
    		this  : { 
    			team   : $scope.this, 
    			health : $scope.teams[$scope.this].health
    		},

    		other : { 
    			team   : $scope.other, 
    			health : $scope.teams[$scope.other].health
    		},
    	
    	};

  		socket.emit('battle:update', update);
    
    };


    // Rematch
    $scope.rematch = function () {
    	socket.emit('battle:reset');
    	$scope.battle = {
	  		state   : 'notStarted',
	  		result  : '',
	  		message : ''
	  	};
    };

    // Check win/loss
    $scope.checkBattleResult = function () {

    	if( $scope.teams[$scope.this].health === 100 ) {
    		$scope.battle = {
		  		state   : 'finished',
		  		result  : 'win',
		  		message : 'Victory Is Yours!'
		  	};
    	}

    	if( $scope.teams[$scope.this].health === 0 ) {
    		$scope.battle = {
		  		state   : 'finished',
		  		result  : 'loss',
		  		message : 'You Lose! Good Day Sir!'
		  	};
		  }
    
    };



    // BATTLE!
		$(window).bind('keyup', function (event) {

			console.log(event)
		  
		  if (event.which === 32) {    
		    
		    $scope.$apply( function () {
		    	
		    	if(	$scope.teams[$scope.this].health < 100
		    			&& $scope.teams[$scope.other].health < 100
		    			&& $scope.teams[$scope.this].health > 0 
		    			&& $scope.teams[$scope.other].health > 0) {
				    	
				    	$scope.teams[$scope.this].health += 5;
		    			$scope.teams[$scope.other].health -= 5;

		    	}

		    	$scope.updateHealth();

		    });

		    event.preventDefault();
		  }
		
		});
  
  });
