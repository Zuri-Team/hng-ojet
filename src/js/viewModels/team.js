define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbutton', 'ojs/ojarraydataprovider', 'ojs/ojdialog', 'ojs/ojinputtext'],
    function(oj, ko, $) {
        function TeamViewModel() {
            var self = this;
            self.team_name = ko.observable();

            var teamArray = [{ teamId: 1, team_name: 'Dinlas', members: 200 },
                { teamId: 2, team_name: 'OJET', members: 200 }
            ];

            self.teamsDataProvider = new oj.ArrayDataProvider(teamArray, { idAttribute: 'teamId' });
            self.addNewTeamDialog = function(event) {
                document.getElementById("createTeamDialog").open();
            };

            self.addNewMemberDialog = function(event) {
                document.getElementById("addMemberDialog").open();
            };
        }
        return new TeamViewModel();
    });