define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojmodel",
  "ojs/ojlistview"
], function(ko, $, api, ArrayDataProvider) {
  function internCategory() {
    let self = this;
    self.categoryDataProvider = ko.observable(); //gets data for Categories list

    var RESTurl = `${api}/api/categories`;
    var userToken = sessionStorage.getItem("user_token");

    let fetchCategories = function() {
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
    let pm = ko.dataFor(document.querySelector("#user"));
    pm.selectedItem.subscribe(function() {
      if (pm.selectedItem() == "Categories") {
        fetchCategories();
      }
    });
  }
  return new internCategory();
});
