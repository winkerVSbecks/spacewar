'use strict';

// Declare app level module which depends on filters, and services
angular.module('spacewar', [

  'ngResource',
  'ngRoute',
  'ngAnimate',
  
  'spacewar.controllers',
  'spacewar.filters',
  'spacewar.services',
  'spacewar.directives',
  
  'btford.socket-io'
]).

config(function ($routeProvider, $locationProvider) {

  $routeProvider.

    when('/', {
      templateUrl: 'views/main.html',
      controller: 'PickTeamsCtrl'
    }).

    when('/battle', {
      templateUrl: 'views/battle.html',
      controller: 'BattleCtrl'
    }).

    when('/battle/:name', {
      templateUrl: 'views/battle.html',
      controller: 'BattleCtrl'
    }).

    otherwise({
      redirectTo: '/'
    });

});
