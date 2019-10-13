define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojmodel",
  "ojs/ojlistview"
], function(ko, $, api, ArrayDataProvider) {
  function taskModel() {
    self = this;
    self.tasks = ko.observableArray([]);
    self.selectedCat = ko.observable();
    self.title = ko.observable();
    self.body = ko.observable();
    self.deadline = ko.observable();
    self.is_active = ko.observable();
    //self.status = ko.observable();
    self.dataProvider = ko.observable(["", ""]);

    var userToken = sessionStorage.getItem("user_token");

    let RESTUrl = `${api}/api/tasks`;

    self.fetchTasks = () => {
      $.ajax({
        url: `${RESTUrl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: res => {
          console.log(res);
          // if (res.status == true) {
          //     let { data } = res.data;
          //     self.dataProvider(
          //         new ArrayDataProvider(data, {
          //             keys: data.map(function (value) {
          //                 return value.post_title;
          //             })
          //         })
          //     );
          // }
        }
      });
    };

    self.createTask = () => {
      $.ajax({
        url: `${RESTUrl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: {
          title: self.title(),
          body: self.body(),
          deadline: self.deadline(),
          status: self.status
        },
        success: res => {
          if (res.status == true) {
            fetchTasks();
          }
        },
        error: err => console.log(err)
      });
    };

    // self.fetchTasks();
  }

  return new taskModel();
});
