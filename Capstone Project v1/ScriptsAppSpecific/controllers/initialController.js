angular.module("app").controller("initialController", ['$scope', 'AppServices', '$rootScope', function ($scope, appServices, $rootScope, $http) {
    var self = this;
    $scope.test = "This is coming from initialController";
    //initialize global variables
    $rootScope.id = -1
    $rootScope.search = ""
}]);