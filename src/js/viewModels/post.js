define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojmodel",
  "ojs/ojlistview"
], function(ko, $, api, ArrayDataProvider) {
  function postModel() {
    self = this;
    self.categories = ko.observableArray([]);
    self.selectedCat = ko.observable();
    self.newpost = ko.observable();
    self.post_title = ko.observable();
    self.dataProvider = ko.observable();
    var userToken = sessionStorage.getItem("user_token");
    
    function fetchposts() {
      $.ajax({
        url: `https://api.start.ng/api/posts`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: res => {
          if (res.status == true) {
            let { data } = res.data;
            self.dataProvider(
              new ArrayDataProvider(data, {
                keys: data.map(function(value) {
                  return value.post_title;
                })
              })
            );
          }
        }
      });
    }

    function reset() {
      self.newpost("");
      self.post_title("");
    }

    self.createPost = () => {
      let category_id = self.selectedCat();
      let post_title = self.post_title();
      let post_body = self.newpost();

      $.ajax({
        url: `https://api.start.ng/api/posts`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { category_id, post_title, post_body },
        success: res => {
          if (res.status == true) {
            reset();
            fetchposts();
          }
        }
      });
    };

    //  fetch list of categories 
    $.ajax({
      url: `https://api.start.ng/api/categories`,
      headers: {
        Authorization: "Bearer " + " " + userToken
      },
      method: "GET",
      success: res => {
        res.data.map(cats => {
          self.categories.push(cats);
        });
      }
    });

    fetchposts();
  }

  return new postModel();
});
