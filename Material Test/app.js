(function () {
    'use strict';

    var app = angular.module('myApp', ['ngMaterial']);

    app.controller('AppCtrl', AppCtrl);
    function AppCtrl ( $scope ) {
        $scope.data = {
            selectedIndex: 0
        };
        $scope.next = function() {
            $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
        };
        $scope.previous = function() {
            $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
        };
    }
})();