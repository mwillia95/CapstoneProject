﻿angular.module("app").factory("AppServices", [
    '$http', function ($http) {
        return {
            //ListController functions
            getList: function (listName) {
                return $http.get("api/PublicEmergencyNotificationSystem/lists/" + listName);
            },
            //ContactController functions
            addNewContact: function (contact) {
                return $http.post("api/PublicEmergencyNotificationSystem/contacts/addContact", contact);
            },
            getContacts: function (search) {
                return $http.get("api/PublicEmergencyNotificationSystem/contacts/getContacts/" + search);
            },
            getContactsAll: function () {
                return $http.get("api/PublicEmergencyNotificationSystem/contacts/getContactsAll");
            }
        };
    }]);