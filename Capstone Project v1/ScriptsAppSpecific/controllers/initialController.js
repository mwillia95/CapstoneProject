angular.module("app").controller("initialController", ['$scope', 'AppServices', function ($scope, appServices, $http) {
    var self = this;
    $scope.test = "This is coming from initialController";

}]);