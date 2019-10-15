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
    self.numOfPosts = ko.observableArray([]);

    // Activity selection observables
    self.categorySelected = ko.observable(false);
    self.selectedCategory = ko.observable();
    self.firstSelectedCategory = ko.observable();

    //REST endpoint
    var RESTurl = `${api}/api/categories`;

    //User Token
    var userToken = sessionStorage.getItem("user_token");

    self.showCreateDialog = function(event) {
      document.getElementById("createDialog").open();
    };

    self.showEditDialog = function(event) {
      document.getElementById("editDialog").open();
    };

    self.selectedCategoryChanged = function(event) {
      // Check whether click is a category selection or deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display Category details
        // Populate items list observable using firstSelectedXxx API
        let { data } = self.firstSelectedCategory();
        self.categoryData(data);
        self.categorySelected(true);
      } else {
        // If deselection, hide list
        self.categorySelected(false);
      }
    };

    self.createCategory = function(event, data) {
      let title = self.newCategory.category_name;
      let description = self.newCategory.dsecription;
      console.log(title, description);
      $.ajax({
        url: `${RESTurl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { title, description },
        success: () => {
          self.fetchCategories();
        },
        error: err => console.log(err)
      });
      document.getElementById("createNewTitle").value = "";
      document.getElementById("createNewDesc").value = "";
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
                self.numberOfPosts(value.id);
                return value.id;
              })
            })
          );
        }
      });
    };

    self.updateCategorySubmit = function(event) {
      var categoryId = self.firstSelectedCategory().data.id;
      let category_name = self.firstSelectedCategory().data.category_name;
      let dsecription = self.firstSelectedCategory().data.dsecription;
      console.log(categoryId, category_name, dsecription);
      $.ajax({
        url: `${RESTurl}/update/${categoryId}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { title, description },
        success: res => {
          self.fetchCategories();
          self.categorySelected(false);
        },
        error: err => console.log(err)
      });
      document.getElementById("editDialog").close();
    };

    self.deleteCategory = function(event, data) {
      var categoryId = self.firstSelectedCategory().data.id;
      let categoryName = self.firstSelectedCategory().data.category_name;
      var really = confirm(
        "Are you sure you want to delete " + categoryName + "?"
      );
      if (really) {
        $.ajax({
          url: `${RESTurl}/${categoryId}`,
          headers: {
            Authorization: "Bearer " + userToken
          },
          method: "DELETE",
          success: res => {
            self.fetchCategories();
            self.categorySelected(false);
          },
          error: err => console.log(err)
        });
      }
    };

    self.numberOfPosts = function(category_id) {
      $.ajax({
        url: `${RESTurl}/posts/${category_id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken
        },
        success: resp => {
          let { data } = resp.data;
          self.numOfPosts.push(`${data.length}`);
        },
        error: err => console.log(err)
      });
    };

    self.fetchCategories();
  }

  return new CategoryViewModel();
});
