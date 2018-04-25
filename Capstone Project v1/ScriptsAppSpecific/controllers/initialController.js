angular.module("app").controller("initialController", ['$scope', 'AppServices', '$rootScope', '$location', '$timeout', function ($scope, appServices, $rootScope, $location, $timeout, $http) {
    var self = this;
    $scope.test = "This is coming from initialController";
    //initialize global variables
    $rootScope.id = -1;
    $rootScope.search = "";
    $rootScope.isAuthorized = false;
    $rootScope.fullName = "";
    $rootScope.authorize = function () {
        appServices.isAuthorized().then(function (response) {
            
            $rootScope.isAuthorized = response.data[0];
            $rootScope.fullName = response.data[1];
        });
    };
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
        swal({
            title: "WARNING",
            text: "Are you sure you wish to logout?",
            type: "warning",
            showCancelButton: true
        },
        function () {
            appServices.logout().then(function () {
                $rootScope.fullName = "";          
                swal("SUCCESS", "You have successfully logged out!", "success");
                $location.path("/login");
                $rootScope.isAuthorized = false;

            });

        });
    };

}]);