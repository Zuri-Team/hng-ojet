define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojmodel",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojdialog",
  'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojformlayout'
], function(oj, ko, $, api, ArrayDataProvider,) {
	
  function taskModel() {
	  
	  var self = this;
	  
	const userToken = sessionStorage.getItem("user_token");
	
	
	self.trackDataProvider = ko.observable();   //gets data for Tracks list
    self.taskDataProvider = ko.observable();      //gets data for tasks list

    self.taskData = ko.observable('');             //holds data for the Task details
	self.tasksTrack = ko.observable('');    //Tasks that belongs to a track

	self.newTask = ko.observableArray([]); //holds data for the create task dialog
	
	var tracksURL = `${api}/api/track`;
	
	var tasksURL = `${api}/api/tasks`;
	
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
	
	self.showCreateDialog = function (event) {
								document.getElementById("createDialog").open();
							}
		  
	self.showEditDialog = function(event) {
							document.getElementById("editDialog").open();
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
        // Check whether click is an Activity Item selection or deselection
        if (event.detail.value.length != 0) {
            // If selection, populate and display Item details
            // Populate items list observable using firstSelectedXxx API
			console.log(self.firstSelectedTask());
            self.fetchTask(self.firstSelectedTask().data);
            self.taskSelected(true);
        } else {
          // If deselection, hide list
           self.taskSelected(false);
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
			console.log(response);
			var tasksArray = data;
				
			self.tasksTrack(
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
		//let is_active = self.newTask.is_active;
		
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
				 data: { track_id, title, body, deadline },
                 //contentType: "application/json",
                 dataType: "json",
                 processData: true,
                 success: function (response) {
					 alert('create');
                 console.log('Successful Task');
                 },
                 error: function (xhr) {
                     //alert(xhr.responseText);
					 alert('Error');
                 }
             });
		document.getElementById("createNewTitle").value = "";
      document.getElementById("createNewBody").value = "";
      document.getElementById("createNewDeadline").value = "";
		document.getElementById('createDialog').close();
	};
	
	
	self.updateTask = function (event) {
		
		let title = self.firstSelectedTask().data.title;
        let body = self.firstSelectedTask().data.body;
		let deadline = self.newTask.firstSelectedTask().data.deadline;
		let is_active = self.newTask.is_active;
		
		$.ajax({
                 method: "PUT",
                 url: tasksURL + firstSelectedTask().data.id,
				 headers:{
				 'Authorization' : "Bearer " + userToken,
				 'Access-Control-Allow-Origin': '*',
				 'Content-Type': 'application/json',
				 'Access-Control-Allow-Methods': '*',
				 'Access-Control-Allow-Headers': '*',
				 },
				 data: { title, body, deadline, is_active },
                 contentType: "application/json",
                 dataType: "json",
                 success: function (data, status, jqXHR) {
					 alert('Update Successful');
                 console.log('Successfully updated Task');
                 },
                 error: function (xhr) {
                     //alert(xhr.responseText);
					 alert('Error');
                 }
             });
		
		document.getElementById('editDialog').close();
	};
	
	self.deleteTask = function (event, data) {
		
		let taskId = self.firstSelectedTask().data.id;
		let taskTitle = self.firstSelectedTask().data.title;
		
		const confirm_ques = confirm("Are you sure you want to delete " + taskTitle + "?");
		
		if(confirm_ques){
			$.ajax({ url:tasksURL + "/`{taskId}`", method: "DELETE" })
            .then(function (data) {
                alert('Task Successfully deleted!');
            })
            .catch(function (err) {
                console.log(err);
            });
		}
	};
	  
	  /**
       * This section is standard navdrawer starter template code
       */ 
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
        //self.activitySelected(false);
        //self.itemSelected(false);
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

      /*
       * Returns a constructor for the ViewModel so that the ViewModel is constructed
       * each time the view is displayed.  Return an instance of the ViewModel if
       * only one instance of the ViewModel is needed.
       */

  return new taskModel();

});

