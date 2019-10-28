define(['ojs/ojcore', 'knockout', "jquery", "./api", "ojs/ojarraydataprovider", 'ojs/ojpagingdataproviderview', 'ojs/ojmessages', "ojs/ojdialog",
"ojs/ojvalidation-datetime",
"ojs/ojlabel",
"ojs/ojinputtext",
"ojs/ojformlayout",
"ojs/ojvalidation-base",
"ojs/ojselectcombobox",
"ojs/ojdatetimepicker",
'ojs/ojtable'],
function(oj, ko, $, api, ArrayDataProvider, PagingDataProviderView) {
function TaskSubmissionsModel(params) {
  var self = this;
  self.hideSubmissions = ko.observable();

  // Task submission observables
  self.title = ko.observable();
  self.deadline = ko.observable();
  self.submissionLink = ko.observable();
  self.body = ko.observable();

// notification messages observable
self.applicationMessages = ko.observableArray([]);

self.tracks = ko.observableArray([]);


// extract the task ID we have to work with
const task_id = params.taskModel().data.id;
const track_id = params.taskModel().data.track_id;

var tracksURL = `${api}/api/track`;

  var userToken = sessionStorage.getItem("user_token");

  self.toTasks = () => {
    self.hideSubmissions(params.hideSubmissions(false));
    console.log("clicked");
  }

  self.deleteTaskModal = () => {
    document.getElementById("deleteTaskModal").open();
  };

  self.editTaskModal = () => {
    document.getElementById("editTaskModal").open();
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

  fetchTracks();

  //Updates Task

  self.updateTask = function(event) {
    let title = self.taskData().title;
    let body = self.taskData().body;
    let deadline = self.taskData().deadline;
    let is_active = self.taskData().is_active;
    let task_id = self.taskData().id;

    $.ajax({
      method: "PUT",
      url: `${tasksURL}/${task_id}`,
      headers: {
        Authorization: "Bearer " + userToken
        // "Access-Control-Allow-Origin": "*",
        // "Content-Type": "application/json",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Headers": "*"
      },
      data: { title, body, deadline, is_active },
      success: res => {
        if (res.status == true) {
          // send a success message notification to the category view
          self.applicationMessages.push({
            severity: "confirmation",
            summary: "Task updated",
            detail: "Task successfully updated",
            autoTimeout: parseInt("0")
          });
          self.fetchTasks();
        }
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
    let task_id = self.taskData().id;
    $.ajax({
      url: `${tasksURL}/${task_id}`,
      headers: {
        Authorization: "Bearer " + userToken
      },
      method: "DELETE",
      success: () => {
        self.fetchTasks();
        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Task deleted",
          autoTimeout: parseInt("0")
        });
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
    document.getElementById("deleteTaskModal").close();
  };
}

return TaskSubmissionsModel;
});