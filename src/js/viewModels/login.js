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
  "ojs/ojrouter",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojformlayout"
], function(ko, api) {
  function LoginViewModel() {
    var self = this;
    self.user = ko.observable();
    self.password = ko.observable();
    var router = oj.Router.rootInstance;
    var feedback = function(text, color = "danger") {
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

    self.register = function() {
      router.go("register");
    };

    self.reset = function() {
      router.go("password_request");
    };

    self.login = function() {
      var sect = $("#fbk");
      let email = self.user();
      let password = self.password();
      if ((email && password) !== undefined) {
        if (!(email.match(/([@])/) && email.match(/([.])/))) {
          sect.html(feedback("Please enter a valid email"));
        } else {
          sect.html(progressbar());

          $.post(`${api}/api/login`, {
            email,
            password
          })
            .done(({ status, user, token }) => {
              // start user session with token
              if (status == true) {
                sessionStorage.setItem("user", JSON.stringify(user));
                sessionStorage.setItem("user_token", token);
                redirect_user(user.role);
              }
            })
            .fail(err => {
              if (err.status == 500) {
                sect.html(
                  feedback("oops, something went wrong. Please try again")
                );
              }
              if (err.status == 401) {
                sect.html(
                  feedback(
                    "Wrong email or password. Please enter correct details to login"
                  )
                );
              }
            });
        }
      } else {
        sect.html(feedback("Enter your details to login"));
      }
    };

    function redirect_user(role) {
      setTimeout(function() {
        if (role == "superadmin" || role == "admin") {
          router.go("admin_dashboard");
        } else {
          router.go("user_dashboard");
        }
      }, 0);
    }
    self.connected = function() {
      if (sessionStorage.getItem("user_token") !== null) {
        let user = sessionStorage.getItem("user");
        user = JSON.parse(user);
        redirect_user(user.role);
      } else {
        router.go("login")
      }
    };

    self.disconnected = function() {
      // Implement if needed
    };
  }

  return new LoginViewModel();
});
