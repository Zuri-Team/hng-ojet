define(['ojs/ojcore', 'knockout', "jquery", "./api", "ojs/ojarraydataprovider", 'ojs/ojpagingdataproviderview', 'ojs/ojmessages', "ojs/ojdialog",
"ojs/ojvalidation-datetime",
"ojs/ojlabel",
"ojs/ojinputtext",
"ojs/ojformlayout",
"ojs/ojvalidation-base",
"ojs/ojselectcombobox",
"ojs/ojdatetimepicker",
'ojs/ojtable', 'ojs/ojoption', "ojs/ojtimezonedata"],
function(oj, ko, $, api, ArrayDataProvider, PagingDataProviderView) {
function TaskSubmissionsModel(params) {
  var self = this;
  self.hideSubmissions = ko.observable();
  self.listRefresh = ko.observable();

  // Task submission observables
  self.title = ko.observable("");
  self.deadline = ko.observable("");
  self.submission_link = ko.observable("");
  self.submitted_on = ko.observable("");
  self.body = ko.observable("");
  self.grade = ko.observable("");
  self.is_active = ko.observable("");
  self.track = ko.observable("");


// extract the task ID we have to work with
const task_id = params.taskModel().data.id;
const track_id = params.taskModel().data.track_id;

  // notification messages observable
self.applicationMessages = ko.observableArray([]);

self.tracks = ko.observableArray([]);
self.track_id = ko.observable();
self.task = ko.observableArray([]);
self.tasks = ko.observableArray([]);



var tracksURL = `${api}/api/track`;
var tasksURL = `${api}/api/task`;

var submissionURL = `${tasksURL}/${task_id}/submissions`;

self.dataProvider = ko.observable()

  var userToken = sessionStorage.getItem("user_token");



  self.toTasks = () => {
    self.hideSubmissions(params.hideSubmissions(false));
    self.listRefresh(params.listRefresh());
  }

  self.deleteTaskModal = () => {
    document.getElementById("deleteTaskModal").open();
  };

  self.editTaskModal = () => {
    document.getElementById("editTaskModal").open();
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

  function fetchSubmission() {
        $.ajax({
          url: submissionURL,
          headers: {
            'Authorization': "Bearer " + userToken
          },
          method: "GET",

          success: ({status, data}) => {

            if (status == true) {
              self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttribute: 'user_id'})));
          }
        }
      });
    }


    fetchSubmission();

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

  fetchTracks();

  self.fetchTrack = async() => {
    try {
        const response = await fetch(`${api}/api/track/${track_id}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });
        const { data } = await response.json();

        self.track(`${data.track_name}`);
    } catch (err) {
        console.log(err);
    }
};
self.fetchTrack();



  //Updates Task

  self.updateTask = function(event) {
    let track_id = self.track_id();
    let title = self.title();
    let body = self.body();
    let deadline = self.deadline();
    let is_active = self.is_active();

    $.ajax({
      method: "PUT",
      url: `${tasksURL}s/${task_id}`,
      headers: {
        Authorization: "Bearer " + userToken
        // "Access-Control-Allow-Origin": "*",
        // "Content-Type": "application/json",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Headers": "*"
      },
      data: { track_id, title, body, deadline, is_active },
      success: res => {
          // send a success message notification to the category view
          self.fetchTask();
          self.fetchTrack();
          self.applicationMessages.push({
            severity: "confirmation",
            summary: "Task updated",
            detail: "Task successfully updated",
            autoTimeout: parseInt("0")
          });
      },
      error: err => {
        console.log(err);

        // send an error message notification to the category view
        self.applicationMessages.push({
          severity: "error",
          summary: "Error updating task",
          detail: "Error trying to update task",
          autoTimeout: parseInt("0")
        });
      }
    });

    document.getElementById("editTaskModal").close();
  };

  self.deleteTask = () => {
    $.ajax({
      url: `${tasksURL}s/${task_id}`,
      headers: {
        Authorization: "Bearer " + userToken
      },
      method: "DELETE",
      success: () => {
        document.getElementById("deleteTaskModal").close();
        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Task deleted",
          autoTimeout: parseInt("0")
        });
        self.listRefresh(params.listRefresh());
        setTimeout(() => self.hideSubmissions(params.hideSubmissions(false)), 1000);
      },
      error: err => {
        console.log(err);
        self.applicationMessages.push({
          severity: "error",
          summary: "An error was encountered, could not delete task",
          autoTimeout: parseInt("0")
        });
      }
    });
  };

  self.fetchTask = async() => {
    try {
      const response = await fetch(`${tasksURL}/${task_id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      const { data } = await response.json();

      self.title(`${data[0].title}`);
      self.body(`${data[0].body}`);
      self.deadline(self.formatDateTime(`${data[0].deadline}`));
      self.is_active(`${data[0].is_active}`);
    } catch (err) {
      console.log(err);
    }
  };
  self.fetchTask();
}

return TaskSubmissionsModel;
});