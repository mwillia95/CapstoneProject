angular.module("app").controller("loginController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', function ($scope, appServices, $location, $rootScope, $timeout) {
    var self = this;

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

    $scope.error = false;
    $scope.account = {};
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
