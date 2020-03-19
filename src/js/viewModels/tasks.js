define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
  "../ckeditor",
  "ojs/ojvalidation-base",
  "ojs/ojknockout",
  "ojs/ojmodel",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojdialog",
  "ojs/ojvalidation-datetime",
  "ojs/ojlabel",
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojvalidation-base",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojmessages",
  "ojs/ojpagingcontrol",
  "ojs/ojtimezonedata"
], function(
  oj,
  ko,
  $,
  api,
  ArrayDataProvider,
  PagingDataProviderView,
  ClassicEditor,
  ValidationBase
) {
  function taskModel() {
    var self = this;

    var userToken = sessionStorage.getItem("user_token");

    self.taskDataProvider = ko.observable(); //gets data for tasks list

    self.newTask = ko.observable({}); //holds data for the create task dialog//  integrated wysiwyg editor is stored as an observable
    self.editor = ko.observable();
    // var taskDescription = document.getElementById("taskBody"); // gets the task-body text editor

    self.viewSubmission = ko.observable(false);
    self.viewAllSubmissions = ko.observable(false);
    self.task_btn_toggler = ko.observable(false);
    self.task_view_title = ko.observable("New Task");
    self.editRow = ko.observable();

    self.task_view_toggle = () => {
      self.task_btn_toggler(!self.task_btn_toggler());
      self.task_view_title() == "New Task"
        ? self.task_view_title("Cancel")
        : self.task_view_title("New Task");
        
      // if (document.getElementById("taskBody") !== null) {
        ClassicEditor.create(document.getElementById("taskBody"), {
          simpleUpload: {
            // The URL the images are uploaded to.
            uploadUrl: "http://example.com",
  
            // Headers sent along with the XMLHttpRequest to the upload server.
            headers: {
              "X-CSRF-TOKEN": "CSFR-Token",
              Authorization: "Bearer " + userToken
            }
          }
        }).then(editor => self.editor(editor))
        .catch( error => {
          console.error( error );
        });
      // }
    };

    self.applicationMessages = ko.observableArray();
    self.track_id = ko.observable("");
    self.submissionId = ko.observable("");

    var tracksURL = `${api}/api/track`;

    var tasksURL = `${api}/api/tasks`;

    var submissionURL = `${api}/api/submissions`;

    self.dataProvider = ko.observable();

    self.submissionDataProvider = ko.observable();

    // Task selection observables
    self.taskSelected = ko.observable({});

    self.tracks = ko.observableArray([]);
    self.search = ko.observable(false);

    const RESTurl = `${api}/api/track/list`;

    var numberConverterFactory = ValidationBase.Validation.converterFactory(
      "number"
    );
    self.numberConverter = numberConverterFactory.createConverter();

    self.handleUpdate = function(event, context) {
      self.editRow({ rowKey: context.key });
    };

    self.handleDone = function(event, context) {
      self.editRow({ rowKey: null });
      var userId = context.row.user_id;
      var grade = context.row.grade_score;
      var taskId = context.row.task_id;
      var graded = 1;
      self.gradeTask(userId, grade, taskId, graded);
    };

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

    self.toAllSubmissions = () => {
      self.fetchSubmission();
      self.viewAllSubmissions(true);
    };

    self.toTasks = () => {
      self.viewAllSubmissions(false);
      self.refreshList();
    };

    //refresh list
    self.refreshList = () => {
      self.search(false);
      self.fetchTasks();
    };

    self.deleteSubmissionModal = function(event, context) {
      self.submissionId(context.row.id);
      document.getElementById("deleteSubmissionModal").open();
    };

    // datetime converter
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

      return formatDateTime.format(new Date(year, month, day, hours, minutes, seconds).toISOString());
      // return formatDateTime.format(new Date(date).toISOString());
    };

    // table date converter
    self.formatDate = date => {
      var formatDate = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: "date",
        pattern: "dd/MM/yy"
      });

      return formatDate.format(new Date(date).toISOString());
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

    self.gradeTask = function(userId, grade, taskId, graded) {
      let grade_score = grade;
      let user_id = userId;
      let task_id = taskId;
      let is_graded = graded;
      $.ajax({
        method: "POST",
        url: `${api}/api/user/task/${task_id}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        data: { grade_score, user_id, is_graded },
        success: res => {
          self.fetchSubmission();
        },
        error: err => {
          console.log(err);
        }
      });
    };

    self.createTask = () => {
      let track_id = self.track_id();
      let title = self.newTask().title;
      // let body = self.newTask().body;
      let body = self.editor().getData();
      let deadline = self.newTask().deadline;
      let is_active = self.newTask().is_active;
      console.log(body); 

      $.ajax({
        method: "POST",
        url: `${tasksURL}`,
        headers: {
          Authorization: "Bearer " + userToken,
          // "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          // "Content_Type": "application/json"
          // "Access-Control-Allow-Methods": "*",
          // "Access-Control-Allow-Headers": "*"
        },
        
        data: {
          track_id,
          title,
          body,
          deadline,
          is_active
        },
        // contentType: "application/json",
        // dataType: "json",
        // processData: true,
        success: res => {
          self.newTask({});
          self.fetchTasks();
          self.task_view_toggle();
          self.applicationMessages.push({
            severity: "confirmation",
            summary: "Task created successfully",
            autoTimeout: parseInt("0")
          });
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

    self.deleteSubmission = async () => {
      let submission_id = self.submissionId();
      try {
        const response = await fetch(`${submissionURL}/${submission_id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
          }
        });
        self.fetchSubmission();
        document.getElementById("deleteSubmissionModal").close();
        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Submission deleted",
          detail: "Task submission deleted",
          autoTimeout: parseInt("0")
        });
      } catch (err) {
        console.log(err);
        self.applicationMessages.push({
          severity: "error",
          summary: "Error deleting submission",
          detail: "An error was encountered, could not delete submission",
          autoTimeout: parseInt("0")
        });
      }
    };

    self.filtertask = function() {
      self.search(false);
      let trackId = self.track_id();
      if (trackId == undefined) {
        self.fetchTasks();
      } else {
        self.search(true);
        self.tasks_under_track(trackId);
      }
    };

    self.tasks_under_track = async track_id => {
      try {
        const response = await fetch(`${api}/api/track/${track_id}/tasks`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const { data } = await response.json();

        self.taskDataProvider(
          new PagingDataProviderView(
            new ArrayDataProvider(data, {
              keys: data.map(function(value) {
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

    self.fetchSubmission = async () => {
      try {
        const response = await fetch(`${submissionURL}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const { data } = await response.json();
        self.submissionDataProvider(
          new PagingDataProviderView(
            new ArrayDataProvider(data, {
              idAttribute: "id"
            })
          )
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchTracks();
    self.fetchTasks();
  }
  return new taskModel();
});
