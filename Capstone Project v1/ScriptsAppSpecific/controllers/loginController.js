angular.module("app").controller("loginController", ['$scope', 'AppServices', '$location', '$rootScope', function ($scope, appServices, $location, $rootScope) {
    /*self.register = function () {
        console.log("at least we got in here!");
        account.Email = "mwilliams10@augusta.edu";
        account.Password = "password";
        appServices.register(account).then(function (response) {
            console.log(response);
        })
    };*/
    $rootScope.authorize();
    var result = $rootScope.isAuthorized;
    //console.log(result);
    if ($rootScope.isAuthorized) {
        //$location.path("/");
    }
    $scope.error = false
    $scope.account = {}
    $scope.register = function () {
        console.log("starting test");
        var account = {}
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
            if (response.data == "Success") {
                $location.path("/");
            }
            else {
                $scope.error = true;
            }
        });
    };
}]);
