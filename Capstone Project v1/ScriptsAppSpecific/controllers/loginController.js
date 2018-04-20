angular.module("app").controller("loginController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', function ($scope, appServices, $location, $rootScope, $timeout) {
    var self = this;
    /*appServices.logout().then(function (response) {
        $timeout($rootScope.authorize, 0).then(function () {
            $rootScope.id = -1;
            $rootScope.search = "";
            console.log($rootScope.isAuthorized);
        });
    });*/
    self.loading = true;
    appServices.isAuthorized().then(function (response) {

        $rootScope.isAuthorized = response.data[0];
        $rootScope.fullName = response.data[1];

        if (response.data[0] === true) {
            $location.path("/home");
        }
        else {
            self.loading = false;
        }


    });
    //$timeout($rootScope.authorize, 0).then(function () {
    //    $timeout(function () {
    //        appServices.isAuthorized().then(function (response) {

    //            $rootScope.isAuthorized = response.data[0];
    //            $rootScope.fullName = response.data[1];
    //        });
    //        if ($rootScope.isAuthorized) {
    //            $location.path("/home");
    //        }
    //    }, 2000);
    //});
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
                $location.path("/home");
            }
            else {
                $scope.error = true;
                self.loading = false;
            }
        });
    };
}]);
