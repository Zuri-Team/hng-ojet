define([
    "knockout",
    "jquery",
    "./api",
    "ojs/ojarraydataprovider",
    "ojs/ojpagingdataproviderview",
    "ojs/ojknockout-keyset",
    "ojs/ojmodel",
    "ojs/ojlistview",
    "ojs/ojdialog",
    "ojs/ojvalidation-datetime",
    "ojs/ojtimezonedata",
    "ojs/ojmessages",
    "ojs/ojpagingcontrol",
    'ojs/ojbutton', 'ojs/ojradioset', 'ojs/ojlabel'
], function(ko, $, api, ArrayDataProvider, PagingDataProviderView, keySet) {
    function trackRequestsModel() {
        let self = this;
        let RESTurl = `${api}/api/track-requests`;
        let userToken = sessionStorage.getItem("user_token");

      
        self.searchQuery = ko.observable('');
        self.dataProvider = ko.observable();
        self.selectedTrackRequest = ko.observable();
        self.selectedSelectionRequired = ko.observable(false);
        self.currentItemId = ko.observable();

         // notification messages observable
         self.applicationMessages = ko.observableArray([]);


       
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


        self.handleCurrentItemChanged = function(event) {
            // Access current item via ui.item
          let itemId = event.detail.value;
          self.currentItemId(itemId);
        };


        self.fetchTrackRequests = async() => {
            try {
                const response = await fetch(`${RESTurl}/all`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                const { data }  = await response.json();
                console.log(data)
                self.dataProvider(
                    new PagingDataProviderView(new ArrayDataProvider(data, { keyAttributes: "id" })));
            } catch (err) {
                console.log(err);
            }
        };
        self.fetchTrackRequests();

        self.fetchPendingTrackRequests = async() => {
            try {
                const response = await fetch(`${RESTurl}/request-count`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                const { data: { requests_count } }  = await response.json();
                console.log(requests_count)
                // self.dataProvider(
                //     new PagingDataProviderView(new ArrayDataProvider(data, { keyAttributes: "id" })));
            } catch (err) {
                console.log(err);
            }
        };
        self.fetchPendingTrackRequests();

        self.Accept = () => {

            self.action("accept", "PUT");
        }

        self.Reject = () => {
            self.action("reject", "DELETE");
        }


        self.action = async(actionn, request) => {

            let key = self.currentItemId();

            let { data : { track: { track_name }, user : { firstname, lastname } } }
             = self.selectedTrackRequest();

            try {

                const response = await fetch(`${RESTurl}/${actionn}/${key}`, {
                    method: `${request}`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`
                    }

                });

                const data = await response.json()
                console.log(data)

                if (data.status === false) {
                    self.applicationMessages.push({

                        severity: "Warning",
                        summary: "Duplicate Action",
                        detail: `${data.message}`,
                        autoTimeout: parseInt("0")
    
                    });
                    return;
                }

                if (actionn === "accept") {
                // send a success message notification to the tracks view
                self.applicationMessages.push({

                    severity: "confirmation",
                    summary: "Action successful",
                    detail: `${firstname} ${lastname} successfully added to ${track_name}`,
                    autoTimeout: parseInt("0")

                });
            } else {
                 // send a success message notification to the tracks view
                 self.applicationMessages.push({

                    severity: "confirmation",
                    summary: "Action successful",
                    detail: `${firstname} ${lastname}'s request has been rejected`,
                    autoTimeout: parseInt("0")

                });
            }
                self.fetchTrackRequests();
                self.fetchPendingTrackRequests();

            } catch (err) {

                console.log(err);

                // send an error message notification to the tracks view
                self.applicationMessages.push({
                    severity: "error",
                    summary: "Error",
                    detail: "There was an error completing this action",
                    autoTimeout: parseInt("0")
                });
            }
        };



        // listen for changes
        let pm = ko.dataFor(document.querySelector("#admin"));
        pm.selectedItem.subscribe(function() {
            if (pm.selectedItem() == "Tracks") {
              self.fetchTrackRequests();
            }
        });
    }

    return trackRequestsModel;
});