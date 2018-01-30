angular.module("app").controller("updateContactController", ['$scope', 'AppServices', '$location', '$routeParams', function ($scope, appServices, $location, $routeParams) {
    var self = this;
    self.contact = {};

    var id = $routeParams.param1;
    var searchString = $routeParams.param2;    //searchstring to send back to search controller and renter into search bar to show previous screen before pressing edit?
    console.log(searchString);
   
    var stateList = function () {
        appServices.getList("states").then(function (response) {
            self.states = response.data;
        });
    };

    self.getForm = function () {
        appServices.getContactById(id).then(function (response) {
            self.contact = response.data[0];
        });
        var service = document.getElementsByClassName("serviceUpdate");      
        
        for (var i = 0; i < service.length; i++)
        {
            if(self.contact.ServiceType === service[i])
            {
                service[i].selected = true;
            }
        };
    };

    var phoneValidation = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

    self.validate = function () {
        if (!self.contact.FirstName) {
            self.error = "Please enter a first name";
            return false;
        }
        if (!self.contact.LastName) {
            self.error = "Please enter a last name";
            return false;
        }
        var type = self.contact.ServiceType;
        if (!type) {
            self.error = "Please select a service type";
            return false;
        }
        if (type == "email" || type == "both") {
            var email = self.contact.Email;
            if (!email || !email.trim()) {
                self.error = "Please enter a valid email address";
                return false;
            }
        }
        if (type == "mobile" || type == "both") {
            if (!phoneValidation.test(self.contact.PhoneNumber)) {
                self.error = "Please enter a valid phone number";
                return false;
            }
        }
        if (!self.contact.Address.Street) {
            self.error = "Please enter a street address";
            return false;
        }
        if (!self.contact.Address.City) {
            self.error = "Please enter a city";
            return false;
        }
        if (!self.contact.Address.State) {
            self.error = "Please select a state";
            return false;
        }
        if (!self.contact.Address.Zip) {
            self.error = "Please enter a zip code";
            return false;
        }
        self.error = "";
        return true;
    }
    //end self.validate

    self.submit = function (valid) {
        //if (!valid)
        //   return;
        if (!self.validate()) {
            return;
        }
        var phonestrip = /[()+-]/g;

        var contact =
            {
                FirstName: self.contact.FirstName,
                LastName: self.contact.LastName,
                PhoneNumber: self.contact.PhoneNumber.replace(phonestrip, ''),
                Email: self.contact.Email,
                ServiceType: self.contact.ServiceType,
                ContactId: self.contact.ContactId,
                Address:
                {
                    Street: self.contact.Address.Street,
                    State: self.contact.Address.State,
                    City: self.contact.Address.City,
                    Zip: self.contact.Address.Zip
                }

            };
        appServices.updateContact(contact).then(function (response) {
            console.log("Updated information")
            console.log(response.data);
            self.contact = {}; ///test for update info
        });
    };

    self.clear = function () {    // needs to redirect back to table with searchString as search input
        self.contact = {};
    };

    stateList();
    self.getForm();
}]);