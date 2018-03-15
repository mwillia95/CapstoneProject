angular.module("app").controller("updateAlertController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', function ($scope, appServices, $location, $rootScope, $timeout) {
    var self = this;
    self.form = {};
    $timeout($rootScope.authorize, 0).then(function () {
        if (!$rootScope.isAuthorized) {
            console.log("not authorized");
            $location.path("/login");
        }
    });

    self.id = $rootScope.id;
    console.log(self.id);

    self.getForm = function (id) {
        appServices.getAlertById(self.id).then(function (response) {
            self.form = response.data;
            console.log(self.form);
        });//catch errors with sweetalert
    };


    //get alert infomation
    //get all alert updates
    //possibly display image of static map associated with alert.
    //display updates in a ui grid in ascending order by id
    //have original alert information and form for update info
    //on click of update button...table refreshes with new update added
    //also creates update object
    //change status of alert from ongoing to updated if first update
    //change status of alert from updated to complete if resolved.
    //on update or resolve....send notifications out to contacts
   

    self.getForm(self.id);  
}]);