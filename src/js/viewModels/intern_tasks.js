define(["ojs/ojcore", 'knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview', 'ojs/ojpagingcontrol', "ojs/ojlistview", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojdialog", "ojs/ojlabel", "ojs/ojmodel", 'ojs/ojknockout', "ojs/ojvalidation-datetime", "ojs/ojformlayout", "ojs/ojvalidation-base", 'ojs/ojtable', "ojs/ojmessages", "ojs/ojtimezonedata"],
    function(oj, ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView) {
        function InternTaskModel() {
            var self = this;


            self.viewSubmission = ko.observable(false);
            self.submitted = ko.observable(false);
            self.is_graded = ko.observable(false);
            self.deadlinePassed = ko.observable(false);
            self.dataProvider = ko.observable();
            self.submissionDataProvider = ko.observable();


            var userToken = sessionStorage.getItem("user_token");
            var user = sessionStorage.getItem("user");
            user = JSON.parse(user);
            self.user_id = ko.observable(user.id);
            self.taskSubmit = ko.observable({});
            self.task_id = ko.observable("");

            // Task view observables
            self.submitted_link = ko.observable("");
            self.submitted_comment = ko.observable("");
            self.submission_link = ko.observable("");
            self.task_comment = ko.observable("");
            self.is_active = ko.observable("");
            self.track = ko.observable("");
            self.grade_score = ko.observable("");



            self.applicationMessages = ko.observableArray([]);

            var submissionURL = `${api}/api/submit`;
            var gradeURL = `${api}/api/user`;
            var tasksURL = `${api}/api/task`;

            self.taskSelected = ko.observable({});

            self.taskSelectedChanged = function(event) {
                if (event.detail.value.length != 0) {
                    let { data } = self.taskSelected();
                    if (data == null) {
                        return;
                    } else {
                        self.task_id(self.taskSelected().data.id);
                        self.deadlinePassed(self.deadlineCheck(self.taskSelected().data.deadline));
                        self.fetchGrade();
                        fetchSubmission();
                        self.viewSubmission(true);


                    }
                }
            };

            self.toTasks = () => {
                self.viewSubmission(false);
                self.submitted(false);
                self.is_graded(false);
                self.deadlinePassed(false);
                self.refreshList();
            }

            //refresh list
            self.refreshList = () => {
                fetchTrack(user.id);
            };

            self.deadlineCheck = date => {
                var deadline = new Date(date).toISOString();
                var currentDate = new Date(Date.now()).toISOString();
                return (deadline < currentDate ? true : false);
            }

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

      var values = date.split(/[^0-9]/),
        year = parseInt(values[0], 10),
        month = parseInt(values[1], 10) - 1, // Month is zero based, so subtract 1
        day = parseInt(values[2], 10),
        hours = parseInt(values[3], 10),
        minutes = parseInt(values[4], 10),
        seconds = parseInt(values[5], 10);

      return formatDateTime.format(new Date(year, month, day, hours, minutes, seconds).toISOString());
      // return formatDateTime.format(new Date(date).toISOString());
    };
            // table date converter
            self.formatDate = date => {
                var formatDate = oj.Validation.converterFactory(
                    oj.ConverterFactory.CONVERTER_TYPE_DATETIME
                ).createConverter({
                    formatType: "date",
                    pattern: "dd/MM/yy"
                });

                return formatDate.format(new Date(date).toISOString());
            };


            self.submitTask = async() => {
                let user_id = self.user_id();
                let submission_link = self.taskSubmit().submission_link;
                let comment = self.taskSubmit().task_comment;
                let task_id = self.task_id();
                let is_submitted = 1;

                //task submission validation
                const feedback = document.getElementById('submission_feedback');
                if (submission_link.match(new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi))) {
                    feedback.style.color = 'green';
                    feedback.innerHTML = 'Valid URL';
                } else {
                    feedback.style.color = 'red';
                    feedback.innerHTML = 'Invalid URL, please check!';
                    return;
                }
                if(!submission_link.startsWith('https://')) {
                    feedback.style.color = "red";
                    feedback.innerHTML = "Your submission link needs to start with https://";
                    return;
                }

                try {
                    const response = await fetch(`${submissionURL}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${userToken}`
                        },
                        body: JSON.stringify({
                            user_id,
                            task_id,
                            submission_link,
                            comment,
                            is_submitted
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
                    self.fetchGrade();
                    self.submitted(true);
                    self.taskSubmit({});
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

            self.fetchTasks = async() => {
                try {
                    const response = await fetch(`${api}/api/user/task/`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    const  data  = await response.json();
                    const newData = [...data.data].flat();
                    self.dataProvider(
                      new PagingDataProviderView(
                        new ArrayDataProvider(newData, {
                          keys: newData.map(function(value) {
                            value.deadline = self.formatDateTime(
                              value.deadline
                            );
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
                    success: async function(response) {
                        // let id = response.data.tracks[0].id;
                        // const tasksLoop = async _ => {
                        //     const tasksPromise = response.data.tracks.map(
                        //       async (track, id) => await self.fetchTasks(track.id)
                        //     );
                        //     const taskResolution = await Promise.all(
                        //       tasksPromise
                        //     );
                        //     return taskResolution;
                        // }
                        // const tasks = await tasksLoop();
                        self.fetchTasks();

                    }
                });
            }

            function fetchSubmission() {
                let task_id = self.task_id();
                $.ajax({
                    url: `${tasksURL}/${task_id}/intern_submissions`,
                    headers: {
                        'Authorization': "Bearer " + userToken
                    },
                    method: "GET",

                    success: ({ status, data }) => {
                        if (status == true) {
                            if (data.comment === null) {
                                data.comment = 'No comment';
                            }
                            self.submissionDataProvider(new PagingDataProviderView(new ArrayDataProvider(data, { keyAttribute: 'user_id' })));
                        }
                    }
                });
            }

            self.fetchGrade = async() => {
                let user_id = self.user_id();
                let task_id = self.task_id();
                try {
                    const response = await fetch(`${gradeURL}/${user_id}/task/${task_id}`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    const { data, status } = await response.json();

                    if (status == true && data != null && data[0] != undefined) {
                        if (data[0].is_submitted == 1) {
                            self.submitted(true);
                            self.submitted_link(`${data[0].submission_link}`);
                            self.submitted_comment(`${data[0].comment}`);
                            if (data[0].is_graded == 1) {
                                self.is_graded(true);
                                self.grade_score(`${data[0].grade_score}`);
                            }
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            };

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