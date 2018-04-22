angular.module("app").controller("searchContactController", ['$scope', 'AppServices', '$location', 'uiGridConstants', '$rootScope', '$timeout', '$uibModal', function ($scope, appServices, $location, uiGridConstants, $rootScope, $timeout, $uibModal) {
    var self = this;
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
                field: "FirstName",
                displayName: "First Name",
                enableColumnMenu: false,
                width: "15%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "LastName",
                displayName: "Last Name",
                enableColumnMenu: false,
                width: "15%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "Address.Street",
                displayName: "Street Address",
                enableColumnMenu: false,
                width: "15%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "Email",
                displayName: "Email",
                enableColumnMenu: false,
                width: "20%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "PhoneNumber",
                displayName: "Phone Number",
                enableColumnMenu: false,
                width: "13%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "Address.Zip",
                displayName: "ZipCode",
                enableColumnMenu: false,
                width: "11%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: " ",
                displayName: "Edit",
                width: "5%",
                enableColumnMenu: false,
                cellTemplate: "<div class=\"text-center\" style=\"padding-top:3px; margin-left:3px; padding-bottom: 2px;\"><button type=\"button\" class=\"btn btn-sm btn-warning\" ng-click=\"grid.appScope.self.updateContact(row.entity)\"><span class=\"fa fa-pencil\"></span></button></div>",
                enableSorting: false,
                enableFiltering: false
            },
            {
                field: " ",
                displayName: "Delete",
                width: "7%",
                enableColumnMenu: false,
                cellTemplate: "<div class=\"text-center\" style=\"padding-top:3px; margin-left:3px; padding-bottom: 2px;\"><button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"grid.appScope.self.removeContact(row.entity)\"><span class=\"fa fa-minus\"></span></button></div>",
                enableSorting: false,
                enableFiltering: false
            }
        ]
    };
    //end self.gridOptions();

    self.gridOptions.data = [];
    searchValidation = /\S/;

    self.refreshData = function () {
        var modal = $uibModal.open({
            template: '<img src="Content/images/Loading.gif" />',
            windowClass: 'show loading-modal modal-dialog',
            backdropClass: 'show',
        });
        if (!searchValidation.test($rootScope.search)) {
            appServices.getContactsAll().then(function (response) {
                modal.close('');
                modal.closed.then(function (data) {
                    self.gridOptions.data = response.data;
                    self.results = self.gridOptions.data;
                    self.gridOptions.paginationCurrentPage = 1;
                });              
            });
        }
        else {
            appServices.getContacts($rootScope.search).then(function (response) { //send search string through to query
                modal.close('');
                modal.closed.then(function (data) {
                    self.gridOptions.data = response.data;
                    self.results = self.gridOptions.data;
                    self.gridOptions.paginationCurrentPage = 1;
                });         
            });
        }
    };
    //end self.refreshData()

    self.updateContact = function (request) {
        $rootScope.id = request.ContactId;
        $location.path('/updateContact'); //this should be using parameters instead of global variable
    };


    self.removeContact = function (request) {
        swal({
            title: "WARNING",
            text: "Are you sure you wish to delete this contact?",
            type: "warning",
            showCancelButton: true
        },
        function () {
            appServices.removeContact(request).then(function (response) {
                self.refreshData();
                swal("SUCCESS", "The contact was successfully removed", "success");
            });
        });
   
    };


    if ($rootScope.search) {
        self.refreshData();
    }

}]);