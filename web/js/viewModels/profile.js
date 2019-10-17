define(['ojs/ojcore',
        'knockout',
        'jquery', './api',
        'ojs/ojbootstrap',
        'ojs/ojresponsiveutils',
        'ojs/ojresponsiveknockoututils',
        'ojs/ojknockout', 'ojs/ojlabel', 'ojs/ojavatar', 'ojs/ojselectcombobox',
        'ojs/ojfilepicker', 'ojs/ojinputtext', 'ojs/ojformlayout', 'ojs/ojbutton'
    ],
    function(oj, ko, $, api, Bootstrap, responsiveUtils, responsiveKnockoutUtils) {

        function ProfileViewModel() {
            var self = this;

            // 
            var RESTurl = `${api}/api/profile`;
            var userToken = sessionStorage.getItem("user_token");


            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.
            self.isSmall = responsiveKnockoutUtils.createMediaQueryObservable(
                responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));

            // For small screens: labels on top
            // For medium or bigger: labels inline
            self.labelEdge = ko.computed(function() {
                return self.isSmall() ? "top" : "start";
            }, self);


            self.firstname = ko.observable('');
            self.lastname = ko.observable('');
            self.username = ko.observable('@');
            self.phone = ko.observable('');
            self.email = ko.observable('');
            self.bio = ko.observable('');
            self.stack = ko.observable('');
            self.url = ko.observable('');
            self.location = ko.observable('');
            self.profile_img = ko.observable('');

            self.picture = ko.observable('');

            self.devstack = ko.observableArray([
                { value: 'UI/UX', label: 'UI/UX' },
                { value: 'FrontEnd', label: 'FrontEnd' },
                { value: 'Backend', label: 'Backend' },
                { value: 'Digital Marketing', label: 'Digital Marketing' },
                { value: 'DevOps', label: 'DevOps' },
                { value: 'FrontEnd', label: 'FrontEnd' },
            ]);


            self.profile = ko.observable('');

            //Events
            self.acceptStr = ko.observable("image/*");

            self.acceptArr = ko.pureComputed(function() {
                var accept = self.acceptStr();
                return accept ? accept.split(",") : [];
            }, self);

            self.selectListener = function(event) {
                const file = event.detail.files[0];
                console.log(file);
                self.picture(file);
            }

            self.editMode = ko.observable("false");


            self.editButton = function() {

                self.editMode() ?
                    self.editMode(false) :
                    self.editMode(true);

            }.bind(self);

            self.cancelButton = function() {

                self.editMode() ?
                    self.editMode(false) :
                    self.editMode(true);

            }.bind(self);

            self.update = function() {

                const {...data } = self.profile;

                const photo = self.picture();
                let user = [];

                console.log("You clicked this button", data, photo);
                let formData = new FormData();

                formData.append("data", { "photo": photo, "user": data });
                fetch(user, {
                    headers: {
                        contentType: false,
                        Authorization: "Bearer " + userToken
                    },
                    method: "PUT",
                    body: formData,
                    success: function(r) {
                        console.log('success', r, user);
                    },
                    error: function(r) {
                        console.log('error', r);
                    }
                });

                // $.ajax({
                //     url: `${RESTurl}/${id}/edit`,
                //     headers: {
                //         Authorization: "Bearer " + userToken
                //     },
                //     method: "POST",
                //     data: data,
                //     success: res => {

                //     }
                // });


            }

            self.getProfile = function() {
                const user = JSON.parse(sessionStorage.getItem("user"));
                const id = user.id

                $.ajax({
                    url: `${RESTurl}/${id}`,
                    headers: {
                        Authorization: "Bearer " + userToken
                    },
                    method: "GET",
                    success: res => {
                        const { user, profile } = res
                        const { firstname, lastname, username, email, } = user;
                        const { bio, url, phone, profile_img } = profile;

                        self.firstname(firstname);
                        self.lastname(lastname);
                        self.username(username);
                        self.email(email);
                        self.bio(bio);
                        self.url(url);
                        self.phone(phone);
                        self.profile_img(profile_img);
                    }
                });

            };

            self.getProfile();


            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * This method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
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
        return new ProfileViewModel();
    }

);