define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojmodel",
  "ojs/ojlistview"
], function(ko, $, api, ArrayDataProvider) {
	
  function taskModel() {
    self = this;
    self.tasks = ko.observableArray([]);
    self.selectedCat = ko.observable();
    self.title = ko.observable();
    self.body = ko.observable();
	self.deadline = ko.observable();
	self.is_active = ko.observable();
	//self.status = ko.observable();
    self.dataProvider = ko.observable();
	
    var userToken = sessionStorage.getItem("user_token");
	
	let RESTUrl = "https://api.start.ng/tasks";
	
	
	
	self.createTask = fetch(RESTUrl, {
						  headers: { "Content-Type": "application/json", "Authorization": "Bearer `{userToken}`",},
						  method: 'POST',
						  body: JSON.stringify({
							title: self.title(),
							body: self.body(),
							deadline: self.deadline(),
							status: self.status()
						  })
						});
						
						
	/*self.viewTask = fetch(RESTUrl + '/' + {id}, {
						  headers: { "Content-Type": "application/json; "Authorization": "Bearer `{userToken}`"; charset=utf-8" },
						  method: 'GET',
						}).then(response => response.json())
						  .then(data => console.log(dataProvider));

	self.viewTasks = fetch(RESTUrl, {
						  headers: { "Content-Type": "application/json; "Authorization": "Bearer `{userToken}`"; charset=utf-8" },
						  method: 'GET',
						}).then(response => response.json())
						  .then(data => console.log(data));	*/					
						
	self.updateTask = fetch(RESTUrl + '/' + {id}, {
						  headers: { "Content-Type": "application/json", "Authorization": "Bearer `{userToken}`" },
						  method: 'PUT',
						  body: JSON.stringify({
							title: self.title(),
							body: self.body(),
							deadline: self.deadline(),
							status: self.status,
						  })
						});	

	
	self.deleteTask = fetch(RESTUrl + '/' + {id}, { 
							  method: 'DELETE' 
							});
	/*self.createTask = function(){
        var task = {
          id: '',
          title: self.title(),
          body: self.body(),
		  deadline: self.deadline(),
		  is_active: self.is_active(),
        };

        var taskError = function(jqXHR, textStatus, errorThrown){
          console.error('Error: ' + textStatus);
        };

        TasksService.create(task, null, meetingError);
      };*/
  }
	  
  return new taskModel();
});