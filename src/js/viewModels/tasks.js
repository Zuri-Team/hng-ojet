define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojbootstrap",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojmodel",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojdialog", 'ojs/ojvalidation-datetime',
  'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojformlayout', 'ojs/ojvalidation-base', 'ojs/ojselectcombobox', 'ojs/ojdatetimepicker', 'ojs/ojpagingdataproviderview', 'ojs/ojmessages', 'ojs/ojpagingcontrol', 'ojs/ojtimezonedata'
], function(oj, ko, $, api, ArrayDataProvider, Paging) {
  function taskModel() {
	  var self = this;

	  var userToken = sessionStorage.getItem("user_token");

    self.taskDataProvider = ko.observable();      //gets data for tasks list

    self.taskData = ko.observable('');             //holds data for the Task details

    self.newTask = ko.observable({}); //holds data for the create task dialog

    self.task_btn_toggler = ko.observable(false);
    self.task_view_title = ko.observable("New Task");

    self.task_view_toggle = () => {
    self.task_btn_toggler(!self.task_btn_toggler());
    self.task_view_title() == "New Task"
      ? self.task_view_title("Back")
      : self.task_view_title("New Task");
  };

  // //Observables for submission table
  //   self.task_id = ko.observable();
  //   self.taskTitle = ko.observable();
  //   self.fullname = ko.observable();
  //   self.submission_link = ko.observable();
  //   self.grade = ko.observable();

	  var tracksURL = `${api}/api/track`;

    var tasksURL = `${api}/api/tasks`;

    // var submissionURL = `${api}/api/submissions`;

    self.dataProvider = ko.observable();

      // Task selection observables
    self.taskSelected = ko.observable();

    self.tracks = ko.observableArray([]);

	  const RESTurl = "https://api.start.ng/api/track/list";





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



  self.deleteTaskModal = function (event) {
								document.getElementById("deleteModal").open();
							}

	self.editTaskModal = function(event) {
							document.getElementById("editModal").open();
							};

	self.viewTaskModal = function(event) {
							document.getElementById("viewModal").open();
							};

              self.taskSelectedChanged = () => {
                let { data } = self.taskSelected();
                if (data != null) {
                  console.log(data)
                  self.taskData(data);
                }
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


	// $.ajaxSetup({
  //         headers: {
  //           'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
	// 		'Access-Control-Allow-Origin': '*',
  //         }
  //       });

	//Fetch Track lists
	// function fetchTracks() {
  // self.tracks([]);
	// 	$.ajax({
	// 	   url: `${tracksURL}/list`,
	// 	   method: 'GET',
	// 	   headers: {
	// 				'Authorization' : "Bearer " + userToken,
	// 				},
  //      success: res => {
  //       self.tracks(res.data.map(tracks => tracks));
  //      }
  //       }
	// 		);

	// 		}


	self.fetchTasks = () => {

		$.ajax({
		   url: `${tasksURL}`,
		   method: 'GET',
		   headers:{
					'Authorization' : "Bearer " + userToken,
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
					//Access-Control-Allow-Origin: http://localhost:8000
					//'Access-Control-Allow-Methods': '*',
					'Access-Control-Allow-Headers': '*',
					},
		   dataType: 'json',
		   success: function(response) {
			// Create variable for Activities list and populate list using key attribute fetch
if (response.status == true) {
			let { data } = response.data;

			self.taskDataProvider(
        new Paging(
          new ArrayDataProvider(dateFormat, {
            keys: data.map(function(value) {
              value.created_at = self.formatDateTime(value.created_at);
              return value.title;
            })
          })
        )
      );
      }
    }
    });
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
				 headers:{
				 'Authorization' : "Bearer " + userToken,
				 'Access-Control-Allow-Origin': '*',
				 'Content-Type': 'application/json',
				 'Access-Control-Allow-Methods': '*',
				 'Access-Control-Allow-Headers': '*',
				 },
				 data: JSON.stringify({'track_id':track_id, 'title':title, 'body':body, 'deadline':deadline, 'is_active':is_active}),
                 //contentType: "application/json",
                 dataType: "json",
                 //processData: true,
                 success: res => {
                   if(res.status == true) {
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


	//Updates Task

	self.updateTask = function (event) {

		let title = self.taskData().title;
        let body = self.taskData().body;
		let deadline = self.taskData().deadline;
		let is_active = self.taskData().is_active;

		$.ajax({
                 method: "PUT",
                 url: tasksURL + "/"+self.taskData().id,
				 headers:{
				 'Authorization' : "Bearer " + userToken,
				 'Access-Control-Allow-Origin': '*',
				 'Content-Type': 'application/json',
				 'Access-Control-Allow-Methods': '*',
				 'Access-Control-Allow-Headers': '*',
				 },
				 data: JSON.stringify({'title':title, 'body':body, 'deadline':deadline, 'is_active':is_active}),
                 contentType: "application/json",
                 dataType: "json",
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

		document.getElementById('editTaskModal').close();
		document.getElementById('viewTaskModal').close();

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
    document.getElementById("deleteModal").close();
  };
// fetchTracks();
self.fetchTasks();

  }
  return new taskModel();

});