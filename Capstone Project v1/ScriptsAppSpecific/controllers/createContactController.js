angular.module("app").controller("createContactController", ['$scope', 'AppServices','$location', function ($scope, appServices, $http, $location) {
    var self = this;
   
    self.contact = {};

    var stateList = function () {
        appServices.getList("states").then(function (response) {
            self.states = response.data;
        })
    };

    stateList();
 
}]);