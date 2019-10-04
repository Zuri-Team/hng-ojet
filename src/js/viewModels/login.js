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
  "ojs/ojrouter",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojformlayout"
], function (ko, ResponsiveUtils, ResponsiveKnockoutUtils) {
  function LoginViewModel() {
    var self = this;
    self.user = ko.observable();
    self.password = ko.observable();
    var router = oj.Router.rootInstance;
    var rootViewModel = ko.dataFor(document.getElementById("globalBody"));
    var feedback = function (text, color = "danger") {
      return `<div class=" mt-2 alert alert-${color} h5 show fb_alert" role="alert">
        <small>${text}</small>
      </div>`;
    };
    var progressbar = function () {
      return `<div class="progress position-relative mb-3 ">
      <div class="position-absolute h-100 w-100 progress-bar progress-bar-striped progress-bar-animated bg-success">
        <span class="oj-text-sm font-weight-bold">Logging In</span>
      </div>
    </div>`;
    };

    self.register = function () {
      router.go("register");
    };

    self.reset = function () {
      router.go("password_reset");
    };

    self.login = function () {
      var sect = $("#fbk");
      let email = self.user();
      let password = self.password();
      if ((email && password) !== undefined) {
        if (!(email.match(/([@])/) && email.match(/([.])/))) {
          sect.html(feedback("Please enter a valid email"));
        } else {
          sect.html(progressbar());
          $.post("http://localhost:3000/api/login", {
            email,
            password
          })
            .done(resp => {
              // start user session with token
              sessionStorage.setItem("user_token", resp.token);
              router.go("dashboard");
            })
            .fail(() => {
              sect.html(feedback("Incorrect login details"));
            });
        }
      } else {
        sect.html(feedback("Enter your details to login"));
      }
    };

    self.connected = function () { 
      if(sessionStorage.getItem("user_token") !== null){
        router.go("dashboard");
    }
    };

    /**
     * Optional ViewModel method invoked after the View is disconnected from the DOM.
     */
    self.disconnected = function () {
      // Implement if needed
    };

    /**
     * Optional ViewModel method invoked after transition to the new View is complete.
     * That includes any possible animation between the old and the new View.
     */
    self.transitionCompleted = function () {
      // Implement if needed
    };
  }

  /*
   * Returns a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.  Return an instance of the ViewModel if
   * only one instance of the ViewModel is needed.
   */
  return new LoginViewModel();
});
