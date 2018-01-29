angular.module("app").controller("searchContactController", ['$scope', 'AppServices', '$location', 'uiGridConstants', function ($scope, appServices,$location,uiGridConstants) {
    var self = this;
    
    self.search = "";

    self.gridOptions = {
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
                enableColumnMenu: true,
                width: "15%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "LastName",
                displayName: "Last Name",
                enableColumnMenu: true,
                width: "15%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "address",
                displayName: "Street Address",
                enableColumnMenu: true,
                width: "20%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "email",
                displayName: "Email",
                enableColumnMenu: true,
                width: "20%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "phone",
                displayName: "Phone Number",
                enableColumnMenu: true,
                width: "15%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            },
            {
                field: "zip",
                displayName: "ZipCode",
                enableColumnMenu: true,
                width: "15%",
                filter: {
                    condition: uiGridConstants.filter.CONTAINS
                }
            }]
    };

    self.getContacts = function () {
        appServices.getContacts().then(function (response) {
            self.contacts = response.data;
            console.log(self.contacts);
        });
    };

    self.getContacts();
}]);