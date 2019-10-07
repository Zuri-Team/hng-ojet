define([
  "knockout",
  "ojs/ojmodel",
  "ojs/ojcollectiondataprovider",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojdialog",
  "ojs/ojinputtext"
], function(ko) {
  function categoryViewModel() {
    var self = this;

    self.Categories = ko.observableArray([]);
    self.dataProvider = ko.observable();
    self.categoryCol = ko.observable();
    self.categoryURL = "http://api.start.ng/api/categories";
    self.categoryData = ko.observable("");
    self.newCategory = ko.observableArray([]);
    self.selectedCategory = ko.observable();
    self.firstSelectedCategory = ko.observable();

    self.fetch = successCallBack => {
      //populate the collection by calling fetch()
      self.categoryCol().fetch({
        success: successCallBack,
        error: (jqXHR, textStatus, errorThrown) => {
          console.log(`Error in fetch: ${textStatus}`);
        }
      });
    };

    var parseCategory = response => {
      if (response) {
        return {
          title: response["title"],
          description: response["description"],
          id: response["id"]
        };
      }
    };

    //Create a model to store a category

    self.Category = oj.Model.extend({
      urlRoot: self.categoryURL,
      parse: parseCategory,
      idAttribute: "id"
    });

    // Instantiate a model
    var myCategory = new self.Category();

    // Create a base object "class" for the entire dataset
    self.categoryCollection = new oj.Collection(null, {
      url: self.categoryURL,
      model: myCategory,
      comparator: "id"
    });

    /* Create a specific instance for the  categories. 
    This will be filled with instances of the model "category" 
    for each record when the data is retrieved from our data service. */

    self.categoryCol(self.categoryCollection);
    self.dataProvider(new oj.CollectionDataProvider(self.categoryCol()));

    self.selectedCategoryChanged = event => {
      if (event.detail.value.length !== 0) {
        var categoryKey = self.firstSelectedCategory().data.id;
      }
    };

    // =========================== CREATE A CATEGORY =================================

    // Open and close create dialog modal
    self.showCreateDialog = function(event) {
      document.getElementById("createDialog").open();
    };

    self.createCategory = function(event) {
      var category = {
        title: self.newCategory().title,
        description: self.newCategory().description
      };

      console.log(category);

      /*  Use the categoryCollection's create() method to 
      write a new model to our data service. 
      This also adds this new model to the collection */

      self.categoryCollection.create(category, {
        wait: true, //This handles asynchronity as we need to wait for the server call before setting attributes
        contentType: "application/json",
        success: (model, response) => {
          console.log("Successfully created new category");
        },
        error: (jqXHR, textStatus, errorThrown) => {
          console.log(`Error in Create: ${textStatus}`);
        }
      });

      document.getElementById("createDialog").close();
    };

    // =========================== UPDATE A CATEGORY =================================

    // Open and close create dialog modal
    self.showEditDialog = function(event) {
      document.getElementById("editDialog").open();
    };

    self.editCategory = (id, data, event) => {
      //categoryCollection holds the current data
      var myCollection = self.categoryCollection;

      //newCategory holds the dialog data
      var myModel = myCollection.get(self.newCategory().id);
      myModel.parse = null;
      myModel.save(
        {
          title: self.newCategory().title,
          description: self.newCategory().description
        },
        {
          contentType: "application/json",
          success: (model, response) => {
            console.log(`response: ${JSON.stringify(response)}`);
            self.newCategory.valueHasMutated(); // This ensures that the page updates to reflect changes
          },
          error: (jqXHR, textStatus, errorThrown) => {
            console.log(`self.newCategory() -- ${jqXHR}`);
          }
        }
      );

      document.getElementById("editDialog").close();
    };

    // =========================== DELETE A CATEGORY =================================

    self.deleteCategory = (event, data) => {
      var categoryId = self.firstSelectedCategory().data.id;
      var categoryTitle = self.firstSelectedCategory().data.title;
      var model = self.categoryCollection.get(itemId);
      if (model) {
        var really = confirm(
          `Are you sure you want to delete ${categoryTitle} ?`
        );
        if (really) {
          // Removes from the visible collection
          self.categoryCollection.remove(model);

          //Removes the model from the data service
          model.destroy({
            data: JSON.stringify({ categoryId: categoryId }),
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    };
  }
  return new categoryViewModel();
});
