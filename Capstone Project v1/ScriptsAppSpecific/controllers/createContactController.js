angular.module("app").controller("createContactController", ['$scope', 'AppServices', '$location', function ($scope, appServices, $http, $location) {
    var self = this;
   
    self.contact = {};
    self.error = "";
    var stateList = function () {
        appServices.getList("states").then(function (response) {
            self.states = response.data;
        })
    };

    stateList();
    var phoneValidation = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    
    self.validate = function()
    {
        if (!self.contact.firstName)
        {
            self.error = "Please enter a first name";
            return false;
        }
        if (!self.contact.lastName)
        {
            self.error = "Please enter a last name";
            return false;
        }
        var type = self.contact.serviceType;
        if(!type)
        {
            self.error = "Please select a service type";
            return false;
        }
        if (type == "email" || type == "both") {
            var email = self.contact.email;
            if (!email || !email.trim()) {
                self.error = "Please enter a valid email address";
                return false;
            }
        }
        if (type == "mobile" || type == "both") {
            if (!phoneValidation.test(self.contact.phone)) {
                self.error = "Please enter a valid phone number";
                return false;
            }
        }
        if(!self.contact.streetAddress)
        {
            self.error = "Please enter a street address";
            return false;
        }
        if(!self.contact.city)
        {
            self.error = "Please enter a city";
            return false;
        }
        if(!self.contact.state)
        {
            self.error = "Please select a state";
            return false;
        }
        if(!self.contact.zipCode)
        {
            self.error = "Please enter a zip code";
            return false;
        }
        self.error = "";
        return true;
    }


    self.submit = function (valid) {
        //if (!valid)
         //   return;
        if (!self.validate())
        {
            return;
        }

        var contact =
            {
                FirstName: self.contact.firstName,
                LastName: self.contact.lastName,
                PhoneNumber: self.contact.phone,
                Email: self.contact.email,
                ServiceType: self.contact.serviceType,
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