angular.module("app").controller("searchContactController", ['$scope', 'AppServices', '$location', 'uiGridConstants', function ($scope, appServices,$location,uiGridConstants) {
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
                cellTemplate: "<div class=\"text-center\" style=\"padding-top:3px; margin-left:3px; padding-bottom: 2px;\"><button type=\"button\" class=\"btn btn-sm btn-warning\"><span class=\"fa fa-pencil\"></span></button></div>",
                enableSorting: false,
                enableFiltering: false
            },
            {
                field: " ",
                displayName: "Delete",
                width: "7%",
                enableColumnMenu: false,
                cellTemplate: "<div class=\"text-center\" style=\"padding-top:3px; margin-left:3px; padding-bottom: 2px;\"><button type=\"button\" class=\"btn btn-sm btn-danger\"><span class=\"fa fa-minus\"></span></button></div>",
                enableSorting: false,
                enableFiltering: false
            }
        ]
    };

    self.gridOptions.data = [];
    self.refreshData = function () {
        appServices.getContacts(self.search).then(function (response) {                //send search string through to query
            self.gridOptions.data = response.data;
            self.results = self.gridOptions.data;
            self.gridOptions.paginationCurrentPage = 1;
            console.log(self.gridOptions.data);
        //}).catch(function () {
        //    console.log("There was an Error Bro!");
        });
    };

    //self.getContacts = function () {
    //    appServices.getContacts().then(function (response) {
    //        self.gridOptions.data = response.data;
    //        console.log(self.gridOptions.data);
    //    });
    //};

    
}]);