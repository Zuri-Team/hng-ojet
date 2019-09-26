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
    function ExampleComponentModel(context) {
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
  
      // Form Input Observables
      self.firstName = ko.observable("");
      self.lastName = ko.observable("");
      self.email = ko.observable("");
      self.hngCode = ko.observable();
      self.url = ko.observable();
      self.taskDescription = ko.observable();
    }
  
    return new ExampleComponentModel();
  });
  