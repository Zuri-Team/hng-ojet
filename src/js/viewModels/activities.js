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
    function activityModel() {
        let self = this;
        let RESTurl = `${api}/api/activity`;
        let userToken = sessionStorage.getItem("user_token");

        self.activityToView = ko.observable('all');
        self.searchQuery = ko.observable('');
        self.dataProvider = ko.observable()




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


        self.activityToView.subscribe(function(newValue) {
            var radiosetInstances = document.getElementById('formId').querySelectorAll('oj-radioset');
            for (var i = 0; i < radiosetInstances.length; i++) {
                if (newValue === "all") {
                    self.fetchActivities("all")
                } else if (newValue === "admin") {
                    self.fetchActivities("admins")
                } else if (newValue === "intern") {
                    self.fetchActivities("interns")
                }
            }
        });

        self.fetchActivities = async(role) => {
            try {
                const response = await fetch(`${RESTurl}/${role}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                const { data } = await response.json();
                self.dataProvider(
                    new PagingDataProviderView(new ArrayDataProvider(data, { keyAttributes: "id" })));
            } catch (err) {
                console.log(err);
            }
        };
        self.fetchActivities("all");

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
                const { data: { data } } = await response.json();
                self.dataProvider(
                    new PagingDataProviderView(new ArrayDataProvider(data, { keyAttributes: "id" })));
            } catch (err) {
                console.log(err);
            }
        };
        // listen for changes
        let pm = ko.dataFor(document.querySelector("#admin"));
        pm.selectedItem.subscribe(function() {
            if (pm.selectedItem() == "Activities") {
                self.fetchActivities("all");
            }
        });
    }

    return new activityModel();
});