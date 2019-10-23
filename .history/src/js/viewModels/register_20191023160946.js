define([
  "knockout",
  "./api",
  "jquery",
  "ojs/ojresponsiveutils", 
  "ojs/ojresponsiveknockoututils",
  "ojs/ojcore",
  "ojs/ojrouter",
  "ojs/ojformlayout",
  "ojs/ojinputtext",
  "ojs/ojlabel",
  "ojs/ojselectcombobox",
  "ojs/ojbutton"
], function(ko, api, $, responsiveUtils, responsiveKnockoutUtils) {
  function RegisterViewModel() {
      var self = this;
      var router = oj.Router.rootInstance;

      self.isSmall = responsiveKnockoutUtils.createMediaQueryObservable(
        responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));

      // For small screens: labels on top
      // For medium screens and up: labels inline
      self.labelEdge = ko.computed(function () {
        return self.isSmall() ? "top" : "start";
      }, self);

      self.devstack = ko.observableArray([])

      var tracksURL = `${api}/api/track`;

      //  Fetch all tracks
      self.fetchTracks = async() => {
        try {
            const response = await fetch(`${tracksURL}/all`, {});
            const {
                data: { data }
            } = await response.json();

            // var result = data.data.map(track => [track.id]);
            var result = data.map(track => ({
                value: `${track.id}`,
                label: track.track_name
            }));
            //console.log(result);

            self.devstack(result);

            //console.log(self.devstack());
        } catch (err) {
            console.log(err);
        }
    };
    self.fetchTracks();
      

    self.firstname = ko.observable("First Name");
    self.lastname = ko.observable("Last Name");
    self.stack = ko.observableArray([]);
    self.location = ko.observable("Location");

    //account info
    self.username = ko.observable("Slack Username");
    self.email = ko.observable("Email");
    self.pass = ko.observable("password");
    self.rpass = ko.observable("confirm password");

    self.clickedButton = ko.observable("(None clicked yet)");

      self.login = function() {
          router.go("login");
      };

      self.connected = function() {
          // Implement if needed
          function validate() {
              var sect = $("#fbk");
              var feedback = function(text, color = "danger") {
                  return `<div class=" mt-3 alert alert-${color} h6 show fb_alert" role="alert">
          <small>${text}</small>
        </div>`;
                };

                let firstname = self.firstname();
                let lastname = self.lastname();
                let email = self.email();
                let username = self.username();
                let password = self.pass();
                let confirm_password = self.rpass();
                let tracks = self.stack().map((stack) => {
                  return stack
                });

                let location = self.location();

                if (
                    (firstname &&
                        lastname &&
                        email &&
                        username &&
                        // tracks &&
                        location &&
                        password &&
                        confirm_password) !== undefined
                ) {
                    if (!(email.match(/([@])/) && email.match(/([.])/))) {
                        validated = false;
                        sect.html(feedback("Please enter a valid email"));
                    }
                    if (password.length < 4 || confirm_password.length < 4) {
                        validated = false;
                        sect.html(feedback("Password should be minimum 4 characters"));
                    } else {
                        if (password !== confirm_password) {
                            sect.html(feedback("Passwords does not match"));
                            validated = false;
                        }
                    }

                    const data = JSON.stringify({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        username: username,
                        password: password,
                        confirm_password: confirm_password,
                        tracks: tracks,
                        location: location
                    });

                    console.log(data);
                    sect.html(progressbar());
                    $.post(`https://api.start.ng/api/register`, {
                            firstname,
                            lastname,
                            email,
                            username,
                            password,
                            confirm_password,
                            tracks,
                            location
                        })
                        .done(({ status }) => {
                            if (status == true) {
                                sect.html(
                                    feedback(
                                        "Account created, redirecting to login page...",
                                        "success"
                                    )
                                );
                                setTimeout(function() {
                                    router.go("login");
                                }, 2000);
                            }
                        })
                        .fail(() => {
                         if (firstname == ''){
                             console.log('Firstname field is required')
                            sect.html(
                                feedback(
                                    'The firstname field is required'
                                
                                )
                            );
                        } else if ( lastname == '') {
                            console.log('Lastname field is required')
                            sect.html(
                                feedback(
                                    'The lastname field is required'
                                )
                            )
                        } else if ( username == '') {
                            console.log('Username field is required')
                            sect.html(
                                feedback(
                                    'The username field is required'
                                )
                            )
                        } else if (email == '') {
                          console.log('email is required')
                            sect.html(
                                feedback (
                                    'The email field is required'
                                )
                            )       
                        } else if (password.length < 4 ) {
                            sect.html(
                                feedback(
                                    'Complete your password'
                                )
                            )
                        }
                        
                    
                            
                        });
                } else {
                    console.log("wrong");
                    sect.html(feedback("All fields are required"));
                }
            }

   

            $("#next").click(function() {
                $("#profileinfo").hide();
                $("#accinfo").show();
            });
            $("#prev").click(function() {
                $("#profileinfo").show();
                $("#accinfo").hide();
            });
            
            self.buttonClick = function(){
              validate();
            }.bind(self);

            /*self.signup = function() {
                validate();
            };*/
        };

        // self.connected = function() {
        //   self.fetchTracks();
        // };

        self.disconnected = function() {
            // Implement if needed
        };

        self.transitionCompleted = function() {
            // Implement if needed
        };
    }

    return new RegisterViewModel();
});