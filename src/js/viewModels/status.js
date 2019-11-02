/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
    "knockout",
    "jquery",
    "./api",
    "ojs/ojarraydataprovider",
    "ojs/ojpagingdataproviderview",
    "ojs/ojknockout-keyset",
    "ojs/ojmodel",
    "ojs/ojlistview",
    "ojs/ojvalidation-base",
    "ojs/ojvalidation",
    "ojs/ojavatar",
    "ojs/ojcomposite",
    "ojs/ojdialog",
    "ojs/ojvalidation-datetime",
    "ojs/ojtimezonedata",
    "ojs/ojpagingcontrol",
    "ojs/ojbutton",
    "ojs/ojradioset",
    "ojs/ojlabel"
], function(ko, $, api, ArrayDataProvider, PagingDataProviderView) {
    function StatusViewModel() {
        var self = this;

        let RESTurl = `${api}/api`;

        self.username = ko.observable("");
        self.status = ko.observable(false);
        self.profile_img = ko.observable("");
        self.dataInternProvider = ko.observable();
        self.dataAdminProvider = ko.observable();
        self.avatarSize = ko.observable("md");

        self.handleSort = function(event, ui) {
            var criteria = event.detail.value;
            if (criteria) {
                //   this.executeSort(criteria.key, criteria.direction);
                console.log(criteria)
            } else {
                //   this.handleFilterChanged(event,ui); 
            }
        }.bind(self);


        (function fetchUsers() {
            $.ajax({
                url: `${RESTurl}/status`,
                method: "GET",
                success: ({ status, data }) => {
                    if (status == true) {
                        const intern = data.filter(data => data.role <= "intern");

                        const admin = data.filter(
                            data => data.role >= "superadmin" && data.role >= "admin"
                        );

                        self.dataInternProvider(
                            new PagingDataProviderView(
                                new ArrayDataProvider(intern, { keyAttributes: "id" })
                            )
                        );
                        self.dataAdminProvider(
                            new PagingDataProviderView(
                                new ArrayDataProvider(admin, { keyAttributes: "id" })
                            )
                        );
                    }


                }
            });
            setTimeout(fetchUsers, 15000);
        })();

        self.connected = function() {
            // Implement if needed
        };

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
    return new StatusViewModel();
});