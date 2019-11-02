define(['ojs/ojcore',
        'knockout',
        'jquery', './api',
        'ojs/ojbootstrap',
        'ojs/ojresponsiveutils',
        'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider', 'ojs/ojmessages',
        'ojs/ojknockout', 'ojs/ojlabel', 'ojs/ojavatar', 'ojs/ojselectcombobox',
        'ojs/ojfilepicker', 'ojs/ojinputtext', 'ojs/ojformlayout', 'ojs/ojbutton'
    ],
    function(oj, ko, $, api, ArrayDataProvider, ) {

        function ProfileViewModel() {
            var self = this;

            // 
            var RESTurl = `${api}/api/profile`;
            var userToken = sessionStorage.getItem("user_token");
            const user = JSON.parse(sessionStorage.getItem("user"));
            const id = user.id

            // notification messages observable
            self.applicationMessages = ko.observableArray([]);


            self.firstname = ko.observable('');
            self.lastname = ko.observable('');
            self.username = ko.observable('@');
            self.phone = ko.observable('');
            self.email = ko.observable('');
            self.bio = ko.observable('');
            self.stack = ko.observable('');
            self.url = ko.observable('');
            self.location = ko.observable('');


            self.editMode = ko.observable("false");

            self.profile = ko.observable('');

            self.status = ko.observable(false);

            self.devstack = ko.observableArray([
                { value: 'UI/UX', label: 'UI/UX' },
                { value: 'FrontEnd', label: 'FrontEnd' },
                { value: 'Backend', label: 'Backend' },
                { value: 'Digital Marketing', label: 'Digital Marketing' },
                { value: 'DevOps', label: 'DevOps' },
                { value: 'FrontEnd', label: 'FrontEnd' },
            ]);

            //Events
            self.acceptStr = ko.observable("image/*");

            self.acceptArr = ko.pureComputed(function() {
                var accept = self.acceptStr();
                return accept ? accept.split(",") : [];
            }, self);


            self.selectListener = function(event) {
                const file = event.detail.files[0];

                let form = new FormData();

                form.append('profile_img', file);

                $.ajax({
                    url: `${RESTurl}/${id}/upload`,
                    headers: {
                        Accept: 'application/json',
                        Authorization: "Bearer " + userToken
                    },
                    data: form,
                    contentType: false,
                    processData: false,
                    method: 'POST',
                    type: 'POST',
                    success: function(data) {

                        self.applicationMessages.push({

                            severity: "confirmation",
                            summary: "Update Successful",
                            detail: "Your profile has been successfully updated"

                        });
                    },
                    error: function(error) {

                        self.applicationMessages.push({
                            severity: "error",
                            summary: "Failed to Update",
                            detail: "An error occurred while updating your profile. Try Again"

                        });

                    }
                });


            }



            self.editButton = function() {

                self.editMode() ?
                    self.editMode(false) :
                    self.editMode(true);

                self.fetchProfile();

            }.bind(self);

            self.cancelButton = function() {

                self.editMode() ?
                    self.editMode(false) :
                    self.editMode(true);

                self.fetchProfile();

            }.bind(self);

            self.update = function(data, event) {

                event.preventDefault();

                const {...user } = self.profile;



                const form = {

                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    email: user.email,
                    bio: user.bio,
                    url: user.url,

                }

                $.ajax({
                    url: `${RESTurl}/${id}/edit`,
                    headers: {
                        Accept: 'application/json',
                        Authorization: "Bearer " + userToken
                    },
                    data: form,
                    contentType: 'application/x-www-form-urlencoded',
                    method: 'POST',
                    type: 'POST',
                    success: function(data) {

                        self.applicationMessages.push({

                            severity: "confirmation",
                            summary: "Update Successful",
                            detail: "Your profile has been successfully updated",
                            autoTimeout: parseInt("0")

                        });
                    },
                    error: function(error) {

                        self.applicationMessages.push({
                            severity: "error",
                            summary: "Failed to Update",
                            detail: "An error occurred while updating your profile. Try Again",
                            autoTimeout: parseInt("0")

                        });
                    }
                });



            }

            self.fetchProfile = function() {

                $.ajax({
                    url: `${RESTurl}/${id}`,
                    headers: {
                        Authorization: "Bearer " + userToken
                    },
                    method: "GET",
                    success: res => {


                        const [...data] = res.data
                        const [user, profile] = data

                        const { firstname, lastname, username, email, } = user;
                        const { bio, url, phone, profile_img } = profile;

                        self.firstname(firstname);
                        self.lastname(lastname);
                        self.username(username);
                        self.email(email);
                        self.bio(bio);
                        self.url(url);
                        // self.phone(phone)

                        let profileImg = document.getElementsByClassName('profile_img');

                        for (i = 0; i < profileImg.length; i++) {
                            profileImg[i].src = profile_img;
                        }

                    }
                });

            };

            (function fetchUser() {
                $.ajax({
                    url: `${api}/api/status`,
                    method: "GET",
                    success: ({ status, data }) => {
                        if (status == true) {
                            const [res] = data.filter(data => data.id === id);

                            self.status(res.status);
                        }


                    }
                });
                setTimeout(fetchUser, 15000);
            })();

            self.fetchProfile();


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