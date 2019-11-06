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
    "ojs/ojpagingcontrol",
    'ojs/ojbutton', 'ojs/ojradioset', 'ojs/ojlabel'
], function(ko, $, api, ArrayDataProvider, PagingDataProviderView, keySet) {
    function trackRequestsModel() {
        let self = this;
        let RESTurl = `${api}/api/track-requests`;
        let userToken = sessionStorage.getItem("user_token");

        self.activityToView = ko.observable('all');
        self.searchQuery = ko.observable('');
        self.dataProvider = ko.observable();





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

        self.searchActivity = async() => {
            let query = self.searchQuery();

            if (query.length == 0) {
                self.fetchActivities("all");
                return;
            }
            try {
                const response = await fetch(`${RESTurl}/search/${query}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                const  data  = await response.json();
                console.log(data)
                // self.dataProvider(
                //     new PagingDataProviderView(new ArrayDataProvider(data, { keyAttributes: "id" })));
            } catch (err) {
                console.log(err);
            }
        };
        // listen for changes
        let pm = ko.dataFor(document.querySelector("#admin"));
        pm.selectedItem.subscribe(function() {
            if (pm.selectedItem() == "Tracks") {
                self.fetchActivities("all");
            }
        });
    }

    return trackRequestsModel;
});