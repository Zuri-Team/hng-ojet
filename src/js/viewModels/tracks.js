define(["ojs/ojcore",
    "knockout",
    "ojs/ojarraydataprovider",
    "./api",
    "ojs/ojknockout-keyset",
    'ojs/ojpagingdataproviderview',
    "ojs/ojknockout",
    "ojs/ojlistview",
    "ojs/ojbutton",
    "ojs/ojswitch",
    "ojs/ojdialog",
    "ojs/ojinputtext",
    "ojs/ojmessages",
    "ojs/ojvalidation-datetime",
    'ojs/ojpagingcontrol',
    "jquery"
], function(oj, ko, ArrayDataProvider, api, keySet, PagingDataProviderView) {
    function tracksViewModel() {
        var self = this;

        var tracksURL = `${api}/api/track`;

        var userToken = sessionStorage.getItem("user_token");

        // var date = "2019-10-09 00:22:40";
        // date = date.toISOString();
        // datetime converter
        self.formatDateTime = function(date) {
            var formatDateTime = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
                'formatType': 'datetime',
                'dateFormat': 'medium',
                'timeFormat': 'short'
            });
            return formatDateTime.format(new Date(date).toISOString());
        };

        // console.log(self.formatDateTime(date));

        self.trackData = ko.observable(""); //holds data for the track details
        self.newTrack = ko.observableArray([]); //newItem holds data for the create track dialog
        self.selectedItems = new keySet.ObservableKeySet(); // observable bound to selection option to monitor current selections
        self.selectedSelectionRequired = ko.observable(false);
        self.firstSelectedItem = ko.observable();

        // notification messages observable
        self.applicationMessages = ko.observableArray([]);

        // Relevant observables
        self.selectedIds = ko.observableArray([]);
        self.currentItemId = ko.observable();
        self.dataProvider = ko.observable();

        self.handleSelectionChanged = function(event) {
            self.selectedIds(event.detail.value); // show selected list item elements' ids

            if (event.detail.value.length != 0) {
                // Populate tracks list observable using firstSelectedXxx API
                let { data } = self.firstSelectedItem();
                self.trackData(data);
            }
        };



        self.handleCurrentItemChanged = function(event) {
            var itemId = event.detail.value;
            // Access current item via ui.item
            self.currentItemId(itemId);
        };






        // Show dialogs
        self.showCreateTrack = function(event) {
            document.getElementById("createTrack").open();
        };

        self.showEditTrack = function(event) {
            document.getElementById("editTrack").open();
        };
        self.showDeleteTrack = function(event) {
            document.getElementById("deleteTrack").open();
        };


        //  Fetch all tracks
        self.fetchTracks = async() => {
            try {
                const response = await fetch(`${tracksURL}/list`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                const {
                    data: { data }
                } = await response.json();
                // console.log(data)

                self.dataProvider(
                    new PagingDataProviderView(new ArrayDataProvider(data, { keyAttributes: "id" })));
            } catch (err) {
                console.log(err);
            }
        };
        self.fetchTracks();


        // Create tracks
        self.createTrack = async() => {
            let track_name = self.newTrack.track_name;
            let track_description = self.newTrack.track_description;


            try {
                const response = await fetch(`${tracksURL}/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`
                    },
                    body: JSON.stringify({
                        track_name,
                        track_description
                    })
                });

                // send a success message notification to the tracks view
                self.applicationMessages.push({

                    severity: "confirmation",
                    summary: "New track created",
                    detail: "The new track " + track_name + " has been created",
                    autoTimeout: parseInt("0")

                });

                document.getElementById("createNewTitle").value = "";
                document.getElementById("createNewDesc").value = "";
                document.getElementById("createTrack").close();
                self.fetchTracks();

                console.log("track created");

            } catch (err) {


                console.log(err);

                // send an error message notification to the tracks view
                self.applicationMessages.push({
                    severity: "error",
                    summary: "Error creating track",
                    detail: "Error trying to create new track",
                    autoTimeout: parseInt("0")

                });

            }

        };


        // edit tracks
        self.editTrack = async() => {

            // This is plain es6 object destructuring. Sorry it is so nested.
            let {
                data: { id, track_description, track_name }
            } = self.firstSelectedItem();



            let track_id = id; // Form data needs id as track_id

            try {

                const response = await fetch(`${tracksURL}/edit`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`
                    },
                    body: JSON.stringify({
                        track_id,
                        track_name,
                        track_description
                    })
                });

                // send a success message notification to the tracks view
                self.applicationMessages.push({
                    severity: "confirmation",
                    summary: track_name + " updated",
                    detail: "Track " + track_name + " has been updated",
                    autoTimeout: parseInt("0")
                });
                document.getElementById("editTrack").close();
                self.fetchTracks();

                console.log("track updated");

            } catch (err) {

                console.log(err);

                // send an error message notification to the tracks view
                self.applicationMessages.push({

                    severity: "error",
                    summary: "Error updating track",
                    detail: "Error trying to update track " + track_name,
                    autoTimeout: parseInt("0")

                });

            }
        };

        self.deleteTrack = async() => {

            // Get the id of the selected element
            let track_id = self.currentItemId();

            let {
                data: { track_name }
            } = self.firstSelectedItem();

            try {

                const response = await fetch(`${tracksURL}/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`
                    },
                    body: JSON.stringify({
                        track_id
                    })

                });

                // send a success message notification to the tracks view
                self.applicationMessages.push({

                    severity: "confirmation",
                    summary: track_name + " deleted",
                    detail: "Track " + track_name + " has been deleted",
                    autoTimeout: parseInt("0")

                });


                document.getElementById("deleteTrack").close();
                self.fetchTracks();

            } catch (err) {

                console.log(err);

                // send an error message notification to the tracks view
                self.applicationMessages.push({
                    severity: "error",
                    summary: "Error deleting track",
                    detail: "Error trying to delete track " + track_name,
                    autoTimeout: parseInt("0")
                });
            }
        };
    }
    return new tracksViewModel();
});