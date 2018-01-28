angular.module("app").controller("createContactController", ['$scope', 'AppServices', '$location', function ($scope, appServices, $http, $location) {
    var self = this;
   
    self.contact = {};

    var stateList = function () {
        appServices.getList("states").then(function (response) {
            self.states = response.data;
        })
    };

    stateList();
    var phoneValidation = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/

    self.submit = function (valid) {
        if (!valid)
            return;

        var type = self.contact.serviceType;
        if (!type)
        {
            console.log({ Service: type });
            return;
        }
        if (type == "email" || type == "both")
        {
            var email = self.contact.email;
            if (!email || !email.trim())
            {
                console.log(self.contact.email);
                return;
            }
        }
        if (type == "phone" || type == "both")
        {
            if (!phoneValidation.text(self.contact.phone)) {
                console.log(self.contact.phone);
                return;
            }
        }
        if (!self.contact.state)
        {
            console.log({ NoStateSelected });
        }
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
        console.log(contact);
        appServices.addNewContact(contact).then(function (response) {
            console.log(response);
            self.contact = {};
        });
    };

    self.clear = function ()
    {
        self.contact = {};
    }
}]);