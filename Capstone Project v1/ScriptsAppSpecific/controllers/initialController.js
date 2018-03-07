angular.module("app").controller("initialController", ['$scope', 'AppServices', '$rootScope', '$location', function ($scope, appServices, $rootScope, $location, $http) {
    var self = this;
    $scope.test = "This is coming from initialController";
    //initialize global variables
    $rootScope.id = -1;
    $rootScope.search = "";
    $rootScope.isAuthorized = false;
    $rootScope.authorize = function () {
        appServices.isAuthorized().then(function (response) {
            //console.log('authorization check occurred');
            //console.log(response.data);
            $rootScope.isAuthorized = response.data;
        });
    };
}]);