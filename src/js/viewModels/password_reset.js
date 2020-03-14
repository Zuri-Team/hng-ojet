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
], function(ko, api, ResponsiveUtils, ResponsiveKnockoutUtils) {
  function PasswordResetModel() {
    var self = this;
    var router = oj.Router.rootInstance;
    var feedback = function(text, color = "danger") {
      return `<div class=" mt-2 alert alert-${color} h6 show fb_alert" role="alert">
        <small>${text}</small>
      </div>`;
    };
    var progressbar = function() {
      return `<div class="progress position-relative mb-3 ">
      <div class="position-absolute h-100 w-100 progress-bar progress-bar-striped progress-bar-animated bg-success">
        <span class="oj-text-sm font-weight-bold">Redirecting to log in page...</span>
      </div>
    </div>`;
    };
    var errorbar = function() {
      return `<div class="progress position-relative mb-3 ">
      <div class="position-absolute h-100 w-100 progress-bar progress-bar-striped progress-bar-animated bg-danger">
        <span class="oj-text-sm font-weight-bold">Redirecting to reset password page...</span>
      </div>
    </div>`;
    };

    self.email = ko.observable("");
    self.pass = ko.observable("");
    self.rpass = ko.observable("");

    self.connected = function() {
      self.reset = function() {
        var sect = $("#fbk");
        let url = new URL(window.location.href);
        let token = new URLSearchParams(url.search).get("token");

        if (self.pass() != self.rpass()) {
          sect.html(feedback("Passwords do not match"));
        }
       

        let email = self.email();
        let password = self.pass();
        let confirm_password = self.rpass();

        const form = {
          email,
          password,
          confirm_password,
          token
        };

        $.ajax({
          url: `${api}/api/password/reset`,
          headers: {
            Accept: "application/json"
          },
          data: form,
          contentType: "application/x-www-form-urlencoded",
          method: "POST",
          type: "POST",
          success: function(data) {
            sect.html(progressbar());
            if (data.status == true) {
              setTimeout(() => router.go("login"), 1000);
            }
          },
          error: function(error) {
            console.log(error);
            if(error.status == 400) {
                  sect.html(
                    feedback(
                      "All fields are required. Please provide them before you proceed"
                    )
                  );
            }
            if (error.status == 404) {
              sect.html(
                feedback("You already requested a password reset. You need to redo this")
              );
              setTimeout(() => sect.html(errorbar()), 1000);
              setTimeout(() => router.go("password_request"), 3000);
            }
          }
        });
      };
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
  return new PasswordResetModel();
});
