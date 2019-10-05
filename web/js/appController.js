<<<<<<< HEAD
/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define([
  "knockout",
  "ojs/ojmodule-element-utils",
  "ojs/ojknockouttemplateutils",
  "ojs/ojrouter",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojarraydataprovider",
  "ojs/ojoffcanvas",
  "ojs/ojmodule-element",
  "ojs/ojknockout"
], function(
  ko,
  moduleUtils,
  KnockoutTemplateUtils,
  Router,
  ResponsiveUtils,
  ResponsiveKnockoutUtils,
  ArrayDataProvider,
  OffcanvasUtils
) {
  function ControllerViewModel() {
    var self = this;

    this.KnockoutTemplateUtils = KnockoutTemplateUtils;

    // Media queries for repsonsive layouts
    var smQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
    );
    self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    var mdQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP
    );
    self.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

    // Router setup
    self.router = Router.rootInstance;
    self.router.configure({
      dashboard: { label: "Dashboard" },
      admin_dashboard: {label: "Admin_dashboard"},
      register: { label: "Register" },
      submission: { label: "Submission" },
      login: { label: "Login", isDefault: true},
      profile: { label: "User Profile" },
      password_reset: {label: "Reset password"}
  
    });
    Router.defaults["urlAdapter"] = new Router.urlParamAdapter();

    self.moduleConfig = ko.observable({ view: [], viewModel: null });

    self.loadModule = function() {
      ko.computed(function() {
        var name = self.router.moduleConfig.name();
        var viewPath = "views/" + name + ".html";
        var modelPath = "viewModels/" + name;
        var masterPromise = Promise.all([
          moduleUtils.createView({ viewPath: viewPath }),
          moduleUtils.createViewModel({ viewModelPath: modelPath })
        ]);
        masterPromise.then(function(values) {
          self.moduleConfig({ view: values[0], viewModel: values[1] });
        });git
      });
    };

    // Navigation setup
    var navData = [
      {
        name: "Login",
        id: "login"
      },
      {
        name: "Register",
        id: "register"
      },
      {
        name: "Dashboard",
        id: "dashboard"
      }
    ];
    self.navDataProvider = new ArrayDataProvider(navData, {
      keyAttributes: "id"
    });

    // Drawer
    // Close offcanvas on medium and larger screens
    self.mdScreen.subscribe(function() {
      OffcanvasUtils.close(self.drawerParams);
    });
    self.drawerParams = {
      displayMode: "push",
      selector: "#navDrawer",
      content: "#pageContent"
    };
    // Called by navigation drawer toggle button and after selection of nav drawer item
    self.toggleDrawer = function() {
      return OffcanvasUtils.toggle(self.drawerParams);
    };

  }

  return new ControllerViewModel();
});
=======
define(["knockout","ojs/ojmodule-element-utils","ojs/ojknockouttemplateutils","ojs/ojrouter","ojs/ojresponsiveutils","ojs/ojresponsiveknockoututils","ojs/ojarraydataprovider","ojs/ojoffcanvas","ojs/ojmodule-element","ojs/ojknockout"],function(e,o,r,a,t,s,i,n){return new function(){var l=this;this.KnockoutTemplateUtils=r;var d=t.getFrameworkQuery(t.FRAMEWORK_QUERY_KEY.SM_ONLY);l.smScreen=s.createMediaQueryObservable(d);var u=t.getFrameworkQuery(t.FRAMEWORK_QUERY_KEY.MD_UP);l.mdScreen=s.createMediaQueryObservable(u),l.router=a.rootInstance,l.router.configure({dashboard:{label:"Dashboard"},admin_dashboard:{label:"Admin_dashboard"},register:{label:"Register"},submission:{label:"Submission"},login:{label:"Login",isDefault:!0},profile:{label:"User Profile"},password_reset:{label:"Reset password"}}),a.defaults.urlAdapter=new a.urlParamAdapter,l.moduleConfig=e.observable({view:[],viewModel:null}),l.loadModule=function(){e.computed(function(){var e=l.router.moduleConfig.name(),r="views/"+e+".html",a="viewModels/"+e;Promise.all([o.createView({viewPath:r}),o.createViewModel({viewModelPath:a})]).then(function(e){l.moduleConfig({view:e[0],viewModel:e[1]})}),git})},l.navDataProvider=new i([{name:"Login",id:"login"},{name:"Register",id:"register"},{name:"Dashboard",id:"dashboard"}],{keyAttributes:"id"}),l.mdScreen.subscribe(function(){n.close(l.drawerParams)}),l.drawerParams={displayMode:"push",selector:"#navDrawer",content:"#pageContent"},l.toggleDrawer=function(){return n.toggle(l.drawerParams)}}});
>>>>>>> 47c204b670044215f192ee69f48a3830b599a9a9
