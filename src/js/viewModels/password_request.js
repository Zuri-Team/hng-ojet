/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your login ViewModel code goes here
 */
define([
    "knockout",
    "./api",
    "jquery",
    "ojs/ojrouter",
    "ojs/ojresponsiveutils",
    "ojs/ojresponsiveknockoututils",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojformlayout",

], function(ko, api, ResponsiveUtils, ResponsiveKnockoutUtils, ) {
    function PasswordRequestModel() {
        var self = this;

        var router = oj.Router.rootInstance;
        self.user = ko.observable();

        function feedback(text, color) {

            return `<div class=" mt-2 alert alert-${color} h6 show fb_alert" role="alert">
                <small>${text}</small>
              </div>`;
        };


        var progressbar = function() {
            return `<div class="progress position-relative mb-3 ">
              <div class="position-absolute h-100 w-100 progress-bar progress-bar-striped progress-bar-animated bg-success">
                <span class="oj-text-sm font-weight-bold">Logging In</span>
              </div>
            </div>`;
        };

        self.reset = function() {

            let sect = $("#fbk");
            let email = self.user();

            if ((email) !== undefined) {
                if (!(email.match(/([@])/) && email.match(/([.])/))) {


                    sect.html(feedback("Please enter a valid email"));
                } else {
                    sect.html(progressbar());


                    $.post(`${api}/api/password/forgot`, {
                            email,
                        })
                        .done(({ status, message, }) => {

                            if (status == 'success') {
                                const success = 'success'

                                sect.html(feedback(message, success));
                            }
                        })
                        .fail((res) => {
                            const result = JSON.parse(res.responseText)
                            const danger = 'danger'
                            sect.html(feedback(result.message, danger));
                        });
                }
            } else {
                const danger = 'danger'
                sect.html(feedback("Enter a valid email", danger));
            }
        };

        self.login = function() {
            router.go("login");
        };

        self.connected = function() {};

        /**
         * Optional ViewModel method invoked after the View is disconnected from the DOM.
         */
        self.disconnected = function() {
            // Implement if needed
        };

        /**
         * Optional ViewModel method invoked after transition to the new View is complete.
         * That includes any possible animation between the old and the new View.
         */
        self.transitionCompleted = function() {
            // Implement if needed
        };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new PasswordRequestModel();
});