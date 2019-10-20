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

            // For the selected file
            self.fileNames = ko.observableArray([]);


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
            self.selectedFile = ko.observable();


            self.profile = ko.observable("");

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

            self.selectListener = function (event) {
                var files = event.detail.files;
                for (var i = 0; i < files.length; i++) {
                  self.fileNames.push(files[i].name);
                  console.log(self.fileNames()[0])
                  self.selectedFile(self.fileNames()[0])
                }
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

                const {...user } = self.profile;

                console.log("You clicked this button", user);

                const data = 
                    {
                    user: {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        username: user.username,
                        email: user.email,
                        stack: user.stack[0],
                    },
                    profile:{
                        bio: user.bio,
                        url: user.url,
                        profile_img: self.fileNames()[0],
                        user_id: id
                    }
                   
                    }
                    console.log(data)

                $.ajax({
                    url: `${RESTurl}/${id}/edit`,
                    headers: {
                        Authorization: "Bearer " + userToken
                    },
                    data,
                    method: 'POST',
                    success: function(data) {
                        console.log(data);
                        self.applicationMessages.push({

                            severity: "confirmation",
                            summary: "Update Successful",
                            detail: "Your profile has been successfully updated",
                            autoTimeout: parseInt("0")

                        });
                    },
                    error: function(error) {
                        console.log(error)
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
                        console.log(res)
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
                        
                        let profile_pic = document.getElementById('profile_img');
                        profile_pic.src = profile_img;


                    }
                });

            };

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
