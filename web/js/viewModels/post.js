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
            reset();
            fetchposts();
            self.post_btn_toggler(!self.post_btn_toggler());
          }
        }
      });
    };

    //  fetch list of categories
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

    fetchposts();
  }

  return new postModel();
});
