'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('spacewar.services', [])
	
	.value('version', 'version 0.1')

	.factory('socket', function (socketFactory) {
  
  	return socketFactory();
	
	});
