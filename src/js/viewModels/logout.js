/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your login ViewModel code goes here
 */
define([
    'knockout', 'ojs/ojrouter',
],
    function (ko, Router, ResponsiveUtils, ResponsiveKnockoutUtils, Message) {

        function LogoutViewModel() {
            var self = this;
            var router = oj.Router.rootInstance;
            var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
            self.connected = function () {
                rootViewModel.isLoggedIn(false);
                localStorage.clear();
                router.go('login');
            };
        }

        /*
         * Returns a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.  Return an instance of the ViewModel if
         * only one instance of the ViewModel is needed.
         */
        return new LogoutViewModel();
    }
);
