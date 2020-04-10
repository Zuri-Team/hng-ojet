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
    let self = this;
    let RESTurl = `${api}/api/posts`;
    let userToken = localStorage.getItem("user_token");

    self.postSelected = ko.observable();
    self.post = ko.observable({});
    self.fullpost = ko.observable(false);
    self.dataProvider = ko.observable();
    self.categories = ko.observableArray([]);
    self.category_id = ko.observable();
    self.postpg = ko.observable("d-block");

    self.postSelectedChanged = () => {
      let { data } = self.postSelected();
      if (data != null) {
        self.post(data);
        self.fullpost(true);
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

        var values = date.split(/[^0-9]/),
        year = parseInt(values[0], 10),
        month = parseInt(values[1], 10) - 1, // Month is zero based, so subtract 1
        day = parseInt(values[2], 10),
        hours = parseInt(values[3], 10),
        minutes = parseInt(values[4], 10),
        seconds = parseInt(values[5], 10);

        //formattedDate = new Date(year, month, day, hours, minutes, seconds);

      // return formatDateTime.format(new Date(date).toISOString());
      return formatDateTime.format(new Date(year, month, day, hours, minutes, seconds).toISOString());
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
    self.filterpost = function() {
      let catId = self.category_id();
      catId == undefined ? self.fetchPost() : self.posts_under_category(catId);
    };

    self.posts_under_category = function(category_id) {
      $.ajax({
        url: `${api}/api/categories/posts/${category_id}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: res => {
          let { data } = res.data;

          self.dataProvider(
            new Paging(
              new ArrayDataProvider(data, {
                keys: data.map(function(value) {
                  value.category = { title: null };
                  value.created_at = self.formatDateTime(value.created_at);
                  return value.id;
                })
              })
            )
          );
        }
      });
    };

    self.search = ko.observable(false);

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
