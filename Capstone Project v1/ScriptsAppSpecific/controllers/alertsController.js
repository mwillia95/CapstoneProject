angular.module("app").controller("alertsController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', 'uiGridConstants', function ($scope, appServices, $location, $rootScope, $timeout, uiGridConstants) {
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
                field: "Status",
                displayName: "Status",
                enableColumnMenu: false,
                width: "17%",
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
                field: "Start_Time",
                displayName: "Start Time",
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
            {
                field: " ",
                displayName: "",
                width: "5%",
                enableColumnMenu: false,
                cellTemplate: "<div class=\"text-center\" style=\"padding-top:3px; margin-left:3px; padding-bottom: 2px;\"><button type=\"button\" class=\"btn btn-sm btn-primary\" ng-click=\"grid.appScope.self.updateAlert(row.entity)\"><span class=\"fa fa-search\"></span></button></div>",
                enableSorting: false,
                enableFiltering: false
            }          
        ]
    };
    //end self.gridOptions();

    self.refreshData = function () {
        appServices.getAlerts().then(function (response) {
            console.log(response);
            self.gridOptions.data = response.data;          
            self.gridOptions.paginationCurrentPage = 1;
            self.load = false;
        }).catch(function (response) {
            swal("ERROR", response.data.ExceptionMessage, "error");
            return;
        });                  
    };
    //end self.refreshData()

    self.updateAlert = function (request) {
        $rootScope.id = request.AlertId;
        $location.path('/updateAlert');
    };

    self.refreshData();
}]);