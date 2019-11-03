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
    "ojs/ojrouter",
    "ojs/ojmodule-element",
    "ojs/ojknockout"
], function(ko, moduleUtils, Router) {
    function ControllerViewModel() {
        var self = this;

        // Router setup
        self.router = Router.rootInstance;
        self.router.configure({
            dashboard: { label: "Dashboard" },
            admin_dashboard: { label: "Admin_dashboard" },
            user_dashboard: { label: "User_dashboard" },
            register: { label: "Register" },
            login: { label: "Login", isDefault: true },
            password_reset: { label: "Reset password" },
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
                });
            });
        };
    }
    return new ControllerViewModel();
});