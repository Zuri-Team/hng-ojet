/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojrouter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
  'ojs/ojoffcanvas', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function (ko, moduleUtils, KnockoutTemplateUtils, Router, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider, OffcanvasUtils) {
    function ControllerViewModel() {
      var self = this;

      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Media queries for repsonsive layouts
      var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      // Router setup
      self.router = Router.rootInstance;
      self.router.configure({
        'dashboard': { label: 'Dashboard', },
        'register': { label: 'Register' },
        'login': { label: 'Login', isDefault: true },
        'logout': { label: 'Logout' },
      });
      Router.defaults['urlAdapter'] = new Router.urlParamAdapter();

      self.moduleConfig = ko.observable({ 'view': [], 'viewModel': null });

      self.loadModule = function () {
        ko.computed(function () {
          var name = self.router.moduleConfig.name();
          var viewPath = 'views/' + name + '.html';
          var modelPath = 'viewModels/' + name;
          var masterPromise = Promise.all([
            moduleUtils.createView({ 'viewPath': viewPath }),
            moduleUtils.createViewModel({ 'viewModelPath': modelPath })
          ]);
          masterPromise.then(
            function (values) {
              self.moduleConfig({ 'view': values[0], 'viewModel': values[1] });
            }
          );
        });
      };

      // Navigation setup
      var navData = [
        {
          name: 'Login', id: 'login', loggedIn: false
        },
        {
          name: 'Register', id: 'register', loggedIn: false
        },
        {
          name: 'Dashboard', id: 'dashboard', loggedIn: true
        },
        {
          id: "logout", loggedIn: true, iconClass: "fa fa-power-off",
        },
      ];
      self.navDataProvider = new ArrayDataProvider(navData, { keyAttributes: 'id' });

      // Drawer
      // Close offcanvas on medium and larger screens
      self.mdScreen.subscribe(function () { OffcanvasUtils.close(self.drawerParams); });
      self.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      self.toggleDrawer = function () {
        return OffcanvasUtils.toggle(self.drawerParams);
      }
      // Add a close listener so we can move focus back to the toggle button when the drawer closes
      document.getElementById('navDrawer').addEventListener("ojclose", document.getElementById('drawerToggleButton').focus());

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("OJET Team 20");
      self.isLoggedIn = ko.observable(false);

      // init database
      var dbReq = window.indexedDB.open("ojetDb", 3);
      (function initDb() {

        if (!window.indexedDB) {
          console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }
        dbReq.onsuccess = function (event) {
          db = dbReq.result;
        };
        dbReq.onupgradeneeded = function (event) {
          // Save the IDBDatabase interface 
          var db = event.target.result;
          self.db = db;
          // Create an objectStore for this database
          let userTable
          if (!db.objectStoreNames.contains('user')) {
            userTable = db.createObjectStore("user", { keyPath: "id", autoIncrement: true });
            userTable.createIndex("uname", "uname", { unique: true });
            userTable.createIndex("email", "email", { unique: true });
          }
          userTable.transaction.oncomplete = function () {
            console.log("database created successfully");
          }
        };
      }
      )();

      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
    }

    return new ControllerViewModel();
  }
);
