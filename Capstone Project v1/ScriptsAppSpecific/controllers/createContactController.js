angular.module("app").controller("createContactController", ['$scope', 'AppServices', '$location', '$rootScope', '$timeout', function ($scope, appServices, $location, $rootScope, $timeout) {
    var self = this;
    $timeout($rootScope.authorize, 0).then(function () {
        if (!$rootScope.isAuthorized) {
            console.log("not authorized");
            $location.path("/login");
        }
    });
    self.contact = {};
    self.error = "";
    var stateList = function () {
        appServices.getList("states").then(function (response) {
            self.states = response.data;
        });
    };

    stateList();
    var phoneValidation = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

    self.validate = function () {
        if (!self.contact.firstName) {
            self.error = "Please enter a first name";
            return false;
        }
        if (!self.contact.lastName) {
            self.error = "Please enter a last name";
            return false;
        }
        var type = self.contact.serviceType;
        if (!type) {
            self.error = "Please select a service type";
            return false;
        }
        if (type === "email" || type === "both") {
            var email = self.contact.email;
            if (!email || !email.trim()) {
                self.error = "Please enter a valid email address";
                return false;
            }
        }
        if (type === "mobile" || type === "both") {
            if (!phoneValidation.test(self.contact.phone)) {
                self.error = "Please enter a valid phone number";
                return false;
            }
        }
        if (!self.contact.streetAddress) {
            self.error = "Please enter a street address";
            return false;
        }
        if (!self.contact.city) {
            self.error = "Please enter a city";
            return false;
        }
        if (!self.contact.state) {
            self.error = "Please select a state";
            return false;
        }
        if (!self.contact.zipCode) {
            self.error = "Please enter a zip code";
            return false;
        }
        self.error = "";
        return true;
    };
    //end self.validate

    self.submit = function (valid) {
        if (!self.validate()) {
            return;
        }
        var phonestrip = /[()+-]/g;      

        var geoAddress = self.contact.streetAddress.replace(' ', '+') + ',+' + self.contact.city.replace(' ', '+') + ',+' + self.contact.state;
        appServices.getGeocode(geoAddress).then(function (response) {
            if (response.data.status === "ZERO_RESULTS")
            {
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
                swal("SUCCESS", "Contact was successfully created.", "success");
            }).catch(function (response) {
                swal("ERROR", "Something went wrong when creating a contact", "error");
                return;
                });
        });

    };

    self.clear = function () {
        self.contact = {};
    };

    //code for testing updates
    //var Contact = {
    //    ContactId: 1,
    //    FirstName: 'Mitchell',
    //    LastName: 'Williams',
    //    Email: 'mwilliams10@augusta.edu',
    //    PhoneNumber: '7067269834',
    //    AddressId: 1,
    //    Address: {
    //        Street: '904 Windmill Parkway',
    //        City: 'Evans',
    //        State: 'GA',
    //        Zip: '30809'
    //    }
    //}
    //appServices.updateContact(Contact).then(function (response) {
    //    console.log(response);
    //});
}]);