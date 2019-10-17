define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojcollectiondataprovider",
  "ojs/ojmodel",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojdialog",
  'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojformlayout'
], function(ko, $, api, ArrayDataProvider, CollectionDataProvider,) {
	
  function taskModel() {
	  
	const userToken = sessionStorage.getItem("user_token");
	
	
	self.trackDataProvider = ko.observable();   //gets data for Tracks list
      self.taskDataProvider = ko.observable();      //gets data for tasks list

      self.taskData = ko.observable('');             //holds data for the Task details

	self.newTask = ko.observableArray([]); //holds data for the create task dialog
	  

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
	
	
	/**
       * Handle selection from Tracks list
       */
      self.selectedTrackChanged = function (event) {
        // Check whether click is a Track selection or a deselection
        if (event.detail.value.length != 0) {
          // If selection, populate and display list
          // Create variable for items list using firstSelectedXxx API from List View
          //var itemsArray = self.firstSelectedActivity().data.items;
          // Populate items list using DataProvider fetch on key attribute
		let { data } = self.firstSelectedTrack();
          
		  self.taskData(data);
			self.trackSelected(true);
		} else {
			// If deselection, hide list
			self.trackSelected(false);
		}
	  }
	  
	  
	  /**
       * Handle selection from Track Tasks list
       */
      self.selectedtaskChanged = function (event) {
        // Check whether click is an Activity Item selection or deselection
        if (event.detail.value.length != 0) {
          // If selection, populate and display Item details
          // Populate items list observable using firstSelectedXxx API
          self.TaskData(self.firstSelectedTask().data);
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
	const fetchTracks = () => {
		
		$.ajax({
		   url:RESTurl, 
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
		   success: function(data) {
			// Create variable for Activities list and populate list using key attribute fetch
			var taskArray = data;
			self.taskDataProvider(new oj.ArrayDataProvider(tasksArray, { keyAttributes: "id" }));
			}
    });
	};
	
	//const track_id = selectedTrack().data.id;
	
	//Fetch Task lists		
	const fetchTasks = () => {
		
		$.ajax({
		   url:"http://api.start.ng/tasks" + '/' +selectedTrack().data.track_name + "/`{track_id}`" , 
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
		   success: function(data) {
			// Create variable for Activities list and populate list using key attribute fetch
			var taskArray = data;
			self.taskDataProvider(new oj.ArrayDataProvider(tasksArray, { keyAttributes: "id" }));
			}
    });
	};
		
  	  

	self.createTask = function (event, data) {
		
		let title = self.newTask.title;
        let body = self.newTask.body;
		let deadline = self.newTask.deadline;
		//let isactive = self.newTask.isactive;
		
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
				 data: { title, body, deadline },
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
		
		document.getElementById('createDialog').close();
	};
	
	
	self.updateTask = function (event) {
		
		let title = self.firstSelectedTask().data.title;
        let body = self.firstSelectedTask().data.body;
		let deadline = self.newTask.firstSelectedTask().data.deadline;
		//let isactive = self.newTask.isactive;
		
		$.ajax({
                 method: "PUT",
                 url: "https://api.start.ng/api/tasks/" + firstSelectedTask().data.id,
				 headers:{
				 'Authorization' : "Bearer " + userToken,
				 'Access-Control-Allow-Origin': '*',
				 'Content-Type': 'application/json',
				 'Access-Control-Allow-Methods': '*',
				 'Access-Control-Allow-Headers': '*',
				 },
				 data: { title, body, deadline },
                 contentType: "application/json",
                 dataType: "json",
                 success: function (data, status, jqXHR) {
					 alert('create');
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
			$.ajax({ url:"https://api.start.ng/api/tasks" + "/`{taskId}`", method: "DELETE" })
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

