define([
  "ojs/ojcore",
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
  function TeamViewModel() {
    var self = this;

    self.teamDataProvider = ko.observable(); //gets data for Categories list
    self.teamMembers = ko.observable(); // gets data for posts under selected category
    self.teamData = ko.observable(""); //holds data for the Category details
    self.newTeam = ko.observableArray([]); //newItem holds data for the create item dialog
    self.numOfMembers = ko.observableArray([]);
    self.isUserProfile = ko.observable(false);

    // Activity selection observables
    self.teamSelected = ko.observable(false);
    self.firstSelectedTeam = ko.observable();
    self.firstSelectedTeamMember = ko.observable();

    // notification messages observable
    self.applicationMessages = ko.observableArray([]);

       // initialize the router
       const router = oj.Router.rootInstance;
      
    //REST endpoint
    var RESTurl = `${api}/api/teams`;

    //User Token
    var userToken = sessionStorage.getItem("user_token");

    self.showCreateDialog = function(event) {
      document.getElementById("createTeamDialog").open();
    };

    self.showEditDialog = function(event) {
      document.getElementById("editTeamDialog").open();
    };
    self.showDeleteDialog = function(event) {
      document.getElementById("deleteTeamDialog").open();
    };

    self.selectedTeamChanged = function(event) {
      // Check whether click is a category selection or deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display Category details
        // Populate items list observable using firstSelectedXxx API
        let { data } = self.firstSelectedTeam();
        if (data == null) {
          self.teamSelected(false);
        } else {
          self.members_under_team(data.id);
          self.teamData(data);
          self.teamSelected(true);
        }
      } else {
        // If deselection, hide list
        self.teamSelected(false);
      }
    };

    self.selectedTeamMemberChanged = function(event) {
      // Check whether click is a category selection or deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display Category details
        // Populate items list observable using firstSelectedXxx API
        let { data } = self.firstSelectedTeamMember();
        console.log(data)
        if (data == null) {
          return;
        } else {
         console.log("clicked")
         self.isUserProfile(true);
        }
      }
    };

    self.createTeam = function(event, data) {
      let team_name = self.newTeam.team_name;
      let max_team_mates = self.newTeam.max_team_mates;
      let team_description = self.newTeam.team_description;
      $.ajax({
        url: `${RESTurl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "POST",
        data: { team_name, max_team_mates, team_description },
        success: () => {
          self.fetchTeams();
          // send a success message notification to the teams view
          self.applicationMessages.push({
            severity: "confirmation",
            summary: "New team created",
            detail: "The new team " + team_name + " has been created",
            autoTimeout: parseInt("0")
          });
        },
        error: err => {
          console.log(err);

          // send an error message notification to the teams view
          self.applicationMessages.push({
            severity: "error",
            summary: "Error creating team",
            detail: "Error trying to create new team",
            autoTimeout: parseInt("0")
          });
        }
      });
      document.getElementById("createNewTitle").value = "";
      document.getElementById("createNewMaxMembers").value = "";
      document.getElementById("createNewDesc").value = "";
      document.getElementById("createTeamDialog").close();
    };

    self.fetchTeams = function() {
      $.ajax({
        url: `${RESTurl}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: res => {
          let { data } = res.data;
          self.teamDataProvider(
            new ArrayDataProvider(data, {
              keys: data.map(function(value) {
                numberOfMembers(value.id);
                return value.id;
              })
            })
          );
        }
      });

      let numberOfMembers = team_id => {
        $.ajax({
          url: `${RESTurl}/members/${team_id}`,
          method: "GET",
          headers: {
            Authorization: "Bearer " + userToken
          },
          success: resp => {
            let members = resp.data.members;
            self.numOfMembers()[`${team_id}`] = `${members.length}`;
            self.numOfMembers(self.numOfMembers());
          },
          error: err => console.log(err)
        });
      };
    };

    self.updateTeamSubmit = function(event) {
      var teamId = self.firstSelectedTeam().data.id;
      let team_name = self.firstSelectedTeam().data.team_name;
      let max_team_mates = self.firstSelectedTeam().data.max_team_mates;
      let team_description = self.firstSelectedTeam().data.team_description;
      console.log(teamId, team_name, max_team_mates, team_description);
      $.ajax({
        url: `${RESTurl}/${teamId}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "PUT",
        data: { team_name, max_team_mates, team_description },
        success: res => {
          self.fetchTeams();
          self.teamSelected(false);

          // send a success message notification to the teams view
          self.applicationMessages.push({
            severity: "confirmation",
            summary: "New team updated",
            detail: "The team " + team_name + " has been updated",
            autoTimeout: parseInt("0")
          });
        },
        error: err => {
          console.log(err);

          // send an error message notification to the teams view
          self.applicationMessages.push({
            severity: "error",
            summary: "Error updating team",
            detail: "Error trying to update team",
            autoTimeout: parseInt("0")
          });
        }
      });
      document.getElementById("editTeamDialog").close();
    };

    self.deleteTeam = function(event, data) {
      var teamId = self.firstSelectedTeam().data.id;
      let team_name = self.firstSelectedTeam().data.team_name;
      $.ajax({
        url: `${RESTurl}/${teamId}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "DELETE",
        success: res => {
          self.fetchTeams();
          self.teamSelected(false);

          // send a success message notification to the teams view
          self.applicationMessages.push({
            severity: "confirmation",
            summary: "New team deleted",
            detail: "The team " + team_name + " has been deleted",
            autoTimeout: parseInt("0")
          });
        },
        error: err => {
          console.log(err);

          // send an error message notification to the teams view
          self.applicationMessages.push({
            severity: "error",
            summary: "Error deleting team",
            detail: "Error trying to delete team",
            autoTimeout: parseInt("0")
          });
        }
      });

      document.getElementById("deleteTeamDialog").close();
    };

    self.members_under_team = function(team_id) {
      $.ajax({
        url: `${RESTurl}/members/${team_id}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: res => {
          let data = res.data.members;
          self.teamMembers(
            new ArrayDataProvider(data, {
              keys: data.map(function(value) {
                return value.id;
              })
            })
          );
        }
      });
    };

    self.fetchTeams();
  }

  return new TeamViewModel();
});
