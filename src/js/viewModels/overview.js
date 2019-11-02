define([
    "knockout",
    "jquery",
    "./api",
    "ojs/ojbootstrap",
    "ojs/ojarraydataprovider",
    "ojs/ojpagingdataproviderview",
    "ojs/ojpagingcontrol",
    "ojs/ojknockout",
    "ojs/ojtable",
    "ojs/ojbutton",
    "ojs/ojdialog"
], function(ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView) {
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

        self.close = function(event) {
            document.getElementById("summary-modal").close();
        };

        self.open = function(event) {
            document.getElementById("summary-modal").open();
        };

        var userToken = sessionStorage.getItem("user_token");

        self.totalPosts = ko.observable("");
        self.totalTeams = ko.observable("");
        self.totalInterns = ko.observable("");
        self.teamsProvider = ko.observable();
        self.team_name = ko.observable();
        self.task = ko.observable();
        self.deadline = ko.observable();
        self.team_lead = ko.observable();
        self.totalProbatedInterns = ko.observable();

        self.onlineIntern = ko.observable();
        self.onlineAdmin = ko.observable();

        var data = [{
                id: 0,
                team_name: "Team OJET",
                task: "Oracle JET",
                team_lead: "Jude Jay",
                deadline: "2019-10-07 14:18:34",
                status: "Great"
            },
            {
                id: 1,
                team_name: "Team Lancer",
                task: "Net worth calcultor",
                team_lead: "Fabian Uzukwu",
                deadline: "2019-10-07 12:48:32",
                status: "Pending"
            },
            {
                id: 2,
                team_name: "Team Lancer",
                task: "Net worth calcultor",
                team_lead: "Fabian Uzukwu",
                deadline: "2019-10-07 12:48:32",
                status: "Pending"
            },
            {
                id: 3,
                team_name: "Team Lancer",
                task: "Net worth calcultor",
                team_lead: "Fabian Uzukwu",
                deadline: "2019-10-07 12:48:32",
                status: "Pending"
            },
            {
                id: 4,
                team_name: "Team Lancer",
                task: "Net worth calcultor",
                team_lead: "Fabian Uzukwu",
                deadline: "2019-10-07 12:48:32",
                status: "Pending"
            },
            {
                id: 5,
                team_name: "Team Lancer",
                task: "Net worth calcultor",
                team_lead: "Fabian Uzukwu",
                deadline: "2019-10-07 12:48:32",
                status: "Pending"
            },
            {
                id: 6,
                team_name: "Team Lancer",
                task: "Net worth calcultor",
                team_lead: "Fabian Uzukwu",
                deadline: "2019-10-07 12:48:32",
                status: "Pending"
            }
        ];

        self.overviewProvider(
            new PagingDataProviderView(
                new ArrayDataProvider(data, { keyAttributes: "id" })
            )
        );

        function fetchdashboard() {
            $.ajax({
                url: `${api}/api/stats/dashboard`,
                headers: {
                    Authorization: "Bearer " + userToken
                },
                method: "GET",
                success: ({ status, data }) => {
                    if (status == true) {
                        self.totalPosts(data.total_posts);
                        self.totalTeams(data.total_teams);
                        self.totalInterns(data.total_interns);
                    }
                }
            });
        }

        fetchdashboard();

        function fetchProbated() {
            $.ajax({
                url: `${api}/api/probation/all`,
                headers: {
                    Authorization: "Bearer " + userToken
                },
                method: "GET",
                success: ({ status, data }) => {
                    if (status == "success") {
                        self.totalProbatedInterns(data.length);
                        // console.log(data);
                    }
                }
            });
        }

        fetchProbated();
        // self.fetchdashboard = async() => {
        //       try {
        //         const response = await fetch(
        //           `${api}/api/probation/all`,{
        //             method: "GET",
        //             headers:{
        //               Authorization: "Bearer " + userToken
        //             }
        //           });
        //           const {status, data} = await response.json();
        //             if (status == "success") {
        //                 self.totalInterns(data.length);
        //                 console.log(data);
        //             }
        //       } catch (err) {
        //         console.log(err);
        //       }
        //     }

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
                success: ({ status, data }) => {
                    if (status == true) {
                        // console.log(data)
                        self.dataProvider(
                            new PagingDataProviderView(
                                new ArrayDataProvider(data, { keyAttributes: "id" })
                            )
                        );
                    }
                }
            });
        }
        fetchinterns();

        (function fetchUsers() {
            $.ajax({
                url: `${api}/api/status`,
                method: "GET",
                success: ({ status, data }) => {
                    if (status == true) {
                        const intern = data.filter(data => data.role <= "intern");

                        const admin = data.filter(
                            data => data.role >= "superadmin" && data.role >= "admin"
                        );

                        const oIntern = intern.filter(data => data.status == true);
                        const oAdmin = admin.filter(data => data.status == true);


                        self.onlineIntern(oIntern.length);

                        self.onlineAdmin(oAdmin.length);

                    }


                }
            });
            setTimeout(fetchUsers, 15000);
        })();
    }
    return new overviewModel();
});