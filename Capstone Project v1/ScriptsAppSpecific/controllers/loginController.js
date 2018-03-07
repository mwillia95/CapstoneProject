angular.module("app").controller("loginController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', function ($scope, appServices, $location, $rootScope, $timeout) {

    appServices.logout().then(function (response) {
        $timeout($rootScope.authorize, 0).then(function () {
            $rootScope.id = -1;
            $rootScope.search = "";
            console.log($rootScope.isAuthorized);
        });
    });
    $scope.error = false;
    $scope.account = {};
    $scope.register = function () {
        console.log("starting test");
        var account = {};
        account.Email = "director@company.com";
        account.Password = "Password1!";
        appServices.register(account).then(function (response) {
            console.log(response);
        });
        console.log("test complete");
    };


    $scope.submit = function () {
        appServices.login($scope.account).then(function (response) {
            console.log(response);
            if (response.data === "Success") {
                $rootScope.authorize();
                $location.path("/");
            }
            else {
                $scope.error = true;
            }
        });
    };
}]);
