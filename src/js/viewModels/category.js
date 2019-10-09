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
  "ojs/ojlabel",
  "ojs/ojchart",
  "ojs/ojlistview",
  "ojs/ojarraydataprovider",
  "ojs/ojavatar",
  "ojs/ojmodel",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojdialog",
  "ojs/ojinputtext"
], function(oj, ko, $) {
  function CategoryViewModel() {
    var self = this; //generated code

    

    /**
     * Declare observables and read data from JSON file
     */
    // Master list and detail list observables
    self.categoryDataProvider = ko.observable(); //gets data for Categories list

    self.categoryData = ko.observable(""); //holds data for the Category details
    self.newCategory = ko.observableArray([]); //newItem holds data for the create item dialog

    // Activity selection observables
    self.categorySelected = ko.observable(false);
    self.selectedCategory = ko.observable();
    self.firstSelectedCategory = ko.observable();

    //REST endpoint
    var RESTurl = "https://api.start.ng/api/categories";
    
    //User Token
    var userToken = sessionStorage.getItem("user_token");

    //Single line of data
    var categoryModel = oj.Model.extend({
      urlRoot: RESTurl,
      idAttribute: "id"
    });

    //Multiple models i.e. multiple lines of data
    self.categoryCollection = new oj.Collection(null, {
      url: RESTurl,
      model: categoryModel,
      comparator: "id"
    });

    /*
     *An observable called categoryDataProvider is already bound in the View file
     *from the JSON example, so you don't need to update category.html
     */
    self.categoryDataProvider(
      new oj.CollectionTableDataSource(self.categoryCollection)
    );

    self.categoryCollection.fetch({
      wait: true, //Waits for the server call before setting attributes
      method: "GET",
      contentType: "application/json",
      headers: {
        "Authorization":
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRlOTllZGZkODU5NzJiMTdhZDZlNmU1ZGZjMThjMjVhNzVhNzlhN2MyM2ExZDIyNTU4OTM3ZDRjOGRjM2VlMzgwMTExOGI4ODZlZTYyM2M5In0.eyJhdWQiOiIyOSIsImp0aSI6ImRlOTllZGZkODU5NzJiMTdhZDZlNmU1ZGZjMThjMjVhNzVhNzlhN2MyM2ExZDIyNTU4OTM3ZDRjOGRjM2VlMzgwMTExOGI4ODZlZTYyM2M5IiwiaWF0IjoxNTcwNjM1NzI5LCJuYmYiOjE1NzA2MzU3MjksImV4cCI6MTYwMjI1ODEyOSwic3ViIjoiNCIsInNjb3BlcyI6W119.AFE7_2DXqOZaWPu4VoRRrXPddbcuSn4sXhrt5aUiAWl-ttuWObg4L1uZ_NFffB3QRWTWcfbTh5PoVxgzv-Q5vgIw99QG--G3X2ahNvwlGqjMUKH_oVThcSqXq2NPPCVuRLqR9fl1FX6AdSZQrdAqgAlmJLvJwWm4vfGO4OPgThdWFnoZ4GMvOHVVxbu3Bmv3LyvY_9x2lCPqprZ87d0A3WZplJrM2i6W7XpCrzSsuj1fTjMKE1M1L6PupfGFWwP65ouzS1hxdFh084wMoztaWO4tKalks4y7BqVmnvxlQW6Rt7QcuF1aQrrlAcFN3pKIUih7Agz87MkDb2ScNDrvGsD9lq0tin0MtjgVqXUBCWNUacPtLtG3vqX0hLGdiDdzhdK_2G6xDOzZBu5bbj32qzoKiZFDPXfBKPbHXkp_giQBp0nLosod1gD_3VGqlABkWHHRNCxBJ_9cNnalV-pKxuX0iPkfok1cgFE9YaoxBxHvmIe-I3-FK8_1xtKi8VzdzZ5per3NGvES62XXj39go2IoDpwakiGKAPEh1pLUgL3CDTo7Tp6v5dzqHfPiT2aXg945zEZNkCA-Bu7EpGwYE8tIaUL4JMVgRhU38fUeJ4L8pjXWQkBRe3oyvIQP--yfpO-FzdqAPNsR46r7iZHVuEdiMdeE0ReCTCCYDc3z9bI"
      },
      success: function(model, response) {
        console.log("Successfully created new category");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("Error in Create: " + textStatus);
      }
    });

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

    self.showCreateDialog = function(event) {
      document.getElementById("createDialog").open();
    };

    self.createCategory = function(event, data) {
      var recordAttrs = {
        category_name: data.newCategory.category_name,
        dsecription: data.newCategory.dsecription
      };

      /*
          The categoryCollection variable is a Collection object that uses the
          create() function to write a new model to the data service.
          It also adds this new model to the collection.
          */

      self.categoryCollection.create(recordAttrs, {
        wait: true, //Waits for the server call before setting attributes
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Authorization":
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRlOTllZGZkODU5NzJiMTdhZDZlNmU1ZGZjMThjMjVhNzVhNzlhN2MyM2ExZDIyNTU4OTM3ZDRjOGRjM2VlMzgwMTExOGI4ODZlZTYyM2M5In0.eyJhdWQiOiIyOSIsImp0aSI6ImRlOTllZGZkODU5NzJiMTdhZDZlNmU1ZGZjMThjMjVhNzVhNzlhN2MyM2ExZDIyNTU4OTM3ZDRjOGRjM2VlMzgwMTExOGI4ODZlZTYyM2M5IiwiaWF0IjoxNTcwNjM1NzI5LCJuYmYiOjE1NzA2MzU3MjksImV4cCI6MTYwMjI1ODEyOSwic3ViIjoiNCIsInNjb3BlcyI6W119.AFE7_2DXqOZaWPu4VoRRrXPddbcuSn4sXhrt5aUiAWl-ttuWObg4L1uZ_NFffB3QRWTWcfbTh5PoVxgzv-Q5vgIw99QG--G3X2ahNvwlGqjMUKH_oVThcSqXq2NPPCVuRLqR9fl1FX6AdSZQrdAqgAlmJLvJwWm4vfGO4OPgThdWFnoZ4GMvOHVVxbu3Bmv3LyvY_9x2lCPqprZ87d0A3WZplJrM2i6W7XpCrzSsuj1fTjMKE1M1L6PupfGFWwP65ouzS1hxdFh084wMoztaWO4tKalks4y7BqVmnvxlQW6Rt7QcuF1aQrrlAcFN3pKIUih7Agz87MkDb2ScNDrvGsD9lq0tin0MtjgVqXUBCWNUacPtLtG3vqX0hLGdiDdzhdK_2G6xDOzZBu5bbj32qzoKiZFDPXfBKPbHXkp_giQBp0nLosod1gD_3VGqlABkWHHRNCxBJ_9cNnalV-pKxuX0iPkfok1cgFE9YaoxBxHvmIe-I3-FK8_1xtKi8VzdzZ5per3NGvES62XXj39go2IoDpwakiGKAPEh1pLUgL3CDTo7Tp6v5dzqHfPiT2aXg945zEZNkCA-Bu7EpGwYE8tIaUL4JMVgRhU38fUeJ4L8pjXWQkBRe3oyvIQP--yfpO-FzdqAPNsR46r7iZHVuEdiMdeE0ReCTCCYDc3z9bI"
        },
        success: function(model, response) {
          console.log("Successfully created new category");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("Error in Create: " + textStatus);
        }
      });
      document.getElementById("createDialog").close();
    };

    self.showEditDialog = function(event) {
      document.getElementById("editDialog").open();
    };

    self.updateCategorySubmit = function(event) {
      //categoryCollection holds the current data
      var myCollection = self.categoryCollection;
      //categoryData holds the dialog data
      var myModel = myCollection.get(self.categoryData().id);
      myModel.parse = null;
      myModel.save(
        {
          category_name: self.categoryData().category_name,
          dsecription: self.itemData().dsecription
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:
              "Bearer ${userToken}"
          },
          success: function(model, response) {
            console.log("response: " + JSON.stringify(response));
            self.categoryData.valueHasMutated();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(self.categoryData().id + " -- " + jqXHR);
          }
        }
      );
      document.getElementById("editDialog").close();
    };

    self.deleteCategory = function(event, data) {
      var categoryId = self.firstSelectedCategory().data.id;
      var categoryName = self.firstSelectedCategory().data.category_name;
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
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Authorization":
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRlOTllZGZkODU5NzJiMTdhZDZlNmU1ZGZjMThjMjVhNzVhNzlhN2MyM2ExZDIyNTU4OTM3ZDRjOGRjM2VlMzgwMTExOGI4ODZlZTYyM2M5In0.eyJhdWQiOiIyOSIsImp0aSI6ImRlOTllZGZkODU5NzJiMTdhZDZlNmU1ZGZjMThjMjVhNzVhNzlhN2MyM2ExZDIyNTU4OTM3ZDRjOGRjM2VlMzgwMTExOGI4ODZlZTYyM2M5IiwiaWF0IjoxNTcwNjM1NzI5LCJuYmYiOjE1NzA2MzU3MjksImV4cCI6MTYwMjI1ODEyOSwic3ViIjoiNCIsInNjb3BlcyI6W119.AFE7_2DXqOZaWPu4VoRRrXPddbcuSn4sXhrt5aUiAWl-ttuWObg4L1uZ_NFffB3QRWTWcfbTh5PoVxgzv-Q5vgIw99QG--G3X2ahNvwlGqjMUKH_oVThcSqXq2NPPCVuRLqR9fl1FX6AdSZQrdAqgAlmJLvJwWm4vfGO4OPgThdWFnoZ4GMvOHVVxbu3Bmv3LyvY_9x2lCPqprZ87d0A3WZplJrM2i6W7XpCrzSsuj1fTjMKE1M1L6PupfGFWwP65ouzS1hxdFh084wMoztaWO4tKalks4y7BqVmnvxlQW6Rt7QcuF1aQrrlAcFN3pKIUih7Agz87MkDb2ScNDrvGsD9lq0tin0MtjgVqXUBCWNUacPtLtG3vqX0hLGdiDdzhdK_2G6xDOzZBu5bbj32qzoKiZFDPXfBKPbHXkp_giQBp0nLosod1gD_3VGqlABkWHHRNCxBJ_9cNnalV-pKxuX0iPkfok1cgFE9YaoxBxHvmIe-I3-FK8_1xtKi8VzdzZ5per3NGvES62XXj39go2IoDpwakiGKAPEh1pLUgL3CDTo7Tp6v5dzqHfPiT2aXg945zEZNkCA-Bu7EpGwYE8tIaUL4JMVgRhU38fUeJ4L8pjXWQkBRe3oyvIQP--yfpO-FzdqAPNsR46r7iZHVuEdiMdeE0ReCTCCYDc3z9bI"
            }
          });
        }
      }
    };

    /**
     * This section is standard navdrawer starter template code
     */
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
    self.connected = function() {
      // Implement if needed
      console.log(sessionStorage.getItem("user_token"));
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

    /**
     * Optional ViewModel method invoked after transition to the new View is complete.
     * That includes any possible animation between the old and the new View.
     */
    self.transitionCompleted = function() {
      // Implement if needed
    };
  }

  /*
   * Returns a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.  Return an instance of the ViewModel if
   * only one instance of the ViewModel is needed.
   */
  return new CategoryViewModel();
});
