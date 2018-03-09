angular.module("app").controller("updateContactController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', function ($scope, appServices, $location, $rootScope, $timeout) {
    var self = this;
    $timeout($rootScope.authorize, 0).then(function () {
        if (!$rootScope.isAuthorized) {
            console.log("not authorized");
            $location.path("/login");
        }
    });
    self.contact = {};
    self.oldAdd = {};
    var id = $rootScope.id;
    console.log($rootScope);
    console.log($rootScope.id);

    var stateList = function () {
        appServices.getList("states").then(function (response) {
            self.states = response.data;
        });
    };

    self.getForm = function () {
        appServices.getContactById(id).then(function (response) {
            self.contact = response.data;
            self.oldAdd = response.data.Address;
        });
        var service = document.getElementsByClassName("serviceUpdate");

        for (var i = 0; i < service.length; i++) {
            if (self.contact.ServiceType === service[i]) {
                service[i].selected = true;
            }
        }
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
        if (type === "email" || type === "both") {
            var email = self.contact.Email;
            if (!email || !email.trim()) {
                self.error = "Please enter a valid email address";
                return false;
            }
        }
        if (type === "mobile" || type === "both") {
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
    };
    //end self.validate

    self.submit = function (valid) {
        //if (!valid)
        //   return;
        if (!self.validate()) {
            return;
        }
        var phonestrip = /[()+-]/g;
        var newAdd = self.contact.Address;
        if (newAdd.Street != oldAdd.Street || newAdd.State != oldAdd.Street || newAdd.City != oldAdd.City || newAdd.Zip != oldCity.Zip) {
            var geoAddress = self.contact.streetAddress.replace(' ', '+') + ',+' + self.contact.city.replace(' ', '+') + ',+' + self.contact.state;
            appServices.getGeocode(geoAddress).then(function (response) {
                if (response.status === "ZERO_RESULTS") {
                    self.error = "Please enter a valid addresss";
                    return;
                }
                console.log(response);
                var contact = {
                    FirstName: self.contact.firstName,
                    LastName: self.contact.lastName,
                    PhoneNumber: self.contact.phone.replace(phonestrip, ''),
                    Email: self.contact.email,
                    ServiceType: self.contact.serviceType,
                    Address:
                    {
                        Street: self.contact.streetAddress,
                        State: self.contact.state,
                        City: self.contact.city,
                        Zip: self.contact.zipCode,
                        Latitude: response.data.results[0].geometry.location.lat,
                        Longitude: response.data.results[0].geometry.location.lng
                    }

                };
                console.log(contact);
                appServices.addNewContact(contact).then(function (response) {
                    console.log(response);
                    self.contact = {};
                });
            });
        }
        else {
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
                        Zip: self.contact.Address.Zip,
                        Latitude: self.contact.Address.Latitude,
                        Longitude: self.contact.Address.Longitude
                    }

                };
            appServices.updateContact(contact).then(function (response) {
                console.log("Updated information");
                console.log(response.data);
                self.contact = {}; ///test for update info
                $location.path('/searchContact');
            });
        }
    };

    self.clear = function () {    // needs to redirect back to table with searchString as search input
        self.contact = {};
        $location.path('/searchContact');
    };

    stateList();
    self.getForm();
}]);