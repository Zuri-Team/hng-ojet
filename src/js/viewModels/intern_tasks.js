define(["ojs/ojcore", 'knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview', 'ojs/ojpagingcontrol', "ojs/ojlistview", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojdialog", "ojs/ojlabel", "ojs/ojmodel", 'ojs/ojknockout', "ojs/ojvalidation-datetime", "ojs/ojformlayout", "ojs/ojvalidation-base", 'ojs/ojtable', "ojs/ojmessages", "ojs/ojtimezonedata"],
    function(oj, ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView) {
        function InternTaskModel() {
            var self = this;

            self.dataProvider = ko.observable();
            self.viewSubmission = ko.observable(false);
            self.submitted = ko.observable(false);


            var userToken = sessionStorage.getItem("user_token");
            var user = sessionStorage.getItem("user");
            user = JSON.parse(user);
            self.user_id = ko.observable(user.id);
            self.taskSubmit = ko.observable({});
            self.task_id = ko.observable("");

            // Task view observables
            self.title = ko.observable("");
            self.deadline = ko.observable("");
            self.submission_link = ko.observable("");
            self.submitted_on = ko.observable("");
            self.task_comment = ko.observable("")
            self.body = ko.observable("");
            self.is_active = ko.observable("");
            self.track = ko.observable("");



            self.applicationMessages = ko.observableArray([]);

            var tasksURL = `${api}/api/task`;




            self.taskSelected = ko.observable({});

            self.taskSelectedChanged = function(event) {
                if (event.detail.value.length != 0) {
                    let { data } = self.taskSelected();
                    if (data == null) {
                        return;
                    } else {
                        self.viewSubmission(true);
                        self.task_id(self.taskSelected().data.id);



                    }
                }
            };


            self.toTasks = () => {
                self.viewSubmission(false);
                self.refreshList();
            }

            //refresh list
            self.refreshList = () => {
                fetchTrack(user.id);
            };

            // datetime converter
            self.formatDateTime = date => {
                var formatDateTime = oj.Validation.converterFactory(
                    oj.ConverterFactory.CONVERTER_TYPE_DATETIME
                ).createConverter({
                    formatType: "datetime",
                    dateFormat: "medium",
                    timeFormat: "short",
                    timeZone: "Africa/Lagos"
                });

                return formatDateTime.format(new Date(date).toISOString());
            };

            function fetchSubmission() {
                $.ajax({
                    url: `${tasksURL}/${self.task_id()}/submissions`,
                    headers: {
                        'Authorization': "Bearer " + userToken
                    },
                    method: "GET",

                    success: ({ status, data }) => {

                        if (status == true) {
                            self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, { keyAttribute: 'user_id' })));
                        }
                    }
                });
            }




            self.submitTask = async() => {
                let user_id = self.user_id();
                let submission_link = self.taskSubmit().submission_link;
                let task_comment = self.taskSubmit().task_comment;
                let task_id = self.task_id();

                //task submission validation
                // if (submission_link)

                try {
                    const response = await fetch(`${tasksURL}/${self.task_id()}/submissions`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userToken}`
                        },
                        body: JSON.stringify({
                            user_id,
                            task_id,
                            submission_link,
                            task_comment
                        })
                    });

                    self.applicationMessages.push({
                        severity: "confirmation",
                        summary: "Task submitted",
                        detail: "You have successfully submitted",
                        autoTimeout: parseInt("0")
                    });
                    document.getElementById("taskURL").value = "";
                    document.getElementById("taskComment").value = "";
                    self.submitted(true);
                    fetchSubmission();
                    console.log("task submitted");
                } catch (err) {
                    console.log(err);
                    self.applicationMessages.push({
                        severity: "error",
                        summary: "Error submitting task",
                        detail: "Error submitting task. Please try again.",
                        autoTimeout: parseInt("0")
                    });
                }
            };

            self.fetchTasks = async(track_id) => {
                try {
                    const response = await fetch(`${api}/api/track/${track_id}/tasks`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    const { data } = await response.json();


                    self.dataProvider(
                        new PagingDataProviderView(
                            new ArrayDataProvider(data, {
                                keys: data.map(function(value) {
                                    value.deadline = self.formatDateTime(value.deadline);
                                    return value.title;
                                })
                            })
                        )
                    );
                } catch (err) {
                    console.log(err);
                }
            };


            function fetchTrack(id) {
                $.ajax({
                    type: "GET",
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    },

                    url: `${api}/api/user-profile/${id}`,
                    success: function(response) {
                        let id = response.data.tracks[0].id;

                        self.fetchTasks(id);
                    }
                });
            }

            fetchTrack(user.id);

            // listen for changes
            let pm = ko.dataFor(document.querySelector("#user"));
            pm.selectedItem.subscribe(function() {
                if (pm.selectedItem() == "Tasks") {
                    fetchTrack(user.id);
                }
            });
        }

        return new InternTaskModel();
    });