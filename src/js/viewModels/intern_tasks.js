define(["ojs/ojcore", 'knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview', 'ojs/ojpagingcontrol', "ojs/ojlistview", "ojs/ojmodel", 'ojs/ojknockout', "ojs/ojvalidation-datetime", "ojs/ojvalidation-base", "ojs/ojtimezonedata"],
    function(oj, ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView) {
        function InternTaskModel() {
            var self = this;

            self.dataProvider = ko.observable();


            var userToken = sessionStorage.getItem("user_token");
            var user = sessionStorage.getItem("user");

            self.taskSelected = ko.observable({});

            self.taskSelectedChanged = function(event) {
                if (event.detail.value.length != 0) {
                    let { data } = self.taskSelected();
                }
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



            self.fetchTasks = async(track_id) => {
                try {
                    const response = await fetch(`${api}/api/track/${track_id}/tasks`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    const { data } = await response.data;
                    console.log(data);

                    self.dataProvider(
                        new Paging(
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
        }

        return new InternTaskModel();
    });