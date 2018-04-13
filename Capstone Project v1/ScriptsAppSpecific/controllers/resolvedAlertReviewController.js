angular.module("app").controller("resolvedAlertReviewController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', 'uiGridConstants', '$routeParams', function ($scope, appServices, $location, $rootScope, $timeout, uiGridConstants, $routeParams) {
    var self = this;
    self.form = {};
    self.formData = {};
    self.image = "";
    $timeout($rootScope.authorize, 0).then(function () {
        if (!$rootScope.isAuthorized) {
            console.log("not authorized");
            $location.path("/login");
        }
    });

    self.id = $routeParams.Id;

    self.gridOptions = {
        rowHeight: 36,
        enableRowSelection: false,
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
                cellTemplate: "<span class=\"grid-label\" ng-class=\"{'grid-label-danger': row.entity.Status == 'ONGOING', 'grid-label-warning': row.entity.Status == 'UPDATED', 'grid-label-success': row.entity.Status == 'RESOLVED', 'grid-label-pending': row.entity.Status == 'PENDING'}\">{{ COL_FIELD }}</span>",
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
            if (self.formData[0].Updates !== null) {
                self.form = {
                    Title: self.formData.length === 2 ? self.formData[0].Title : self.formData[0].Updates[self.formData[0].Updates.length - 1].Title.replace("[Resolved]", ""),
                    Description: self.formData[1].Description,
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

    self.back = function () {
        $location.path("/resolvedAlerts");
    };

    self.refreshData();

}]);