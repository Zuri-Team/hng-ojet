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
    function (ko, $, api, Bootstrap, ojvalbase, ArrayDataProvider) {

        function overviewModel() {
            self = this;
           

            var RESTurl = 'https://api.start.ng/api/stats/dashboard';

            self.total_posts = ko.observable();
            self.total_teams = ko.observable();
            self.total_interns = ko.observabl();
           
            self.fetchdashboard = function() {
              $.ajax({
                url: `${RESTurl}`,
                headers:{
                  Authorization: "Bearer" + userToken
                },
                method: "GET",
                success: res =>{
                  let{data} = res.data;
                  self.total_posts(data.total_posts);
                  self.total_teams(data.total_teams);
                  self.total_interns(data.total_interns);
                }

              })
            }
            

            /*self.dataProvider = ko.observable();
          
            var userToken = sessionStorage.getItem("user_token");

    fetch('https://api.start.ng/api/stats/dashboard')
    .then(res => res.json())
    .then(data => console.log(data));
      */     
    
    
            self.firstName = '';
            self.lastName = '';
            self.initials = ojvalbase.IntlConverterUtils.getInitials(self.firstName,self.lastName);
            self.avatarSize = ko.observable("xxl");
            self.sizeOptions = ko.observableArray(['xxs', 'xs','sm','md','lg','xl','xxl']);
            
            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            /*self.disconnected = function () {
                // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
           /* self.transitionCompleted = function () {
                // Implement if needed
            };
        }

        /*
         * Returns a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.  Return an instance of the ViewModel if
         * only one instance of the ViewModel is needed.
         */
        return new overviewModel();
    });

