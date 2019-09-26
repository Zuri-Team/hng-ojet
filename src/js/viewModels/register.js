/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your register ViewModel code goes here
 */
define(['knockout', 'ojs/ojcore', 'jquery', 'ojs/ojrouter', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojselectcombobox'],
  function (ko, Router, $) {

    function RegisterViewModel() {
      var self = this;
      var router = oj.Router.rootInstance;

      self.fullname = ko.observable();
      self.phone = ko.observable();
      self.stack = ko.observable();
      self.location = ko.observable();

      //account info
      self.username = ko.observable();
      self.email = ko.observable();
      self.pass = ko.observable();
      self.rpass = ko.observable();
      // self.id = h

      self.connected = function () {
        // Implement if needed
        function validate() {
          var sect = $("#fbk");
          var feedback = function (text, color = "danger") {
            return `<div class=" mt-2 alert alert-${color} h6 show fb_alert" role="alert">
            <small>${text}</small>
          </div>`;
          };

          if ((self.fullname() && self.phone() && self.location() && self.username() && self.email() && self.pass() && self.rpass()) !== undefined) {
            var validated = true;
            if (!(self.email().match(/([@])/) && self.email().match(/([.])/))) {
              sect.html(feedback("Please enter a valid email"));
            }
            if (
              (self.pass().length > 0 && self.pass().length < 4) ||
              (self.rpass().length > 0 && self.rpass().length < 4)
            ) {
              validated = false;
              sect.html(feedback("Password should be minimum 4 characters"));
            } else {
              if (self.pass() !== self.rpass()) {
                sect.html(feedback("Passwords does not match"));
                validated = false;
              }
            }
            let newuser = db.transaction(["user"], "readwrite").objectStore("user");
            var un = newuser.index("uname");
            var em = newuser.index("email");
            if (validated == true) {
              console.log(db);
              un.get(`${self.username()}`).onsuccess = function (e) {
                if (e.target.result != undefined) {
                  sect.html(feedback("Username already taken"));
                } else {
                  em.get(`${self.email()}`).onsuccess = function (e) {
                    if (e.target.result != undefined) {
                      sect.html(feedback("An account with this email already exists"));
                    } else {
                      newuser.add({
                        "uname": self.username(),
                        "name": self.fullname(),
                        "phone": self.phone(),
                        "location": self.location(),
                        "email": self.email(),
                        "stack": self.stack(),
                        "password": self.pass()
                      }); sect.html(feedback("Account created, redirecting to login page...", 'success'));
                      setTimeout(function () {
                        router.go('login');
                      }, 2000)
                    }
                  }
                }
              }
            }
          } else {
            sect.html(feedback("All fields are required"));
          }
        }

        $("#next").click(function () {
          $("#profileinfo").hide();
          $("#accinfo").show();
        })
        $("#prev").click(function () {
          $("#profileinfo").show();
          $("#accinfo").hide();
        })

        self.signup = function () {
          validate();
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
    return new RegisterViewModel();
  }
);
