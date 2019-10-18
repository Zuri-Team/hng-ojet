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

    // form-data for new post
    self.category_id = ko.observable();
    self.post_body = ko.observable();
    self.post_title = ko.observable();

    self.dataProvider = ko.observable();

    self.post_btn_toggler = ko.observable(false);
    self.post_view_title = ko.observable("New Post");

    // notification messages observable
    self.applicationMessages = ko.observableArray([]);

    self.post_view_toggle = function() {
      self.post_btn_toggler(!self.post_btn_toggler());
      self.post_view_title() == "New Post"
        ? self.post_view_title("My Posts")
        : self.post_view_title("New Post");
    };
    var userToken = sessionStorage.getItem("user_token");

    function fetchposts() {
      $.ajax({
        url: `${api}/api/posts`,
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
      self.post_body("");
      self.post_title("");
    }

    self.newpost = () => {
      let category_id = self.category_id();
      let post_title = self.post_title();
      let post_body = self.post_body();
      console.log(category_id, post_title, post_body);
      $.ajax({
        url: `${api}/api/posts`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { category_id, post_title, post_body },
        success: res => {
          if (res.status == true) {
            // send a success message notification to the category view
            self.applicationMessages.push({
              severity: "confirmation",
              summary: "Post created",
              detail: "A new post has been created",
              autoTimeout: parseInt("0")
            });
            reset();
            fetchposts();
            self.post_btn_toggler(!self.post_btn_toggler());
          }
        },
        error: err => {
          console.log(err);

          // send an error message notification to the category view
          self.applicationMessages.push({
            severity: "error",
            summary: "Error creating post",
            detail: "Error trying to create post",
            autoTimeout: parseInt("0")
          });
        }
      });
    };

    //  fetch list of categories
    function fetchCategories() {
      self.categories([]);
      $.ajax({
        url: `${api}/api/categories`,
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
    }

    let pm = ko.dataFor(document.querySelector("#admin"));
    pm.selectedItem.subscribe(function() {
      if (pm.selectedItem() == "Posts") {
        console.log(pm.selectedItem());
        fetchCategories();
        fetchposts();
      }
    });
  }

  return new postModel();
});
