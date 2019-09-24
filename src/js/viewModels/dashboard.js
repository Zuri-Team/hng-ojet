/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojrouter',
  'jquery',
  'ojs/ojlabel',
  'ojs/ojbootstrap',
  'ojs/ojselectcombobox',
  'ojs/ojchart',
  'ojs/ojlistview',
  'ojs/ojarraydataprovider',
],
  function (oj, ko, Router) {

    function DashboardViewModel(params) {
      let { rootInstance } = Router;
      var self = this;
      var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
      rootViewModel.isLoggedIn(true);
      self.fullname = ko.observable();
      self.username = ko.observable();
      self.email = ko.observable();
      self.phone = ko.observable();
      self.stack = ko.observable();
      self.location = ko.observable();
      self.id = ko.observable();

      function loadData() {
        let userData = localStorage.getItem("userInfo");
        userData = JSON.parse(userData);
        let { name, uname, email, phone, stack, location, id } = userData;
        self.id(`hngi_${id}`);
        self.fullname(name);
        self.username(uname);
        self.email(email);
        self.phone(phone);
        self.stack(stack);
        self.location(location);

      }
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        self.id('');
        self.fullname('');
        self.username('');
        self.email('');
        self.phone('');
        self.stack('');
        self.location('');
        let u = localStorage.getItem("user");
        if (u == null) {
          rootInstance.go("login");
        }
        let userdata = db.transaction(["user"]).objectStore("user");
        userdata.index('uname').get(`${u}`).onsuccess = function (e) {
          let { name, uname, email, phone, stack, location, id } = e.target.result;
          localStorage.setItem("userInfo", JSON.stringify({ name, uname, email, phone, stack, location, id }));
          setTimeout(() => {
            loadData();
          }, 0);
        }
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
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
    return new DashboardViewModel();
  }
);
