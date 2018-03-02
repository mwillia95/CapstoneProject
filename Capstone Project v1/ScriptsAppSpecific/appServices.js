﻿angular.module("app").factory("AppServices", [
    '$http', function ($http) {
        return {
            //ListController functions
            getList: function (listName) {
                return $http.get("api/PublicEmergencyNotificationSystem/lists/" + listName);
            },
            //ContactController functions
            getContactById: function (id) {
                return $http.get("api/PublicEmergencyNotificationSystem/contacts/getContactById?id=" + id);
            },
            addNewContact: function (contact) {
                return $http.post("api/PublicEmergencyNotificationSystem/contacts/addContact", contact);
            },
            getContacts: function (search) {
                return $http.get("api/PublicEmergencyNotificationSystem/contacts/getContacts/" + search);
            },
            getContactsAll: function () {
                return $http.get("api/PublicEmergencyNotificationSystem/contacts/getContactsAll");
            },
            updateContact: function (contact) {
                return $http.post("api/PublicEmergencyNotificationSystem/contacts/updateContact", contact);
            },
            removeContact: function (contact) {
                return $http.post("api/PublicEmergencyNotificationSystem/contacts/removeContact", contact);
            },
            register: function (account) {
                return $http.post("api/PublicEmergencyNotificationSystem/accounts/register", account);
            },
            login: function (account) {
                return $http.post("api/PublicEmergencyNotificationSystem/accounts/login", account);
            },
            logout: function () {
                return $http.post("api/PublicEmergencyNotificationSystem/accounts/logout");
            },
            isAuthorized: function () {
                return $http.get("api/PublicEmergencyNotificationSystem/accounts/isAuthorized");
            }
        };
    }]);