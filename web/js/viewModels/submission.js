<<<<<<< HEAD
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
  "ojs/ojinputtext"
], function(ko, $) {
  function SubmissionComponentModel(context) {
    var self = this;
    self.isSmall = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
      oj.ResponsiveUtils.getFrameworkQuery(
        oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
      )
    );
    // For small screens: labels on top
    // For medium or bigger: labels inline
    self.labelEdge = ko.computed(function() {
      return self.isSmall() ? "top" : "start";
    }, self);

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

    const showMessage = (message, color = "error") => {
      const span = document.querySelector(".message");
      span.classList.add(`${color}`);
      span.innerHTML = `${message}`;
      span.style.display = "block";
      setTimeout(() => {
        span.style.display = "none";
      }, 3000);
    };

    self.submit = () => {
      // We do not have to prevent the form's default submission behaviour, knockout js enforces that as default behaviour. Pretty cool yeah !

      //We need to, first of all, check that the user does not submit any empty fields;

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

      //Then, we do some awesome validation just to make sure our database is not cluttered with unwanted info.

      // This will be done when the endpoint is ready.

      // Store the submitted input values in an object. This will be sent to the backend.
      const task = {
        firstname: self.firstName(),
        lastname: self.lastName(),
        stack: self.stack(),
        email: self.email(),
        hng_code: self.hngCode(),
        url: self.url(),
        task_description: self.taskDescription()
      };
      console.log(task);

      // User is redirected to the dashboard on submit.
      router.go("dashboard");
    };
  }

  return new SubmissionComponentModel();
});
=======
define(["knockout","jquery","ojs/ojformlayout","ojs/ojselectcombobox","ojs/ojinputtext"],function(e,s){return new function(s){var o=this;o.isSmall=oj.ResponsiveKnockoutUtils.createMediaQueryObservable(oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY)),o.labelEdge=e.computed(function(){return o.isSmall()?"top":"start"},o);const t=oj.Router.rootInstance;o.firstName=e.observable(""),o.lastName=e.observable(""),o.email=e.observable(""),o.hngCode=e.observable(""),o.stack=e.observableArray([]),o.url=e.observable(""),o.taskDescription=e.observable(""),o.submit=(()=>{if(""===o.firstName()||""===o.lastName()||""===o.email()||""===o.hngCode()||""===o.url()||""===o.taskDescription())return void((e,s="error")=>{const o=document.querySelector(".message");o.classList.add(`${s}`),o.innerHTML=`${e}`,o.style.display="block",setTimeout(()=>{o.style.display="none"},3e3)})("Please fill all fields");const e={firstname:o.firstName(),lastname:o.lastName(),stack:o.stack(),email:o.email(),hng_code:o.hngCode(),url:o.url(),task_description:o.taskDescription()};console.log(e),t.go("dashboard")})}});
>>>>>>> 47c204b670044215f192ee69f48a3830b599a9a9
