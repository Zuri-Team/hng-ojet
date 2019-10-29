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
  self.submission_link = ko.observable();
  self.submitted_on = ko.observable();
  self.body = ko.observable();
  self.grade = ko.observable();
  self.is_active = ko.observable();
  self.id = ko.observable();


// extract the task ID we have to work with
const task_id = params.taskModel().data.id;

  // notification messages observable
self.applicationMessages = ko.observableArray([]);

self.tracks = ko.observableArray([]);
self.track_id = ko.observable();
self.task = ko.observableArray([]);
self.tasks = ko.observableArray([]);



var tracksURL = `${api}/api/track`;
var tasksURL = `${api}/api/tasks`;

var submissionURL = `${api}/api/task/${task_id}/submissions`;

self.dataProvider = ko.observable()

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
              console.log(data);
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

//   self.fetchTasks = async() => {
//     try {
//         const response = await fetch(`${tasksURL}`, {
//             headers: {
//                 Authorization: `Bearer ${userToken}`
//             }
//         });
//         const {
//             data: { data }
//         } = await response.json();
//         // console.log(data)

//         self.tasks(data.map(tasks => tasks)
//             );
//     } catch (err) {
//         console.log(err);
//     }
// };
// self.fetchTasks();

  self.fetchTask = async () => {
    try {
      const response = await fetch(`${tasksURL}/${task_id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      const { data } = await response.json();

      self.task(data.map(task => task)
      );
    } catch (err) {
      console.log(err);
    }
  };
  self.fetchTask();

  //Updates Task

  self.updateTask = function(event) {
    let title = self.title();
    let body = self.body();
    let deadline = self.deadline();
    let is_active = self.is_active();
    let task_id = self.id();

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
    let task_id = self.id();
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