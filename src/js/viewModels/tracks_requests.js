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
        let userToken = localStorage.getItem("user_token");

      
        self.searchQuery = ko.observable('');
        self.dataProvider = ko.observable();
        self.selectedTrackRequest = ko.observable();
        self.selectedSelectionRequired = ko.observable(false);
        self.currentItemId = ko.observable();
        self.trackData = ko.observable();

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


        self.handleCurrentItemChanged = function(event) {
            // Access current item via ui.item
          let itemId = event.detail.value;
          self.currentItemId(itemId);
          // Check whether click is a category selection or deselection
            if (event.detail.value.length !== 0){
        // If selection, populate and display Category details
        // Populate items list observable using firstSelectedXxx API
        let { data } = self.selectedTrackRequest();
          self.trackData(data);
            }
       
    }
        


        self.fetchTrackRequests = async() => {
            try {
                const response = await fetch(`${RESTurl}/all`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                const { data }  = await response.json();
                const newData = data.filter(datum => datum.approved == 0);
                self.dataProvider(
                    new PagingDataProviderView(new ArrayDataProvider(newData, { keyAttributes: "id" })));
            } catch (err) {
                console.log(err);
            }
        };
       self.fetchTrackRequests()

    //    let { track: { track_name }, user : { firstname, lastname  } }
    //    = self.trackData();
        self.action = async(action, request) => {

            let key = self.trackData().id

            try {

                const response = await fetch(`${RESTurl}/${action}/${key}`, {
                    method: `${request}`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`
                    }

                });

                const data = await response.json()

                if (data.status === false) {
                    self.applicationMessages.push({

                        severity: "Warning",
                        summary: "Duplicate Action",
                        detail: `${data.message}`,
                        autoTimeout: parseInt("0")
    
                    });
                    self.fetchTrackRequests();
                    return;
                }

                if (action === "accept") {
                // send a success message notification to the tracks view
                self.applicationMessages.push({

                    severity: "confirmation",
                    summary: "Action successful",
                    detail: `${data.message}`,
                    // detail: `${firstname} ${lastname} successfully added to ${track_name}`,
                    autoTimeout: parseInt("0")

                });
                self.fetchTrackRequests();
            } else {
                 // send a success message notification to the tracks view
                 self.applicationMessages.push({

                    severity: "confirmation",
                    summary: "Action successful",
                    detail: `${data.message}`,
                    // detail: `${firstname} ${lastname}'s request has been rejected`,
                    autoTimeout: parseInt("0")

                });
                self.fetchTrackRequests();
            }
                self.fetchTrackRequests();

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

            
        self.Accept = () => {
            setTimeout(() => self.action("accept", "PUT"), 0);
        }

        self.Reject = () => {
            setTimeout(() => self.action("reject", "DELETE"), 0);
        }


        // listen for changes
        let pm = ko.dataFor(document.querySelector("#admin"));
        pm.selectedItem.subscribe(function() {
            if (pm.selectedItem() == "Tracks") {
              self.selectedTrackRequest();
              self.fetchTrackRequests();
            }
        });
    }

    return trackRequestsModel;
});