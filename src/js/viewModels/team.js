define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojarraytreedataprovider",
  "jquery",
  "./api",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojbutton",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojmodel",
  "ojs/ojdialog",
  "ojs/ojinputtext"
], function(oj, ko, ArrayTreeDataProvider, $, api) {
  function TeamViewModel() {
    var self = this;

    self.team_name = ko.observable("");
    self.fullname = ko.observable("");

    // create observables for the team collection and teams data provider
    self.TeamCol = ko.observable();
    self.teamsDataProvider = ko.observable();
    self.newTeam = ko.observableArray([]);

    self.addNewTeamDialog = function(event) {
      document.getElementById("createTeamDialog").open();
    };

    self.addNewMemberDialog = function(event) {
      document.getElementById("addMemberDialog").open();
    };
    self.createTeam = function() {};
    self.addMember = function() {};

    // create team model
    self.team = oj.Model.extend({
      url: teamsURL,
      idAttribute: "id"
    });

    var userToken = sessionStorage.getItem("user_token");

    // create team model
    self.team = oj.Model.extend({
      idAttribute: "id"
    });

    self.myTeam = new self.team();

    // create teams collection, assigning the URL to retrieve the data from the API endpoint and assigning the team model created above

    self.fetchTeams = async () => {
      try {
        const response = await fetch(`${teamsURL}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const { data = data[data[0]] } = await response.json();
        console.log("Data", data);
        self.teamsDataProvider(
          new oj.CollectionTableDataSource(self.TeamCol())
        );
      } catch (err) {
        console.log(err);
      }
    };

    self.TeamCol(new self.teamCollection());

    self.createTeam = async () => {
      let team_name = self.newTeam.team_name;
      let max_team_mates = self.newTeam.max_team_mates;
      console.log(team_name, max_team_mates);
      try {
        const response = await fetch(`${teamsURL}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
          },
          body: JSON.stringify({
            team_name,
            max_team_mates
          })
        });
        document.getElementById("newTeamName").value = "";
        document.getElementById("maxTeamMates").value = "";
        document.getElementById("createTeamDialog").close();
        self.fetchTeams();
      } catch (err) {
        console.log(err);
      }
      console.log("team created");
    };

    self.addMember = function() {};

    self.addNewTeamDialog = function(event) {
      document.getElementById("createTeamDialog").open();
    };

    self.addNewMemberDialog = function(event) {
      document.getElementById("addMemberDialog").open();
    };
  }
  return new TeamViewModel();
});
