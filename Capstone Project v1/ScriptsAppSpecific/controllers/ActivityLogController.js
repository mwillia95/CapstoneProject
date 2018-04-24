angular.module("app").controller("activityLogController", ['$scope', 'AppServices', '$rootScope', '$timeout', 'uiGridConstants', function ($scope, appServices, $rootScope, $timeout, uiGridConstants) {
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
                field: "ModuleName",
                displayName: "Module",
                enableColumnMenu: false,
                width: "33%",
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
            {
                field: "LogTime",
                displayName: "Log Time",
                enableColumnMenu: false,
                width: "33%",
                cellClass: 'grid-align',
                headerCellClass: 'grid-align',
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            }        
        ]
    };
    //end self.gridOptions();

    self.refreshData = function () {
        appServices.getActivities().then(function (response) {      
            self.gridOptions.data = response.data;
            self.gridOptions.paginationCurrentPage = 1;
            self.load = false;
        }).catch(function (response) {
            swal("ERROR", response.data.ExceptionMessage, "error");
            return;
        });
    };
    //end self.refreshData()


    self.refreshData();
}]);