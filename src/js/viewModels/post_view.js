define(['ojs/ojcore', 'knockout', "jquery", "./api", 'ojs/ojmessages', "ojs/ojdialog",
"ojs/ojvalidation-datetime",
"ojs/ojlabel",
"ojs/ojinputtext",
"ojs/ojformlayout",
"ojs/ojvalidation-base",
"ojs/ojselectcombobox", 'ojs/ojoption', "ojs/ojtimezonedata"],
function(oj, ko, $, api) {
function PostViewModel(params) {
  var self = this;
  self.hidePost = ko.observable();
  self.listRefresh = ko.observable();

  // Post View observables
  self.post_title = ko.observable("");
  self.created_at = ko.observable("");
  self.category_name = ko.observable("");
  self.post_body = ko.observable("");
  self.fullname = ko.observable("");

  self.categories = ko.observableArray([]);
  self.category_id = ko.observable();


// extract the post ID we have to work with
const post_id = params.postModel().data.id;

  // notification messages observable
self.applicationMessages = ko.observableArray([]);



var RESTurl = `${api}/api/posts`;

  var userToken = sessionStorage.getItem("user_token");

  self.toPosts = () => {
    self.hidePost(params.hidePost(false));
    self.listRefresh(params.listRefresh());
  }

  self.deleteModal = () => {
    document.getElementById("deleteModal").open();
  };

  self.editModal = () => {
    document.getElementById("editModal").open();
  };

  // datetime converter
  self.formatDateTime = date => {
    var formatDateTime = oj.Validation.converterFactory(
      oj.ConverterFactory.CONVERTER_TYPE_DATETIME
    ).createConverter({
      formatType: "datetime",
      dateFormat: "medium",
      timeFormat: "short",
      isoStrFormat: "local",
      timeZone: "Africa/Lagos"
    });

    return formatDateTime.format(new Date(date).toISOString());
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

  fetchCategories();




  //Updates Post

  self.updatePost = function(event) {
    let category_id = self.category_id();
      let post_title = self.post_title();
      let post_body = self.post_body();

    $.ajax({
      method: "PUT",
      url: `${RESTurl}/${post_id}`,
      headers: {
        Authorization: "Bearer " + userToken
        // "Access-Control-Allow-Origin": "*",
        // "Content-Type": "application/json",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Headers": "*"
      },
      data: { category_id, post_title, post_body },
      success: res => {
        if (res.status == true) {
          // send a success message notification to the category view
          document.getElementById("editModal").close();
          self.fetchPost();
          self.applicationMessages.push({
            severity: "confirmation",
            summary: "Post updated",
            detail: "Post successfully updated",
            autoTimeout: parseInt("0")
          });
        }
      },
      error: err => {
        console.log(err);

        // send an error message notification to the post view
        self.applicationMessages.push({
          severity: "error",
          summary: "Error updating post",
          detail: "Error trying to update post",
          autoTimeout: parseInt("0")
        });
      }
    });


  };

  self.deletePost = () => {
    $.ajax({
      url: `${RESTurl}/${post_id}`,
      headers: {
        Authorization: "Bearer " + userToken
      },
      method: "DELETE",
      success: () => {
        document.getElementById("deleteModal").close();
        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Post deleted",
          autoTimeout: parseInt("0")
        });
        self.listRefresh(params.listRefresh());
        setTimeout(() => self.hidePost(params.hidePost(false)), 1000);
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
  };

  self.fetchPost = async() => {
    try {
      const response = await fetch(`${RESTurl}/view/${post_id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      const { data } = await response.json();

      self.post_title(`${data.post_title}`);
      self.category_name(`${data.category.title}`);
      self.created_at(self.formatDateTime(`${data.created_at}`));
      self.fullname(`${data.user.firstname} ${data.user.lastname}`);
      self.post_body(`${data.post_body}`)
    } catch (err) {
      console.log(err);
    }
  };
  self.fetchPost();
}

return PostViewModel;
});