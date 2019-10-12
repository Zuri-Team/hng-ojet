/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojlabel",
  "ojs/ojlistview",
  "ojs/ojmodel",
  "ojs/ojdialog",
  "ojs/ojinputtext"
], function(oj, ko, $, api, ArrayDataProvider) {
  function CategoryViewModel() {
    var self = this;

    self.categoryDataProvider = ko.observable(); //gets data for Categories list
    self.categoryData = ko.observable(""); //holds data for the Category details
    self.newCategory = ko.observableArray([]); //newItem holds data for the create item dialog

    // Activity selection observables
    self.categorySelected = ko.observable(false);
    self.selectedCategory = ko.observable();
    self.firstSelectedCategory = ko.observable();

    //REST endpoint
    var RESTurl = `https://api.start.ng/api/categories`;

    //User Token
    var userToken = sessionStorage.getItem("user_token");

    self.showCreateDialog = function(event) {
      document.getElementById("createDialog").open();
    };

    self.showEditDialog = function(event) {
      document.getElementById("editDialog").open();
    };

    /**
     * Handle selection from Categories list
     */
    self.selectedCategoryChanged = function(event) {
      // Check whether click is a category selection or deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display Category details
        // Populate items list observable using firstSelectedXxx API
        self.categoryData(self.firstSelectedCategory().data);

        self.categorySelected(true);
      } else {
        // If deselection, hide list
        self.categorySelected(false);
      }
    };

    self.createCategory = function(event, data) {
      let title = data.newCategory.category_name;
      let description = data.newCategory.description;
      console.log(title, description);
      $.ajax({
        url: `${RESTurl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { title, description },
        success: res => {
          let { data } = res;
          console.log(data);
          self.categoryDataProvider(
            new ArrayDataProvider(data, {
              keys: data.map(function(value) {
                return value.id;
              })
            })
          );
        },
        error: err => {
          console.log(err);
        }
      });
      document.getElementById("createDialog").close();
    };

    self.fetchCategories = function() {
      $.ajax({
        url: `${RESTurl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: res => {
          let { data } = res;
          self.categoryDataProvider(
            new ArrayDataProvider(data, {
              keys: data.map(function(value) {
                return value.id;
              })
            })
          );
        }
      });
    };

    self.updateCategorySubmit = function(event) {
      let title = self.categoryData().category_name;
      let description = self.categoryData().dsecription;
      let id = self.categoryData().id;

      let data = { title, description };
      console.log(title, description, id);

        $.ajax({
          url: `${RESTurl}/${id}`,
          headers: {
            Authorization: "Bearer " + userToken
          },
          method: "PATCH",
          data: data,
          success: res => {
            console.log(res.data)
            self.categoryDataProvider(
              new ArrayDataProvider(res.data, {
                keys: data.map(function(value) {
                  return value.id;
                })
              })
            );
          }
        });

      document.getElementById("editDialog").close();
    };

    self.deleteCategory = function(event, data) {
      var categoryId = self.firstSelectedCategory().data.id;
      var categoryName = self.firstSelectedCategory().data.title;
      var model = self.categoryCollection.get(categoryId);
      if (model) {
        var really = confirm(
          "Are you sure you want to delete " + categoryName + "?"
        );
        if (really) {
          //Removes the model from the visible collection
          self.categoryCollection.remove(model);
          //Removes the model from the data service
          model.destroy({
            data: JSON.stringify({ categoryId: categoryId }),
            wait: true, //Waits for the server call before setting attributes
            ContentType: "application/json",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + userToken
            }
          });
        }
      }
    };
    self.fetchCategories();
    self.connected = function() {
      // Implement if needed
      // console.log(sessionStorage.getItem("user_token"));
      if (sessionStorage.getItem("user_token") == null) {
        router.go("login");
      }
    };

    /**
     * Optional ViewModel method invoked after the View is disconnected from the DOM.
     */
    self.disconnected = function() {
      // Implement if needed
      //self.activitySelected(false);
      //self.itemSelected(false);
    };

    self.transitionCompleted = function() {
      // Implement if needed
    };
  }

  return new CategoryViewModel();
});
