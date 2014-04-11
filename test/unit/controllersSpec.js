'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('myApp.controllers'));


  describe('NavCtrl', function() {
    var $scope, $location, $rootScope, createController;

    beforeEach(inject(function($injector) {
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        var $controller = $injector.get('$controller');

        createController = function() {
            return $controller('NavCtrl', {
                '$scope': $scope
            });
        };
    }));

    it('should have a method to check if the path is active', function() {
        var controller = createController();
        $location.path('/about');
        expect($location.path()).toBe('/about');
        expect($scope.isActive('/about')).toBe(true);
        expect($scope.isActive('/contact')).toBe(false);
    });
});
});
