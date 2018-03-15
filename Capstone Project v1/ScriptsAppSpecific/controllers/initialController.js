angular.module("app").controller("initialController", ['$scope', 'AppServices', '$rootScope', '$location', '$timeout', function ($scope, appServices, $rootScope, $location, $timeout, $http) {
    var self = this;
    $scope.test = "This is coming from initialController";
    //initialize global variables
    $rootScope.id = -1;
    $rootScope.search = "";
    $rootScope.isAuthorized = false;
    $rootScope.authorize = function () {
        appServices.isAuthorized().then(function (response) {
            $rootScope.isAuthorized = response.data;
        });
    };
    $rootScope.fullName = "";
    //use $timeout to help force authorization to check after the api call has finished
    $timeout($rootScope.authorize, 0).then(function () {
        //for some reason will execute before api has finished, 100ms delay to allow enough time
        $timeout(function () {
            if (!$rootScope.isAuthorized) {
                $location.path("/login");
            }
        }, 100);
    });

    $scope.verifyLogout = function () {
        if(confirm("Logout?"))
        {
            appServices.logout().then(function () {
                $rootScope.fullName = "";
                $location.path("/login");
                $rootScope.isAuthorized = false;
            });
        }
    };
    var v = {};
    v.Lat = 33.49;
    v.Lng = -82.07;
    v.Zoom = 8;
    v.Radius = 10;
    appServices.sendAlert(v).then(function(response)
    {
        console.log(response);
    });
}]);