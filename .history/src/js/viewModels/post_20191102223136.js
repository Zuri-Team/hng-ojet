define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
  "../ckeditor",
  "ojs/ojmodel",
  "ojs/ojlistview",
  "ojs/ojdialog",
  "ojs/ojvalidation-datetime",
  "ojs/ojtimezonedata",
  "ojs/ojmessages",
  "ojs/ojpagingcontrol"
], function(ko, $, api, ArrayDataProvider, Paging, ClassicEditor) {
  function postViewModel() {
    let self = this;
    var RESTurl = `${api}/api/posts`;
    var userToken = sessionStorage.getItem("user_token");

    //  integrated wysiwyg editor is stored as an observable
    self.editor = ko.observable();
    self.edit = ko.observable();

    // form data instantiated as an observable.
    self.category_id = ko.observable();
    self.post_title = ko.observable();
    self.postSelected = ko.observable();
    self.post = ko.observable({}); // when a post is selected from a list, it's data is saved into the post variable below.
    self.dataProvider = ko.observable(); // dataprovider which holds an array of posts.

    self.categories = ko.observableArray([]); // categories array

    // notification messages observable
    self.applicationMessages = ko.observableArray([]);

    self.fullpost = ko.observable(false);
    self.postpg = ko.observable("d-block");

    self.post_view_toggle = () => {
      $(".pd").toggleClass("d-none");
    };

    self.postSelectedChanged = () => {
      let { data } = self.postSelected();
      if (data != null) {
        self.post(data);
      }
    };

    function fetchCategories() {
      self.categories([]);
      $.ajax({
        url: `${api}/api/categories`,
        headers: {
          Authorization: "Bearer " + " " + userToken
        },
        method: "GET",
        success: res => {
          self.categories(res.data.map(cats => cats));
        }
      });
    }

    self.viewPost = () => {
      self.fullpost(true);
      self.postpg("d-none");
    };

    self.editPostModal = () => {
      self.postpg("d-none");
      document.getElementById("edit_post").style.display = "block";
      setTimeout(function() {
        self.edit().setData(self.post().post_body);
      }, 0);
    };

    self.close_edit = () => {
      document.getElementById("edit_post").style.display = "none";
      self.postpg("d-block");
    };

    self.deletePostModal = () => {
      document.getElementById("deleteModal").open();
    };

    // datetime converter
    self.formatDateTime = date => {
      var formatDateTime = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: "datetime",
        dateFormat: "medium",
        timeFormat: "short",
        timeZone: "Africa/Lagos"
      });

      return formatDateTime.format(new Date(date).toISOString());
    };

    self.createPost = () => {
      let category_id = self.category_id();
      let post_title = self.post_title();
      let post_body = self.editor().getData();
      console.log(post_body);
      $.ajax({
        url: `${RESTurl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { category_id, post_title, post_body },
        success: res => {
          if (res.status == true) {
            self.fetchPost();
            self.post_title("");
            self.editor().setData("");
            $(".pd").toggleClass("d-none");
            self.applicationMessages.push({
              severity: "confirmation",
              summary: "Post created successfully",
              autoTimeout: parseInt("0")
            });
          }
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
              new Paging(
                new ArrayDataProvider(data, {
                  keys: data.map(function(value) {
                    value.created_at = self.formatDateTime(value.created_at);
                    return value.post_title;
                  })
                })
              )
            );
          }
        }
      });
    };

    self.updatePost = () => {
      let category_id = self.category_id();
      let post_id = self.post().id;
      let post_title = self.post().post_title;
      let post_body = self.edit().getData();
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
            self.edit().setData("");
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

      self.close_edit();
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
      self.close_edit();
    };
    fetchCategories();
    self.fetchPost();
    // listen for changes
    let pm = ko.dataFor(document.querySelector("#admin"));
    pm.selectedItem.subscribe(function() {
      if (pm.selectedItem() == "Posts") {
        fetchCategories();
        self.fetchPost();
      }
    });

    self.handleAttached = () => {
      ClassicEditor.create(document.getElementById("postbody"), {
        simpleUpload: {
          // The URL the images are uploaded to.
          uploadUrl: "http://example.com",

          // Headers sent along with the XMLHttpRequest to the upload server.
          headers: {
            "X-CSRF-TOKEN": "CSFR-Token",
            Authorization: "Bearer " + userToken
          }
        }
      }).then(editor => self.editor(editor));
      ClassicEditor.create(document.getElementById("editpost")).then(editor =>
        self.edit(editor)
      );
    };
  }

  return new postViewModel();
});
