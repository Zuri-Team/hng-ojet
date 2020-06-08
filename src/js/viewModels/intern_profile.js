define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojbootstrap",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojavatar",
  "ojs/ojbutton",
  "ojs/ojmenu",
  "ojs/ojoption",
  "ojs/ojmessages",
  "ojs/ojdatetimepicker",
  "ojs/ojselectcombobox",
  "ojs/ojtimezonedata",
  "ojs/ojlabel",
], function (oj, ko, Bootstrap, $, api) {
  function UserProfileModel(params) {
    var self = this;
    self.hideProfile = ko.observable();
    self.activate = ko.observable(false);
    self.isUser = ko.observable(true);
    self.selectedMenuItem = ko.observable("");

    // User Profile Observables
    self.fullName = ko.observable("");
    self.teamName = ko.observable("");
    self.stage = ko.observable("");
    self.role = ko.observable("");
    self.id = ko.observable("");
    self.email = ko.observable("");
    self.tracksArray = ko.observableArray([]);
    self.firstStage = ko.observable(false);
    self.lastStage = ko.observable(false);
    self.profile_img = ko.observable();

    self.avatarSize = ko.observable("md");

    // probation observables
    self.user_id = ko.observable();
    self.probated_by = ko.observable();
    self.probation_reason = ko.observable();
    self.probatedInterns = ko.observableArray([]);
    self.probatedInternsId = ko.observableArray([]);
    self.onProbation = ko.observable(true);
    self.reason = ko.observable();
    self.exit_on = ko.observable();

    // notification messages observable
    self.applicationMessages = ko.observableArray([]);

    // extract the user ID we have to work with
    const user_id = params.userModel().data.id;

    // For tracks
    self.tracks_id = ko.observable();
    self.track_id = ko.observable();
    self.track = ko.observableArray([]);
    self.tracks = ko.observableArray([]);

    // For teams
    self.teams_id = ko.observable();
    self.team_id = ko.observable();
    self.team = ko.observableArray([]);
    self.teams = ko.observableArray([]);

    self.stage = ko.observable();

    // For the update stage select options list
    self.stages = ko.observable([
      { stage: parseInt(1), id: 1 },
      { stage: parseInt(2), id: 2 },
      { stage: parseInt(3), id: 3 },
      { stage: parseInt(4), id: 4 },
      { stage: parseInt(5), id: 5 },
      { stage: parseInt(6), id: 6 },
      { stage: parseInt(7), id: 7 },
      { stage: parseInt(8), id: 8 },
      { stage: parseInt(9), id: 9 },
      { stage: parseInt(10), id: 10 },
    ]);

    // Get auth token from session storage
    var userToken = localStorage.getItem("user_token");

    // base URL
    const userProfileURL = `${api}/api/user-profile`;

    self.showProfileImage = () => {
      document.getElementById("showImage").open();
    };

    //  Fetch all tracks
    self.fetchTracks = async () => {
      try {
        const response = await fetch(`${api}/api/track/list`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const {
          data: { data },
        } = await response.json();
        // console.log(data)

        self.tracks(data.map((track) => track));
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchTracks();

    //  Fetch a single track
    self.fetchTrack = async () => {
      try {
        const response = await fetch(`${userProfileURL}/${user_id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const { data } = await response.json();

        self.track(data.tracks.map((track) => track));
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchTrack();

    //  Fetch all teams
    self.fetchTeams = async () => {
      try {
        const response = await fetch(`${api}/api/teams`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const {
          data: { data },
        } = await response.json();
        // console.log(data)

        self.teams(data.map((team) => team));
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchTeams();

    //  Fetch a single team
    self.fetchTeam = async () => {
      try {
        const response = await fetch(`${userProfileURL}/${user_id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const { data } = await response.json();

        self.team(data.teams.map((team) => team));
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchTeam();

    // probation interns
    function fetchProbatedInternsStatus() {
      $.ajax({
        url: `${api}/api/probation/status/${user_id}`,
        headers: {
          Authorization: "Bearer " + userToken,
        },
        method: "GET",
        success: ({ status, data }) => {
          if (status == "success") {
            //   console.log(data);
            self.onProbation(data.status);
          }
        },
      });
      setTimeout(fetchProbatedInternsStatus, 15000);
    }
    fetchProbatedInternsStatus();

    // utility functions

    self.promote = async () => {
      try {
        const response = await fetch(`${userProfileURL}/promote/${user_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const { data } = await response.json();

        self.fetchUserProfile();

        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Promote user",
          detail: "Successfully promoted user to the next stage",
          autoTimeout: parseInt("0"),
        });

        // self.applicationMessages.push({
        //   severity: "confirmation",
        //   summary: `Promote ${data.role}`,
        //   detail: `${data.role} ${data.username} successfully promoted to stage ${data.stage}`,
        //   autoTimeout: parseInt("0")
        // });
      } catch (err) {
        console.log(err);
      }
    };

    self.demote = async () => {
      try {
        const response = await fetch(`${userProfileURL}/demote/${user_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const { data } = await response.json();

        self.fetchUserProfile();

        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Demote user",
          detail: "Successfully demoted user to the previous stage",
          autoTimeout: parseInt("0"),
        });

        // self.applicationMessages.push({
        //   severity: "confirmation",
        //   summary: `Demote ${data.role}`,
        //   detail: `${data.role} ${data.username} successfully demoted to stage ${data.stage}`,
        //   autoTimeout: parseInt("0")
        // });
      } catch (err) {
        console.log(err);
      }
    };

    self.updateStage = () => {
      document.getElementById("updateStage").open();
    };

    self.update = async () => {
      const stage = self.stage();
      try {
        const response = await fetch(
          `${userProfileURL}/update-stage/${user_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              stage,
            }),
          }
        );
        const { data } = await response.json();

        self.fetchUserProfile();
        document.getElementById("updateStage").close();

        // Using this now because the backend returns an error due to the unavailability of a slack channel.
        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Update stage",
          detail: "Successfully updated user's stage",
          autoTimeout: parseInt("0"),
        });
        // self.applicationMessages.push({
        //   severity: "confirmation",
        //   summary: `Update ${data.role}`,
        //   detail: `${data.role} ${data.username} successfully updated to stage ${data.stage}`,
        //   autoTimeout: parseInt("0")
        // });
      } catch (err) {
        console.log(err);
      }
    };

    self.menuItemAction = function (event) {
      self.selectedMenuItem(event.target.value);

      switch (event.target.value) {
        case "Make Admin": {
          (async () => {
            try {
              const response = await fetch(
                `${userProfileURL}/make-admin/${user_id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              );
              const { data } = await response.json();

              self.isUser(false);
              self.fetchUserProfile();

              self.applicationMessages.push({
                severity: "confirmation",
                summary: "Make Admin",
                detail: `Intern ${data.username} successfully made Admin`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          })();
          break;
        }
        case "Make User": {
          (async () => {
            try {
              const response = await fetch(
                `${userProfileURL}/remove-admin/${user_id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              );
              const { data } = await response.json();

              self.isUser(true);
              self.fetchUserProfile();
              self.applicationMessages.push({
                severity: "confirmation",
                summary: "Make User",
                detail: `Admin ${data.username} successfully made User`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          })();
          break;
        }
        case "Activate": {
          (async () => {
            try {
              const response = await fetch(
                `${userProfileURL}/activate/${user_id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              );
              const { data } = await response.json();

              self.activate(false);
              self.fetchUserProfile();
              self.applicationMessages.push({
                severity: "confirmation",
                summary: `Activate ${data.role}`,
                detail: ` Successfully activated ${data.role} ${data.username}`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          })();
          break;
        }
        case "Deactivate": {
          (async () => {
            try {
              const response = await fetch(
                `${userProfileURL}/deactivate/${user_id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              );
              const { data } = await response.json();

              self.activate(true);
              self.fetchUserProfile();
              self.applicationMessages.push({
                severity: "confirmation",
                summary: `Activate ${data.role}`,
                detail: ` Successfully deactivated ${data.role} ${data.username}`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          })();
          break;
        }
        case "Delete": {
          document.getElementById("deleteUser").open();

          self.deleteUser = async () => {
            try {
              const response = await fetch(
                `${userProfileURL}/delete/${user_id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              );

              self.fetchUserProfile();
              setTimeout(
                () => self.hideProfile(params.hideProfile(false)),
                1000
              );
              document.getElementById("deleteUser").close();
              self.applicationMessages.push({
                severity: "confirmation",
                summary: "Delete user",
                detail: "Successfully deleted user",
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          };
          break;
        }
        case "Add to track": {
          document.getElementById("addToTrack").open();

          self.addToTrack = async () => {
            const track_id = self.tracks_id();
            try {
              const response = await fetch(`${api}/api/track/users/add`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                  user_id,
                  track_id,
                }),
              });
              const { message } = await response.json();

              self.fetchTrack();
              self.fetchTracks();
              self.fetchUserProfile();
              document.getElementById("addToTrack").close();
              self.applicationMessages.push({
                severity: "confirmation",
                summary: "Add to track",
                detail: `${message}`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          };
          break;
        }
        case "Remove from track": {
          document.getElementById("removeFromTrack").open();

          self.removeFromTrack = async () => {
            const track_id = self.track_id();
            try {
              const response = await fetch(`${api}/api/track/users/remove`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                  user_id,
                  track_id,
                }),
              });
              const { message } = await response.json();

              self.fetchTrack();
              self.fetchTracks();
              self.fetchUserProfile();
              document.getElementById("removeFromTrack").close();
              self.applicationMessages.push({
                severity: "warning",
                summary: "Remove to track",
                detail: `${message}`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          };
          break;
        }
        case "Add to team": {
          document.getElementById("addToTeam").open();

          self.addToTeam = async () => {
            const team_id = self.teams_id();
            try {
              const response = await fetch(`${api}/api/teams/add-member`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                  user_id,
                  team_id,
                }),
              });
              const message = await response.json();
              // console.log(message);

              self.fetchTeam();
              self.fetchTeams();
              self.fetchUserProfile();
              document.getElementById("addToTeam").close();
              self.applicationMessages.push({
                severity: "confirmation",
                summary: "Add to team",
                detail: "",
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          };
          break;
        }
        case "Remove from team": {
          document.getElementById("removeFromTeam").open();

          self.removeFromTeam = async () => {
            const team_id = self.team_id();
            try {
              const response = await fetch(`${api}/api/teams/remove-member`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                  user_id,
                  team_id,
                }),
              });
              const { message } = await response.json();

              self.fetchTeam();
              self.fetchTeams();
              self.fetchUserProfile();
              document.getElementById("removeFromTeam").close();
              self.applicationMessages.push({
                severity: "warning",
                summary: "Remove From Team",
                detail: `${message}`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          };
          break;
        }
        case "Add to Probation": {
          document.getElementById("addToProbation").open();

          self.addToProbation = async () => {
            const reason = self.reason();
            const exit_on = self.exit_on();
            try {
              const response = await fetch(`${api}/api/user/probate`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                  user_id,
                  reason,
                  exit_on,
                }),
              });
              const { message } = await response.json();

              // self.fetchTeam();
              // self.fetchTeams();
              self.onProbation(true);
              self.fetchUserProfile();
              document.getElementById("addToProbation").close();
              self.applicationMessages.push({
                severity: "confirmation",
                summary: "Add to Probation",
                detail: `${message}`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          };
          break;
        }
        case "Remove from Probation": {
          document.getElementById("removeFromProbation").open();

          self.removeFromProbation = async () => {
            // const team_id = self.team_id();
            try {
              const response = await fetch(`${api}/api/user/unprobate`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                  user_id,
                }),
              });
              const { message } = await response.json();

              // self.fetchTeam();
              // self.fetchTeams();
              self.onProbation(false);
              self.fetchUserProfile();
              document.getElementById("removeFromProbation").close();
              self.applicationMessages.push({
                severity: "warning",
                summary: "Remove From Probation",
                detail: `${message}`,
                autoTimeout: parseInt("0"),
              });
            } catch (err) {
              console.log(err);
            }
          };
          break;
        }
      }
    };

    self.fetchUserProfile = async () => {
      try {
        const response = await fetch(`${userProfileURL}/${user_id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const { data } = await response.json();
        self.profile_img(`${data.profile_img}`);
        self.fullName(`${data.firstname} ${data.lastname}`);
        self.teamName(data.teams.map((teams) => `  ${teams.team_name}`));
        self.stage(`${data.stage}`);
        self.id(`HNG-${String(data.id).padStart(5, 0)}`);
        self.role(`${data.role}`);
        self.email(`${data.email}`);
        self.tracksArray(data.tracks.map((tracks) => `  ${tracks.track_name}`));

        // console.log(data.tracks, data.role, data.active)
        // console.log(data)

        // hide the make admin and show the make user button if admin or superadmin
        if (data.role == "admin" || data.role == "superadmin") {
          self.isUser(false);

          // show the make admin and hide the make user button if not admin or superadmin
        } else {
          self.isUser(true);
        }

        // if activated, hide the activate button and show the deactivate button
        if (data.active == 1) {
          self.activate(false);

          // if activated, hide the deactivate button and show the activate button
        } else {
          self.activate(true);
        }

        // Deactivate the promote button on getting to stage 10
        if (data.stage === 10) {
          self.lastStage(true);

          // Deactivate the demote button on getting to stage 1
        } else if (data.stage === 1) {
          self.firstStage(true);

          // Otherwise, leave both buttons in their active state
        } else {
          self.lastStage(false);
          self.firstStage(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchUserProfile();

    self.Home = () => {
      self.hideProfile(params.hideProfile(false));
    };
  }
  return UserProfileModel;
});
