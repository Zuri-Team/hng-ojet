/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojbutton"
], function(oj, ko, $) {
  function SignupPageViewModel() {
    var self = this;

    self.firstname = ko.observable();
    self.middlename = ko.observable();
    self.lastname = ko.observable();
    self.email = ko.observable();
    self.username = ko.observable();
    self.phone = ko.observable();
    self.stack = ko.observableArray();
    self.location = ko.observable();
    self.password = ko.observable();
    self.verifyPassword = ko.observable();
    self.submitInfo = function() {
      console.log("Button clicked..");

      var fullname =
        self.firstname() + " " + self.middlename() + " " + self.lastname();
      var userStack = self.stack().join();

      console.log(userStack);
      console.log(fullname);
      console.log(self.email());

      //validate password
      //   if (self.password !== self.verifyPassword) {
      //     alert("Passwords dont match");
      //     // oj.Router.rootInstance.go("loginPage");
      //     return;
      //   } else {
      var data = JSON.stringify({
        fullname: fullname,
        email: self.email(),
        username: self.username(),
        location: self.location(),
        phone: self.phone(),
        stack: userStack,
        password: self.password()
      });

      console.log(data);

      $.ajax({
        url: "http://volunteerng.herokuapp.com/api/create_user.php",
        method: "POST",
        contentType: "application/json",
        data: data,
        success: function(data) {
          if (data.status == true) {
            console.log("registered");

            oj.Router.rootInstance.go("loginPage");
          } else {
            console.log("invalid login / bad parsing");

            alert("Could not Register");
          }
        },
        error: function(jqXHR, exception) {
          alert("Could not Register");
        }
      });
      //   }
    };

    self.loginClick = function() {
      oj.Router.rootInstance.go("loginPage");
    };

    self.handleActivated = function(info) {
      // Implement if needed
    };

    self.handleAttached = function(info) {
      // Implement if needed
    };

    self.handleBindingsApplied = function(info) {
      // Implement if needed
    };

    self.handleBindingsApplied = function(info) {
      // Implement if needed
    };

    self.handleDetached = function(info) {
      // Implement if needed
    };
  }

  return new SignupPageViewModel();
});
