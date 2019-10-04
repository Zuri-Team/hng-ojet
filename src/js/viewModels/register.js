/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your register ViewModel code goes here
 */
define([
  "knockout",
  "ojs/ojcore",
  "jquery",
  "ojs/ojrouter",
  "ojs/ojformlayout",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function (ko, Router, $) {
  function RegisterViewModel() {
    var self = this;
    var router = oj.Router.rootInstance;

    self.firstname = ko.observable();
    self.lastname = ko.observable();
    self.stack = ko.observable();
    self.location = ko.observable();

    //account info
    self.username = ko.observable();
    self.email = ko.observable();
    self.pass = ko.observable();
    self.rpass = ko.observable();

    self.login = function () {
      router.go("login");
    };

    self.connected = function () {
      // Implement if needed
      function validate() {
        var sect = $("#fbk");
        var feedback = function (text, color = "danger") {
          return `<div class=" mt-3 alert alert-${color} h5 show fb_alert" role="alert">
            <small>${text}</small>
          </div>`;
        };

        var progressbar = function () {
          return `<div class="progress position-relative mt-3">
          <div class="position-absolute h-100 w-100 progress-bar progress-bar-striped progress-bar-animated bg-info"
            role="progressbar">
            <span class="oj-text-sm font-weight-bold">Processing registration</span>
          </div>
        </div>`;
        };

        let firstname = self.firstname();
        let email = self.email();
        let lastname = self.lastname();
        let username = self.username();
        let password = self.pass();
        let confirm_password = self.rpass();
        let stack = self.stack();
        let location = self.location();

        if (
          (firstname &&
            lastname &&
            email &&
            username &&
            stack &&
            location &&
            password &&
            confirm_password) !== undefined
        ) {
          validated = true;
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
          if (validated == true) {
            sect.html(progressbar());
            $.post("http://localhost:3000/api/register", {
              firstname,
              lastname,
              email,
              username,
              password,
              confirm_password,
              stack,
              location
            })
              .done(resp => {
                if (resp.status == true) {
                  sect.html(
                    feedback(
                      "Account created, redirecting to login page...",
                      "success"
                    )
                  );
                  setTimeout(function () {
                    router.go("login");
                  }, 2000);
                }
              })
              .fail(() => {
                sect.html(feedback("Sorry, your registration could not be completed. Your username or email is already registered to an account"));
              });
          }
        } else {
          console.log("wrong");
          sect.html(feedback("All fields are required"));
        }
      }

      $("#next").click(function () {
        $("#profileinfo").hide();
        $("#accinfo").show();
      });
      $("#prev").click(function () {
        $("#profileinfo").show();
        $("#accinfo").hide();
      });

      self.signup = function () {
        validate();
      };
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
  return new RegisterViewModel();
});
