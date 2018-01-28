angular.module("app").controller("createContactController", ['$scope', 'AppServices','$location', function ($scope, appServices, $location) {
    var self = this;
   
    self.contact = {};

    var stateList = function () {
        appServices.getList("states").then(function (response) {
            self.states = response.data;
        })
    };

    stateList();
 
    self.submit = function (valid) {
        if (!valid)
            return;
        var contact =
            {
                FirstName: self.contact.firstName,
                LastName: self.contact.lastName,
                PhoneNumber: self.contact.phone,
                Email: self.contact.email,
                Address: 
                {
                    Street: self.contact.streetAddress,
                    State: self.contact.state,
                    City: self.contact.city,
                    Zip: self.contact.zipCode
                }
                
            };
        appServices.addNewContact(contact).then(function (response) {
            console.log(response);
            self.contact = {};
        });
    };
}]);