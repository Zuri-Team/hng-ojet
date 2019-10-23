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
  "ojs/ojdialog",
  'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojformlayout', 'ojs/ojvalidation-base', 'ojs/ojselectcombobox',, 'ojs/ojdatetimepicker', 'ojs/ojtable', 'ojs/ojpagingdataproviderview'
], function(oj, ko, Bootstrap, $, api, ArrayDataProvider, ValidationBase, PagingDataProviderView) {

  function taskModel() {

	  var self = this;

	const userToken = sessionStorage.getItem("user_token");


	self.trackDataProvider = ko.observable();   //gets data for Tracks list
    self.taskDataProvider = ko.observable();      //gets data for tasks list
    self.submissionDataProvider = ko.observable();  //gets data for submitted tasks

    self.taskData = ko.observable('');             //holds data for the Task details
  self.tasksTrack = ko.observable('');    //Tasks that belongs to a track

  self.submissionView = ko.observable("false");

	self.newTask = ko.observableArray([]); //holds data for the create task dialog

  self.trackOptions = ko.observableArray([]); //values for the tracks shown in the multiselect

  //Observables for submission table
  self.task_id = ko.observable();
  self.taskTitle = ko.observable();
  self.fullname = ko.observable();
  self.submission_link = ko.observable();
  self.grade = ko.observable();

	var tracksURL = `${api}/api/track`;

  var tasksURL = `${api}/api/tasks`;

  var submissionURL = `${api}/api/submissions`;

    self.dataProvider = ko.observable();


	// Track selection observables
      self.trackSelected = ko.observable(false);
      self.selectedTrack = ko.observable();
      self.firstSelectedTrack = ko.observable();

      // Task selection observables
      self.taskSelected = ko.observable(false);
      self.selectedTask = ko.observable();
      self.firstSelectedTask = ko.observable();

	const RESTurl = "https://api.start.ng/api/track/list";

  self.viewSubmissions = function () {
      self.submissionView() ?
          self.submissionView(false) :
          self.submissionView(true);
  }.bind(self);

  self.backButton = function() {
      self.submissionView() ?
          self.submissionView(false) :
          self.submissionView(true);
          self.fetchTasks();
  }.bind(self);

  function fetchSubmission() {
    $.ajax({
      url: submissionURL,
      headers: {
        'Authorization': "Bearer " + userToken,
        'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',

					'Access-Control-Allow-Headers': '*'
      },
      method: "GET",

      success: ({status, data}) => {

        if (status == true) {
          self.submissionDataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttribute: 'task_id'})));
          console.log(data);
      }
    }
  });
}
fetchSubmission();



  self.showCreateTaskDialog = function (event) {
								document.getElementById("createTaskDialog").open();
							}

	self.showEditTaskDialog = function(event) {
							document.getElementById("editTaskDialog").open();
							};

	self.showViewTaskDialog = function(event) {
							document.getElementById("viewTaskDialog").open();
							};

	//console.log(tasksURL + '/' + selectedTrack().data.track_name + "/`{track_id}`" );

	/**
       * Handle selection from Track
       */
      self.selectedTrackChanged = function (event) {
        // Check whether click is an Activity selection or a deselection
        if (event.detail.value.length != 0) {
            // If selection, populate and display list
            // Create variable for items list using firstSelectedXxx API from List View
            var trackId = self.firstSelectedTrack().data.id;
            // Populate items list using DataProvider fetch on key attribute
            //self.taskDataProvider(new ArrayDataProvider(tasksArray, { keyAttributes: "id" }))
            // Set List View properties
			self.fetchTasks(trackId);
            self.trackSelected(true);
            self.taskSelected(false);
            // Clear item selection
            self.selectedTask([]);
            self.taskData();
        } else {
          // If deselection, hide list
           self.trackSelected(false);
           self.taskSelected(false);
        }
      };


	  /**
       * Handle selection from Task list based on track_id
       */
      self.selectedTaskChanged = function (event) {
        // Check whether click is a Track task selection or deselection
        if (event.detail.value.length != 0) {
            // If selection, populate and display Item details
            // Populate items list observable using firstSelectedXxx API
			//console.log(self.firstSelectedTask());
			let { data } = self.firstSelectedTask();

            self.fetchTasks(self.firstSelectedTask().data.id);
            self.taskSelected(true);
			self.taskData(data);
			self.taskDataProvider();
        } else {
          // If deselection, hide list
           //self.taskSelected(false);
        }
      };


	$.ajaxSetup({
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
			'Access-Control-Allow-Origin': '*',
          }
        });

	//Fetch Track lists
	self.fetchTracks = () => {

		$.ajax({
		   url:tracksURL+"/list",
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
			let {data} = response.data;
			var tracksArray = data;

			self.trackDataProvider(
				new ArrayDataProvider(tracksArray, { keyAttributes: "id" })
			);
			/*self.trackDataProvider(
            new ArrayDataProvider(data, {
              keys: data.map(function(value) {
                //numberOfPosts(value.id);
                return value.id;
              })
            })
          );*/
			}
    });
	};
	self.fetchTracks();


	self.fetchTasks = (track_id) => {

		$.ajax({
		   url:tracksURL +"/"+ track_id + "/tasks",
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

			let { data } = response;
			var tasksArray = data;

			self.taskDataProvider(
				new ArrayDataProvider(tasksArray, { keyAttributes: "id" })
			);
			}
    });
	};



	self.createTask = () => {

		let track_id = self.firstSelectedTrack().data.id;
		let title = self.newTask.title;
        let body = self.newTask.body;
		let deadline = self.newTask.deadline;
		let is_active = self.newTask.is_active;

		/*var bet = {
    tournament: '',
    bo: '1',
    bet_team: '2',
    betted: '3',
    potential: '4',
    percent: '5'
};*/

		$.ajax({
                 method: "POST",
                 url: "https://api.start.ng/api/tasks",
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
                 success: function (response) {
					 alert('Task created successfully');
					 self.fetchTasks();
                 console.log('Successful Task creation');
                 },
                 error: function (xhr) {
                     //alert(xhr.responseText);
					 alert('Error');
                 }
             });
		//document.getElementById("createNewTitle").value = "";
      //document.getElementById("createNewBody").value = "";
      //document.getElementById("createNewDeadline").value = "";
		document.getElementById('createTaskDialog').close();
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
                 success: function (data, status, jqXHR) {
					 //self.fetchTasks();
					 alert('Update Successful');
                 console.log('Successfully updated Task');
                 },
                 error: function (xhr) {
                     //alert(xhr.responseText);
					 alert('Error');
                 }
             });

		document.getElementById('editTaskDialog').close();
		document.getElementById('viewTaskDialog').close();
		//self.fetchTasks();
	};

	self.deleteTask = function (event, data) {

		let taskId = self.taskData().id;
		let taskTitle = self.taskData().title;

		const confirm_ques = confirm("Are you sure you want to delete " + taskTitle + "?");

		if(confirm_ques){
			$.ajax({ url:tasksURL + "/" +taskId, method: "DELETE" })
            .then(function (data) {
                alert('Task Successfully deleted!');
            })
            .catch(function (err) {
                console.log(err);
            });
		}
	};


  }
  return new taskModel();

});