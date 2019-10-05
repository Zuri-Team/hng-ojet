<<<<<<< HEAD
/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your login ViewModel code goes here
 */
define([
    'knockout', 'ojs/ojrouter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils',
    'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojformlayout'
],
    function (ko, ResponsiveUtils, ResponsiveKnockoutUtils) {

        function PasswordResetModel() {
            var self = this;
            var router = oj.Router.rootInstance;
            self.user = ko.observable();

            self.login = function () {
                router.go("login");
            }

            self.connected = function () {
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            self.disconnected = function () {
                // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            self.transitionCompleted = function () {
                // Implement if needed
            };
        }

        /*
         * Returns a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.  Return an instance of the ViewModel if
         * only one instance of the ViewModel is needed.
         */
        return new PasswordResetModel();
    }
);
=======
define(["knockout","ojs/ojrouter","ojs/ojresponsiveutils","ojs/ojresponsiveknockoututils","ojs/ojknockout","ojs/ojinputtext","ojs/ojbutton","ojs/ojformlayout"],function(o,n,t){return new function(){var n=oj.Router.rootInstance;this.user=o.observable(),this.login=function(){n.go("login")},this.connected=function(){},this.disconnected=function(){},this.transitionCompleted=function(){}}});
>>>>>>> 47c204b670044215f192ee69f48a3830b599a9a9
