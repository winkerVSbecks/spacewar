'use strict';

/* Directives */

angular.module('spacewar.directives', []).
  
  directive('appVersion', function (version) {
    
    return function(scope, elm, attrs) {
    
      elm.text(version);
    
    };
  
  });
