angular.module("app").controller("updateAlertController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', 'uiGridConstants', function ($scope, appServices, $location, $rootScope, $timeout, uiGridConstants) {
    var self = this;
    self.form = {};
    self.image = "";
    self.updateAlert = {};
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
            if (self.form[1].ImagePath === "Shrek.jpeg") {
                self.image = "Content/images/" + self.form[1].ImagePath;
            }
            else {
                self.image = "StaticMaps/" + self.form[1].ImagePath;
            }
        }).catch(function (response) {
            swal("ERROR", "Something went wrong", "error");
        });
    };

    self.gridOptions = {
        rowHeight: 36,
        enableColumnResizing: false,
        enableGridMenu: true,
        exporterMenuAllData: false,
        exporterMenuVisibleData: false,
        enableFiltering: true,
        enablesorting: true,
        enablePaginationControls: true,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.Always,
        enableRowHeaderSelection: false,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
            {
                field: "Status",
                displayName: "Status",
                enableColumnMenu: false,
                width: "20%",
                cellTemplate: "<span class=\"grid-label\" ng-class=\"{'grid-label-danger': row.entity.Status == 'ONGOING', 'grid-label-warning': row.entity.Status == 'UPDATED', 'grid-label-success': row.entity.Status == 'COMPLETE', 'grid-label-pending': row.entity.Status == 'PENDING'}\">{{ COL_FIELD }}</span>",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "Title",
                displayName: "Title",
                enableColumnMenu: false,
                width: "25%",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "Update_Time",
                displayName: "Update Time",
                enableColumnMenu: false,
                width: "25%",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "Description",
                displayName: "Description",
                enableColumnMenu: false,
                width: "27%",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },           
        ]
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

    //self.testEmail = function () {
    //    appServices.getUpdatesByOriginId(1).then(function (response) {
    //        console.log(response.data);
    //        swal("Success", "Email Sent", "success");
    //    }).catch(function (response) {
    //        swal("Error", "Something went wrong", "error");
    //        });
    //}
   

    self.getForm(self.id);  
}]);