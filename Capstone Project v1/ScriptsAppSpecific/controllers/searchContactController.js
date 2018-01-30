angular.module("app").controller("searchContactController", ['$scope', 'AppServices', '$location', 'uiGridConstants', '$routeParams', function ($scope, appServices, $location, uiGridConstants, $routeParams) {
    var self = this;
    self.search = "";
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
        if (!searchValidation.test(self.search)) {
            appServices.getContactsAll().then(function (response) {
                self.gridOptions.data = response.data;
                self.results = self.gridOptions.data;
                self.gridOptions.paginationCurrentPage = 1;
            });
        }
        else {
            appServices.getContacts(self.search).then(function (response) { //send search string through to query
                self.gridOptions.data = response.data;
                self.results = self.gridOptions.data;
                self.gridOptions.paginationCurrentPage = 1;
            });
        }
    };

    self.updateContact = function (request) {
        if (searchValidation.test(self.search)) {
            $location.path('/updateContact/' + request.ContactId + '/' + self.search);//.search({ param: 'request.ContactId' });
        }
        else {
            self.search = " ";
            $location.path('/updateContact/' + request.ContactId + '/' + self.search);//.search({ param: 'request.ContactId' });
        }
    };

    self.removeContact = function (request) {
        if (confirm("Are you sure you want to delete this contact?")) {
            console.log(request);
            appServices.removeContact(request).then(function (response) {
                console.log(response);
                self.refreshData();
            });
        }
    }
    //end self.refreshData()
    if ($routeParams.param1) {
        self.search = $routeParams.param1;
        self.refreshData();
    }
}]);