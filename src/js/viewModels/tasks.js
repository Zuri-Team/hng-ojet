define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
  'ojs/ojknockout',
  "ojs/ojmodel",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojdialog",
  "ojs/ojvalidation-datetime",
  "ojs/ojlabel",
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojvalidation-base",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojmessages",
  // "ojs/ojtimezonedata"
], function(oj, ko, $, api, ArrayDataProvider, PagingDataProviderView) {
  function taskModel() {
    var self = this;

    var userToken = sessionStorage.getItem("user_token");

    self.taskDataProvider = ko.observable(); //gets data for tasks list

    self.newTask = ko.observable({}); //holds data for the create task dialog

    self.viewSubmission = ko.observable(false);
    self.task_btn_toggler = ko.observable(false);
    self.task_view_title = ko.observable("New Task");

    self.task_view_toggle = () => {
      self.task_btn_toggler(!self.task_btn_toggler());
      self.task_view_title() == "New Task"
        ? self.task_view_title("Back")
        : self.task_view_title("New Task");
    };

    self.applicationMessages = ko.observableArray();
    self.track_id = ko.observable();


    var tracksURL = `${api}/api/track`;

    var tasksURL = `${api}/api/tasks`;

    self.dataProvider = ko.observable();

    // Task selection observables
    self.taskSelected = ko.observable();

    self.tracks = ko.observableArray([]);

    const RESTurl = `${api}/api/track/list`;

    self.taskSelectedChanged = function(event) {
      if (event.detail.value.length != 0) {
        let { data } = self.taskSelected();
      if (data == null) {
        return;
      } else {
        self.viewSubmission(true);
      }

      }
    };

    // datetime converter
    self.formatDateTime = date => {
      console.log(date);
      var formatDateTime = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: "datetime",
        dateFormat: "medium",
        timeFormat: "short",
        // timeZone: "Africa/Lagos"
      });

      return formatDateTime.format(new Date(date).toISOString());
    };

    function fetchTracks() {
      self.tracks([]);
      $.ajax({
        url: `${tracksURL}/list`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken
        },
        success: res => {
          let { data } = res.data;
          self.tracks(data.map(tracks => tracks));
        }
      });
    }

    self.fetchTasks = async () => {
      try {
        const response = await fetch(`${tasksURL}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const { data } = await response.json();

        self.taskDataProvider(
          new PagingDataProviderView(
            new ArrayDataProvider(data, {
              keys: data.map(function(value) {
                console.log(value)
                value.deadline = self.formatDateTime(value.deadline);
                return value.title;
              })
            })
          )
        );
      } catch (err) {
        console.log(err);
      }
    };

    self.createTask = () => {
      let track_id = self.track_id();
      let title = self.newTask().title;
      let body = self.newTask().body;
      let deadline = self.newTask().deadline;
      let is_active = self.newTask().is_active;

      $.ajax({
        method: "POST",
        url: `${tasksURL}`,
        headers: {
          Authorization: "Bearer " + userToken,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*"
        },
        data: JSON.stringify({
          track_id: track_id,
          title: title,
          body: body,
          deadline: deadline,
          is_active: is_active
        }),
        //contentType: "application/json",
        dataType: "json",
        //processData: true,
        success: res => {
          if (res.status == true) {
            self.newTask({});
            self.fetchTasks();
            self.task_btn_toggler(!self.task_btn_toggler());
            self.applicationMessages.push({
              severity: "confirmation",
              summary: "Task created successfully",
              autoTimeout: parseInt("0")
            });
          }
        },
        error: err => {
          console.log(err);
          self.applicationMessages.push({
            severity: "error",
            summary: "An error was encountered, unable to create task",
            autoTimeout: parseInt("0")
          });
        }
      });
    };

    fetchTracks();
    self.fetchTasks();
  }
  return new taskModel();
});
