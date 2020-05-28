/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
define([
  "knockout",
  "jquery",
  "ojs/ojformlayout",
  "ojs/ojselectcombobox",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojinputtext",
], function (ko, $) {
  function SubmissionComponentModel(context) {
    var self = this;
    self.isSmall = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
      oj.ResponsiveUtils.getFrameworkQuery(
        oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
      )
    );
    // For small screens: labels on top
    // For medium or bigger: labels inline
    self.labelEdge = ko.computed(function () {
      return self.isSmall() ? "top" : "start";
    }, self);

    var userToken = localStorage.getItem("user_token");
    // initialize the router
    const router = oj.Router.rootInstance;

    // Form Input Observables
    self.firstName = ko.observable("");
    self.lastName = ko.observable("");
    self.email = ko.observable("");
    self.hngCode = ko.observable("");
    self.stack = ko.observableArray([]);
    self.url = ko.observable("");
    self.taskDescription = ko.observable("");
    self.taskHeading = ko.observable("");
    const RESTurl = "http://test.hng.tech/api/submissions";

    const showMessage = (message, color = "error") => {
      const span = document.querySelector(".message");
      span.classList.add(`${color}`);
      span.innerHTML = `${message}`;
      span.style.display = "block";
      setTimeout(() => {
        span.style.display = "none";
      }, 3000);
    };

    self.cancel = () => {
      router.go("dashboard");
    };

    self.submit = () => {
      // We do not have to prevent the form's default submission behaviour, knockout js enforces that as default behaviour. Pretty cool yeah !

      // We need to, first of all, check that the user does not submit any empty fields;

      if (
        self.firstName() === "" ||
        self.lastName() === "" ||
        self.email() === "" ||
        self.hngCode() === "" ||
        self.url() === "" ||
        self.taskDescription() === ""
      ) {
        showMessage("Please fill all fields");
        return;
      }

      // Then, we do some awesome validation just to make sure our database is not cluttered with unwanted info.

      // This will be done when the endpoint is ready.

      // Store the submitted input values in an object. This will be sent to the backend.
      const task = {
        firstname: self.firstName(),
        lastname: self.lastName(),
        stack: self.stack(),
        email: self.email(),
        hng_code: self.hngCode(),
        url: self.url(),
        task_description: self.taskDescription(),
      };
      console.log(task);

      const submit = async (RESTurl = "", data = {}) => {
        const response = await fetch(RESTurl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage["user_token"],
          },
          body: JSON.stringify(data),
        });
        return await response.json();
      };
      try {
        const data = submit(RESTurl, task);
        console.log(JSON.stringify(data)); // JSON-string from `response.json()` call
      } catch (error) {
        console.error(error);
      }

      // User is redirected to the dashboard on submit.
      router.go("dashboard");
    };

    self.connected = () => {
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      if (localStorage.getItem("user_token") == null) {
        router.go("login");
      }
      self.taskHeading(
        `Dear ${user.firstname}, please Submit Your Task(s) Here`
      );
    };
  }

  return new SubmissionComponentModel();
});
