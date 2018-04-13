angular.module("app").controller("loginController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', function ($scope, appServices, $location, $rootScope, $timeout) {
    var self = this;
    /*appServices.logout().then(function (response) {
        $timeout($rootScope.authorize, 0).then(function () {
            $rootScope.id = -1;
            $rootScope.search = "";
            console.log($rootScope.isAuthorized);
        });
    });*/
    self.loading = false;
    $timeout($rootScope.authorize, 0).then(function () {
        $timeout(function () {
            if ($rootScope.isAuthorized) {
                $location.path("/");
            }
        }, 100);
    });
    $scope.error = false;
    $scope.account = {};
    //Not sure if we need this anymore
    $scope.register = function () {
        var account = {};
        account.Email = "director@company.com";
        account.Password = "Password1!";
        appServices.register(account).then(function (response) {
            console.log(response);
        });
        console.log("test complete");
    };
    var getName = function () {
        appServices.getName().then(function (response) {
            $rootScope.fullName = response.data;
        });
    };

    $scope.submit = function () {
        self.loading = true;
        appServices.login($scope.account).then(function (response) {
            if (response.data === "Success") {
                $rootScope.isAuthorized = true;
                getName();
                $location.path("/");
            }
            else {
                $scope.error = true;
                self.loading = false;
            }
        });
    };
}]);
