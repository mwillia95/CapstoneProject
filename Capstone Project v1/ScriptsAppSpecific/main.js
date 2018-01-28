angular.module("app", ["ngRoute", "ngAnimate", "ui.bootstrap"]).config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/",
        {
            templateUrl: "ViewsClient/home.html",
            controller: "homeController",
            controllerAs: "self"
        })
        .when("/createContact",
        {
            templateUrl: "ViewsClient/createContact.html",
            controller: "createContactController",
            controllerAs: "self"
        })
        .when("/searchContact",
        {
            templateUrl: "ViewsClient/searchContact.html",
            controller: "searchContactController",
            controllerAs: "self",
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