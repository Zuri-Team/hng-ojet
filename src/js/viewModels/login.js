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
      router.go("password_reset");
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
            .fail(() => {
              sect.html(feedback("Incorrect login details"));
            });
        }
      } else {
        sect.html(feedback("Enter your details to login"));
      }
    };
    function redirect_user(role) {
      setTimeout(function() {
        if (role == "superadmin") {
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
      }
    };

    self.disconnected = function() {
      // Implement if needed
    };
  }

  return new LoginViewModel();
});
