angular.module("app", ["ngRoute", "ngAnimate", "ui.bootstrap", "ui.grid", "ui.grid.pagination", "ui.grid.selection", "ui.grid.resizeColumns", "ui.grid.exporter", "ui.grid.moveColumns"]).config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
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
            controllerAs: "self"
        })
        .when("/searchContact/:param1",
        {
            templateUrl: "ViewsClient/searchContact.html",
            controller: "searchContactController",
            controllerAs: "self"
        })
        .when("/updateContact/:param1/:param2",
        {
            templateUrl: "ViewsClient/updateContact.html",
            controller: "updateContactController",
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


