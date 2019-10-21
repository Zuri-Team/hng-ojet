define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojmodel",
  "ojs/ojlistview",
  "ojs/ojdialog",
  "ojs/ojvalidation-datetime"
], function(ko, $, api, ArrayDataProvider) {
  function postModel() {
    self = this;
    var RESTurl = `${api}/api/posts`;
    var userToken = sessionStorage.getItem("user_token");

    self.categories = ko.observableArray([]);

    // datetime converter
    self.formatDateTime = function(date) {
      var formatDateTime = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: "datetime",
        dateFormat: "medium",
        timeFormat: "short"
      });
      return formatDateTime.format(new Date(date).toISOString()); 
    };

    // form-data for new post
    self.category_id = ko.observable();
    self.newpost = ko.observable({});
    self.postSelected = ko.observable();
    self.post = ko.observable({});
    self.dataProvider = ko.observable();

    self.post_btn_toggler = ko.observable(false);
    self.post_view_title = ko.observable("New Post");

    // notification messages observable
    self.applicationMessages = ko.observableArray([]);

    //  fetch list of categories
    function fetchCategories() {
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

    self.post_view_toggle = () => {
      self.post_btn_toggler(!self.post_btn_toggler());
      self.post_view_title() == "New Post"
        ? self.post_view_title("My Posts")
        : self.post_view_title("New Post");
    };

    self.postSelectedChanged = () => {
      let { data } = self.postSelected();
      if (data != null) {
        self.post(data);
      }
    };

    self.viewPostModal = () => {
      document.getElementById("viewModal").open();
    };

    self.editPostModal = () => {
      document.getElementById("editModal").open();
    };

    self.deletePostModal = () => {
      document.getElementById("deleteModal").open();
    };

    self.createPost = () => {
      let category_id = self.category_id();
      let post_title = self.newpost().title;
      let post_body = self.newpost().body;
      $.ajax({
        url: `${RESTurl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { category_id, post_title, post_body },
        success: res => {
          if (res.status == true) {
            self.newpost({});
            self.fetchPost();
            self.post_btn_toggler(!self.post_btn_toggler());
            self.applicationMessages.push({
              severity: "confirmation",
              summary: "Post created successfully",
              autoTimeout: parseInt("0")
            });
          }
        },
        error: err => {
          console.log(err);
          self.applicationMessages.push({
            severity: "error",
            summary: "An error was encountered, unable to create post",
            autoTimeout: parseInt("0")
          });
        }
      });
    };

    self.fetchPost = () => {
      $.ajax({
        url: `${RESTurl}`,
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
                  // value.created_at = self.formatDateTime(value.created_at);
                  return value.post_title;
                })
              })
            );
          }
        }
      });
    };

    self.updatePost = () => {
      let category_id = self.category_id();
      let post_id = self.post().id;
      let post_title = self.post().post_title;
      let post_body = self.post().post_body;
      $.ajax({
        url: `${RESTurl}/${post_id}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "PUT",
        data: { category_id, post_title, post_body },
        success: res => {
          if (res.status == true) {
            // send a success message notification to the category view
            self.applicationMessages.push({
              severity: "confirmation",
              summary: "Post updated",
              detail: "A post has been updated",
              autoTimeout: parseInt("0")
            });
            self.fetchPost();
          }
        },
        error: err => {
          console.log(err);

          // send an error message notification to the category view
          self.applicationMessages.push({
            severity: "error",
            summary: "Error updating post",
            detail: "Error trying to update post",
            autoTimeout: parseInt("0")
          });
        }
      });
      document.getElementById("editModal").close();
    };

    self.deletePost = () => {
      let post_id = self.post().id;
      $.ajax({
        url: `${RESTurl}/${post_id}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "DELETE",
        success: () => {
          self.fetchPost();
          self.applicationMessages.push({
            severity: "confirmation",
            summary: "Post deleted",
            autoTimeout: parseInt("0")
          });
        },
        error: err => {
          console.log(err);
          self.applicationMessages.push({
            severity: "error",
            summary: "An error was encountered, could not delete post",
            autoTimeout: parseInt("0")
          });
        }
      });
      document.getElementById("deleteModal").close();
    };

    // listen for changes
    let pm = ko.dataFor(document.querySelector("#admin"));
    pm.selectedItem.subscribe(function() {
      if (pm.selectedItem() == "Posts") {
        self.categories([]);
        fetchCategories();
        self.fetchPost();
      }
    });
  }

  return new postModel();
});
