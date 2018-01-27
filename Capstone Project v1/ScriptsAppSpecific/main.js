angular.module("app", ["ngRoute", "ngAnimate", "ui.bootstrap"]).config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/",
        {
            templateUrl: "ViewsClient/home.html",
            controller: "homeController",
            controllerAs: "self"
        })
        .otherwise(
        {
            redirectTo: "/"
    });

    $locationProvider.html5Mode({
        enabled: true,
        requiredBase: true
    });

}]);