angular.module("app", ["ngRoute", "ngAnimate", "ui.bootstrap", "ui.grid", "ui.grid.pagination", "ui.grid.selection", "ui.grid.resizeColumns", "ui.grid.exporter", "ui.grid.moveColumns"]).config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/home",
        {        
            title: "E.N.S.",
            templateUrl: "ViewsClient/home.html",
            controller: "homeController",
            controllerAs: "self"
        })
        .when("/",
        {
            title: "Login",
            templateUrl: "ViewsClient/login.html",
            controller: "loginController",
            controllerAs: "self"
        })
        .when("/createContact",
        {
            title: "New Contact",
            templateUrl: "ViewsClient/createContact.html",
            controller: "createContactController",
            controllerAs: "self"
        })
        .when("/searchContact",
        {
            title: "Search Contacts",
            templateUrl: "ViewsClient/searchContact.html",
            controller: "searchContactController",
            controllerAs: "self"
        })
        .when("/searchContact/:param1",
        {
            title: "Search Contacts",
            templateUrl: "ViewsClient/searchContact.html",
            controller: "searchContactController",
            controllerAs: "self"
        })
        .when("/updateContact",
        {
            title: "Update Contact",
            templateUrl: "ViewsClient/updateContact.html",
            controller: "updateContactController",
            controllerAs: "self"
        })
        .when("/activeAlerts",
        {
            title: "Active Alerts",
            templateUrl: "ViewsClient/alerts.html",
            controller: "alertsController",
            controllerAs: "self"
        })
        .when("/updateAlert", {
            title: "Update Alert",
            templateUrl: "ViewsClient/updateAlert.html",
            controller: "updateAlertController",
            controllerAs: "self"
        })
        .when("/activityLog", {
            title: "Activity Log",
            templateUrl: "ViewsClient/activityLog.html",
            controller: "activityLogController",
            controllerAs: "self"
        })
        .when("/resolvedAlerts", {
            title: "Resolved Alerts",
            templateUrl: "ViewsClient/resolvedAlerts.html",
            controller: "resolvedAlertsController",
            controllerAs: "self"
        })
        .when("/resolvedAlertReview/:Id", {
            title: "Resolved Alert Review",
            templateUrl: "ViewsClient/resolvedAlertReview.html",
            controller: "resolvedAlertReviewController",
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
}]).run(["$rootScope", "$location", function ($rootScope, $location) {
    $rootScope.$on("$routeChangeStart",
        function (event, next, previous, current) {
            if (!$location.$$absUrl && location.pathname === "/") {
                $location.path("/");
            } else if (next.$$route !== null) {
                if (typeof next.$$route.title === "function") {
                    $rootScope.title = next.$$route.title(next.params);
                } else {
                    $rootScope.title = next.$$route.title;
                }
            }
        });
}]);


