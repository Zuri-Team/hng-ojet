define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
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
  "ojs/ojpagingdataproviderview",
  "ojs/ojmessages",
  "ojs/ojpagingcontrol",
  "ojs/ojtimezonedata"
], function(oj, ko, $, api, ArrayDataProvider, Paging) {
  function taskModel() {
    var self = this;

    var userToken = sessionStorage.getItem("user_token");

    self.taskDataProvider = ko.observable(); //gets data for tasks list

    self.taskData = ko.observable(""); //holds data for the Task details

    

    self.task_view_toggle = () => {
      self.task_btn_toggler(!self.task_btn_toggler());
      self.task_view_title() == "New Task"
        ? self.task_view_title("Back")
        : self.task_view_title("New Task");
    };

    self.applicationMessages = ko.observableArray();
    self.track_id = ko.observable();

    var trackTasksURL = `${api}/api/user/task`;

    var tasksURL = `${api}/api/tasks`;

    // var submissionURL = `${api}/api/submissions`;

    self.dataProvider = ko.observable();

    // Task selection observables
    self.taskSelected = ko.observable();

    self.tracks = ko.observableArray([]);

    const RESTurl = `${api}/api/track/list`;

    //   function fetchSubmission() {
    //     $.ajax({
    //       url: submissionURL,
    //       headers: {
    //         'Authorization': "Bearer " + userToken,
    //         'Access-Control-Allow-Origin': '*',
    // 					'Content-Type': 'application/json',

    // 					'Access-Control-Allow-Headers': '*'
    //       },
    //       method: "GET",

    //       success: ({status, data}) => {

    //         if (status == true) {
    //           self.submissionDataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttribute: 'task_id'})));
    //           console.log(data);
    //       }
    //     }
    //   });
    // }
    // fetchSubmission();

    self.viewTaskModal = function(event) {
      document.getElementById("viewModal").open();
    };

    self.taskSelectedChanged = () => {
      let { data } = self.taskSelected();
      if (data != null) {
        console.log(data);
        self.taskData(data);
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
        timeZone: "Africa/Lagos"
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
        const response = await fetch(`${trackTasksURL}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const { data } = await response.json();

        self.taskDataProvider(
          new Paging(
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

    self.fetchTasks();
  }
  return new taskModel();
});