/*define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojlabel",
  "ojs/ojlistview",
  "ojs/ojmodel",
  "ojs/ojdialog",
  "ojs/ojinputtext"
], function(oj, ko, $, api, ArrayDataProvider) {
  function TaskViewModel() {
    var self = this;

    self.categoryDataProvider = ko.observable(); //gets data for Categories list
    self.categoryData = ko.observable(""); //holds data for the Category details
    self.newCategory = ko.observableArray([]); //newItem holds data for the create item dialog

    // Activity selection observables
    self.categorySelected = ko.observable(false);
    self.selectedCategory = ko.observable();
    self.firstSelectedCategory = ko.observable();

    //REST endpoint
    var RESTurl = `${api}/api/categories`;

    //User Token
    var userToken = sessionStorage.getItem("user_token");
	
	let RESTUrl = "https://api.start.ng/tasks";
	
	function fetchtasks() {
      $.ajax({
        url: `https://api.start.ng/api/tasks`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        success: res => {
          if (res.status == true) {
            let { data } = res.data;
            self.dataProvider(
              new ArrayDataProvider(data, {
                keys: data.map(function(value) {
                  console.log(value);
                  return value.title;
                })
              })
            );
          }
        }
      });
    }
	
	function reset() {
      self.title("");
      self.body("");
    }
	
	
	self.createTask = function(){
     $.ajax({
        url: "https://api.start.ng/tasks",
        type: "POST",
        title: self.title(),
        body: self.body(),
		deadline: self.deadline(),
		status: self.status(),
        //async: false,
        //crossDomain: true,
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + userToken,
        },
        success: function (data) {
             parsedJSON = JSON.parse(JSON.stringify(data));
             console.log('Response JSON Data-->  ' + JSON.stringify(data));
        },
        error: function (jqXHR, textStatus, errorThrown) {
             console.log('Fail Response JSON Data-->  ' + JSON.stringify(data));
        }
    });
 }
	
	
	self.createTask = () => {
      let track_id = self.selectedTask();
      let title = self.title();
      let body = self.body();

      $.ajax({
        url: `https://api.start.ng/api/tasks`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { track_id, title, body },
        success: res => {
          if (res.status == true) {
            reset();
            fetchposts();
          }
        }
      });
    };

    $.ajax({
      url: `https://api.start.ng/api/tasks`,
      headers: {
        Authorization: "Bearer " + " " + userToken
      },
      method: "GET",
      success: res => {
        res.data.map(cats => {
          self.categories.push(cats);
        });
      }
    });
	
	
	/*self.createTask = fetch(RESTUrl, {
						  headers: {
							  'Access-Control-Allow-Origin': '*',
							  'Authorization': 'Bearer ' + userToken,
							  'Content-Type': 'application/json',
						  },						  
						  method: 'POST',
						  body: JSON.stringify({
							title: self.title(),
							body: self.body(),
							deadline: self.deadline(),
							status: self.status,
						  })
						}).then((resp) => resp.json()) // Transform the data into json
  .then(function(data) {
    return data;
    });*/
						
						
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
						
	/*self.updateTask = fetch(RESTUrl + '/' + {id}, {
						  headers: {
							  'Authorization': 'Bearer ' + userToken,
							  'Content-Type': 'application/json'
						  },
						  method: 'PUT',
						  body: JSON.stringify({
							title: self.title(),
							body: self.body(),
							deadline: self.deadline(),
							status: self.status,
						  })
						});	

	
	self.deleteTask = fetch(RESTUrl + '/' + {id}, {
						headers: { 
							  'Authorization': 'Bearer ' + userToken,
							  'Content-Type': 'application/json'
						  },
							  method: 'DELETE' 
							});*/
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
 /* }
	  
  return new taskModel();
});*/
