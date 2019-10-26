define(['knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview',  'ojs/ojpagingcontrol', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbutton', 'ojs/ojdialog'],
function(ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView)
{ 
function overviewModel() {
  var self = this;
  self.interns = ko.observableArray([]);

  self.id = ko.observable();
  self.firstname = ko.observable();
  self.lastname = ko.observable();
  self.username = ko.observable();

  self.overviewProvider = ko.observable();

  self.dataProvider = ko.observable();

  var userToken = sessionStorage.getItem("user_token");

  

  self.close = function (event) {
    document.getElementById('summary-modal').close();
  }

  self.open = function (event) {
    document.getElementById('summary-modal').open();
  }

  var userToken = sessionStorage.getItem("user_token");

  self.totalPosts = ko.observable('');
  self.totalTeams = ko.observable('');
  self.totalInterns = ko.observable('');
  self.teamsProvider = ko.observable();
  self.team_name = ko.observable();
  self.task = ko.observable();
  self.status = ko.observable();
  self.deadline = ko.observable();
  self.team_lead = ko.observable();

  var data = [
      {
        "id": 0,
        "team_name": "Team OJET",
        "task": "Oracle JET",
        "team_lead": "Jude Jay",
        "deadline": "2019-10-07 14:18:34",
        "status": "Great"
      },
      {
        "id": 1,
        "team_name": "Team Lancer",
        "task": "Net worth calcultor",
        "team_lead": "Fabian Uzukwu",
        "deadline": "2019-10-07 12:48:32",
        "status": "Pending"
      },
      {
        "id": 2,
        "team_name": "Team Lancer",
        "task": "Net worth calcultor",
        "team_lead": "Fabian Uzukwu",
        "deadline": "2019-10-07 12:48:32",
        "status": "Pending"
      },
      {
        "id": 3,
        "team_name": "Team Lancer",
        "task": "Net worth calcultor",
        "team_lead": "Fabian Uzukwu",
        "deadline": "2019-10-07 12:48:32",
        "status": "Pending"
      },
      {
        "id": 4,
        "team_name": "Team Lancer",
        "task": "Net worth calcultor",
        "team_lead": "Fabian Uzukwu",
        "deadline": "2019-10-07 12:48:32",
        "status": "Pending"
      },
      {
        "id": 5,
        "team_name": "Team Lancer",
        "task": "Net worth calcultor",
        "team_lead": "Fabian Uzukwu",
        "deadline": "2019-10-07 12:48:32",
        "status": "Pending"
      },
      {
        "id": 6,
        "team_name": "Team Lancer",
        "task": "Net worth calcultor",
        "team_lead": "Fabian Uzukwu",
        "deadline": "2019-10-07 12:48:32",
        "status": "Pending"
      }
    ];

    self.overviewProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
  
  function fetchdashboard () {
    $.ajax({
      url: `${api}/api/stats/dashboard`,
      headers:{
        Authorization: "Bearer " + userToken
      },
      method: "GET",
      success: ({status, data}) => {
          if (status == true) {
              self.totalPosts(data.total_posts);
              self.totalTeams(data.total_teams);
              self.totalInterns(data.total_interns);
          }
      }
    });  
  }

fetchdashboard();

//   function fetchoverview() {
//     $.ajax({
//       url: `${api}/api/interns`,
//       headers: {
//         Authorization: "Bearer " + userToken
//       },
//       method: "GET",
//       success: ({status, data}) => {
//         if (status == true) {
//           self.overviewProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
//       }
//     }
//   });  
// }
// fetchoverview();


function fetchinterns() {
  $.ajax({
    url: `${api}/api/interns`,
    headers: {
      Authorization: "Bearer " + userToken
    },
    method: "GET",
    success: ({status, data}) => {
      if (status == true) {
        // console.log(data)
        self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
    }

  }
});  
}
fetchinterns();
}
return new overviewModel();
});
