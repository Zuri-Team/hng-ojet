    /**
     * @license
     * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     */
    /*
     * Your login ViewModel code goes here
     */
    define([
            'knockout',
            './api',
            'ojs/ojrouter',
            'ojs/ojresponsiveutils',
            'ojs/ojresponsiveknockoututils',
            'ojs/ojknockout',
            'ojs/ojinputtext',
            'ojs/ojbutton',
            'ojs/ojformlayout'
        ],
        function(ko, api, ResponsiveUtils, ResponsiveKnockoutUtils) {

            function PasswordResetModel() {
                var self = this;
                var router = oj.Router.rootInstance;

                self.email = ko.observable("");
                self.pass = ko.observable("");
                self.rpass = ko.observable("");

                self.reset = function() {

                    let url = new URL(window.location.href)
                    let token = new URLSearchParams(url.search).get('token')

                    let email = self.email();
                    let password = self.pass();
                    let confirm_password = self.rpass();

                    console.log(email, password, confirm_password);

                    const form = {
                        email,
                        password,
                        confirm_password,
                        token
                    }


                    $.ajax({
                        url: `${api}/api/password/reset`,
                        headers: {
                            Accept: 'application/json',
                        },
                        data: form,
                        contentType: 'application/x-www-form-urlencoded',
                        method: 'POST',
                        type: 'POST',
                        success: function(data) {
                            router.go("login");
                        },
                        error: function(error) {
                            console.log(error)
                        }
                    });


                }

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
            return new PasswordResetModel();
        }
    );