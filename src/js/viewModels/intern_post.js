define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
  "ojs/ojmodel",
  "ojs/ojlistview",
  "ojs/ojdialog",
  "ojs/ojvalidation-datetime",
  "ojs/ojtimezonedata",
  "ojs/ojpagingcontrol"
], function(ko, $, api, ArrayDataProvider, Paging) {
  function postModel() {
    self = this;
    var RESTurl = `${api}/api/posts`;
    var userToken = sessionStorage.getItem("user_token");

    self.postSelected = ko.observable();
    self.post = ko.observable({});
    self.dataProvider = ko.observable();
    self.categories;

    self.postSelectedChanged = () => {
      let { data } = self.postSelected();
      if (data != null) {
        self.post(data);
        self.viewPostModal(data)
      }
    };

    function fetchCategories() {
      self.categories = ko.observableArray([]);
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

    self.viewPostModal = data => {
      $("#viewModal").attr("title", data.post_title);
      document.getElementById("viewModal").open();
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

    fetchCategories();
    self.fetchPost();
    // listen for changes
    let pm = ko.dataFor(document.querySelector("#user"));
    pm.selectedItem.subscribe(function() {
      if (pm.selectedItem() == "Posts") {
        fetchCategories();
        self.fetchPost();
      }
    });
  }

  return new postModel();
});
