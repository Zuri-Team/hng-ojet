    /**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your login ViewModel code goes here
 */
define(['knockout', 'ojs/ojbootstrap', 'ojs/ojvalidation-base','ojs/ojknockout', 'ojs/ojcomposite',
'ojs/ojbutton','ojs/ojavatar','ojs/ojvalidation','ojs/ojlabel'],
    function (ko, Bootstrap, ojvalbase) {

        function OverviewModel() {
            var self = this;

            self.firstName = '';
            self.lastName = '';
            self.initials = ojvalbase.IntlConverterUtils.getInitials(self.firstName,self.lastName);
            self.avatarSize = ko.observable("xxl");
            self.sizeOptions = ko.observableArray(['xxs', 'xs','sm','md','lg','xl','xxl']);
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
        return new OverviewModel();
    }
);
