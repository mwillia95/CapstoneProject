angular.module("app").controller("updateAlertController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', 'uiGridConstants', function ($scope, appServices, $location, $rootScope, $timeout, uiGridConstants) {
    var self = this;
    self.form = {};
    self.formData = {};
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
    

    //self.getForm = function (id) {
    //    appServices.getAlertById(self.id).then(function (response) {
    //        self.form = response.data;
    //        console.log(self.form);
    //        if (self.form[1].ImagePath === "Shrek.jpeg") {
    //            self.image = "Content/images/" + self.form[1].ImagePath;
    //        }
    //        else {
    //            self.image = "StaticMaps/" + self.form[1].ImagePath;
    //        }
    //    }).catch(function (response) {
    //        swal("ERROR", "Something went wrong", "error");
    //    });
    //};

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
                width: "32%",
                cellTemplate: "<span class=\"grid-label\" ng-class=\"{'grid-label-danger': row.entity.Status == 'ONGOING', 'grid-label-warning': row.entity.Status == 'UPDATED', 'grid-label-success': row.entity.Status == 'COMPLETE', 'grid-label-pending': row.entity.Status == 'PENDING'}\">{{ COL_FIELD }}</span>",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            //{
            //    field: "Title",
            //    displayName: "Title",
            //    enableColumnMenu: false,
            //    width: "25%",
            //    cellClass: 'grid-align',
            //    headerCellClass: 'grid-align',
            //    filter: {
            //        condition: uiGridConstants.filter.CONTAINS
            //    }
            //},
            {
                field: "Update_Time",
                displayName: "Update Time",
                enableColumnMenu: false,
                width: "35%",
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
                width: "35%",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },           
        ]
    };

    self.refreshData = function () {  
        appServices.getAlertById(self.id).then(function (response) {
            self.formData = response.data;
            console.log(self.formData);
            if (self.formData[0].Updates !== null) {
                self.form = {
                    Title: self.formData.length === 2 ? self.formData[0].Title : self.formData[0].Updates[self.formData[0].Updates.length - 1].Title.replace("[Update]", ""),
                    Description: self.formData.length === 2 ? self.formData[0].Description : self.formData[0].Updates[self.formData[0].Updates.length - 1].Description,
                    Start_Time: self.formData[1].Start_Time
                }
            }
            if (self.formData[1].ImagePath === "Shrek.jpeg") {
                self.image = "Content/images/" + self.formData[1].ImagePath;
            }
            else {
                self.image = "StaticMaps/" + self.formData[1].ImagePath;
            }
            if (self.formData.length > 2) {
                self.gridOptions.data = self.formData[2];
            }
        }).catch(function (response) {
            swal("ERROR", "Something went wrong", "error");
        });
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
   
    self.submitUpdate = function () {
        var Update =
            {
                Title: self.form.Title + " [Update]",
                Description: self.updateAlert.Description,
                OriginAlertRefId: self.id
            };
        appServices.updateAlert(Update).then(function (response) {
            console.log(response);
            swal("SUCCESS", "An update was created and sent successully!", "success");
            self.refreshData();
            self.updateAlert.Description = "";
        });
    };

    self.cancelUpdate = function () {
        $location.path("/activeAlerts");
    };

    self.refreshData();
    //self.getForm(self.id);  
}]);