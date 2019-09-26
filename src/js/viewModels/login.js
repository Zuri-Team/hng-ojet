/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your login ViewModel code goes here
 */
define([
  'knockout', 'ojs/ojrouter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils',
  'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojformlayout'
],
  function (ko, ResponsiveUtils, ResponsiveKnockoutUtils) {

    function LoginViewModel() {
      var self = this;
      self.email = ko.observable();
      self.password = ko.observable();
      var router = oj.Router.rootInstance;
      var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
      var feedback = function (text, color = "danger") {
        return `<div class=" mt-2 alert alert-${color} h6 show fb_alert" role="alert">
        <small>${text}</small>
      </div>`;
      };
      self.login = function () {
        let userdb = db.transaction(["user"], "readwrite").objectStore("user");
        var fetchuser = userdb.index("email");
        fetchuser.get(`${self.email()}`).onsuccess = function (e) {
          let { result } = e.target;
          if (result != undefined) {
            if (result.password == self.password()) {
              localStorage.setItem("user", result.uname);
              router.go('dashboard');
              
            } else {
              document.querySelector("#fbk").innerHTML = feedback("Wrong email or password")
            }
          } else {
            document.querySelector("#fbk").innerHTML = feedback("Please enter correct login details")
          }
        }
      }

      self.connected = function () {
        if (localStorage.getItem("user") != null) {
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
  }
);
