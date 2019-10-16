define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', './api', 'ojs/ojtable', 'ojs/ojbutton', 'ojs/ojcollectiontabledatasource', 'ojs/ojmodel', 'ojs/ojdialog', 'ojs/ojinputtext'],
    function(oj, ko, $, api) {
        function TeamViewModel() {
            var self = this;

            self.team_name = ko.observable("");
            self.fullname = ko.observable("");

            // create observables for the team collection and teams data provider
            self.TeamCol = ko.observable();
            self.teamsDataProvider = ko.observable();

            // API Endpoint
            var teamsURL = `${api}/api/teams`;

            var userToken = sessionStorage.getItem("user_token");

            // create team model
            self.team = oj.Model.extend({
                idAttribute: "id"
            });

            self.myTeam = new self.team();

            // create teams collection, assigning the URL to retrieve the data from the API endpoint and assigning the team model created above

            self.teamCollection = oj.Collection.extend({
                url: teamsURL,
                model: self.myTeam
            });

            self.TeamCol(new self.teamCollection());

            self.fetchTeams = async() => {
                try {
                    const response = await fetch(`${teamsURL}`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    const {
                        data: { data }
                    } = await response.json();
                    console.log("Data", data);
                    self.teamsDataProvider(new oj.CollectionTableDataSource(self.TeamCol()));
                } catch (err) {
                    console.log(err);
                }
            };

            self.fetchTeams();

            self.addNewTeamDialog = function(event) {
                document.getElementById("createTeamDialog").open();
            };

            self.addNewMemberDialog = function(event) {
                document.getElementById("addMemberDialog").open();
            };
            self.createTeam = function() {

            };
            self.addMember = function() {

            };
        }
        return new TeamViewModel();
    });