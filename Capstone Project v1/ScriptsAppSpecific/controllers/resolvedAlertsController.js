angular.module("app").controller("resolvedAlertsController", ['$scope', 'AppServices', '$rootScope', '$timeout', 'uiGridConstants', '$location', function ($scope, appServices, $rootScope, $timeout, uiGridConstants, $location) {
    var self = this;
    self.load = true;
    $timeout($rootScope.authorize, 0).then(function () {
        if (!$rootScope.isAuthorized) {
            console.log("not authorized");
            $location.path("/login");
        }
    });

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
                field: "Title",
                displayName: "Title",
                enableColumnMenu: false,
                width: "35%",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "Start_Time",
                displayName: "Start Time",
                enableColumnMenu: false,
                width: "30%",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "End_Time",
                displayName: "End Time",
                enableColumnMenu: false,
                width: "30%",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },       
            {
                field: " ",
                displayName: "",
                width: "5%",
                enableColumnMenu: false,
                cellTemplate: "<div class=\"text-center\" style=\"padding-top:3px; margin-left:3px; padding-bottom: 2px;\"><button type=\"button\" class=\"btn btn-sm btn-primary\" ng-click=\"grid.appScope.self.showAlert(row.entity)\"><span class=\"fa fa-search\"></span></button></div>",
                enableSorting: false,
                enableFiltering: false
            }
        ]
    };
    //end self.gridOptions();

    self.refreshData = function () {
        appServices.getResolvedAlerts().then(function (response) {
            self.gridOptions.data = response.data;
            self.gridOptions.paginationCurrentPage = 1;
            self.load = false;
        }).catch(function (response) {
            swal("ERROR", response.data.ExceptionMessage, "error");
            return;
        });
    };
    //end self.refreshData()

    self.showAlert = function (item) {
        $location.path("/resolvedAlertReview/" + item.AlertId);
    };


    self.refreshData();
}]);