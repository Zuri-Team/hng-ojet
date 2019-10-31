define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojarraydataprovider",
  "./api",
  "ojs/ojknockout-keyset",
  "ojs/ojpagingdataproviderview",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojswitch",
  "ojs/ojdialog",
  "ojs/ojinputtext",
  "ojs/ojmessages",
  "ojs/ojvalidation-datetime",
  "ojs/ojpagingcontrol",
  "jquery"
], function(oj, ko, ArrayDataProvider, api, keySet, PagingDataProviderView) {
  function notificationsViewModel() {
    var self = this;

    var notificationsURL = `${api}/api/notifications`;

    var userToken = sessionStorage.getItem("user_token");

    // var date = "2019-10-09 00:22:40";
    // date = date.toISOString();
    // datetime converter
    self.formatDateTime = function(date) {
      var formatDateTime = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: "datetime",
        dateFormat: "medium",
        timeFormat: "short"
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
    self.showDeleteNotifications = function(event) {
      document.getElementById("deleteNotifications").open();
    };

    //  Fetch all tracks
    self.fetchNotifications = async () => {
      try {
        const response = await fetch(`${notificationsURL}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        // const {
        //   data: { data }
        // } = await response.json();
        var data = await response.json();

        self.dataProvider(
          new PagingDataProviderView(
            new ArrayDataProvider(data.data, { keyAttributes: "id" })
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchNotifications();

    //mark all notifications as read
    self.markNotificationsAsRead = async () => {
      try {
        const response = await fetch(`${notificationsURL}/markasread`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const {
          data: { data }
        } = await response.json();
        // console.log(data)

        // self.dataProvider(
        //   new PagingDataProviderView(
        //     new ArrayDataProvider(data, { keyAttributes: "id" })
        //   )
        // );
      } catch (err) {
        console.log(err);
      }
    };

    self.clearNotifications = async () => {
      // Get the id of the selected element
      //   let track_id = self.currentItemId();

      //   let {
      //     data: { track_name }
      //   } = self.firstSelectedItem();

      try {
        const response = await fetch(`${notificationsURL}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
          }
          //   body: JSON.stringify({
          //     track_id
          //   })
        });

        // send a success message notification to the tracks view
        self.applicationMessages.push({
          severity: "confirmation",
          summary: "All Notifications cleared",
          detail: "All Notifications has been successfully cleared",
          autoTimeout: parseInt("0")
        });

        document.getElementById("deleteNotifications").close();
        self.fetchNotifications();
      } catch (err) {
        console.log(err);

        // send an error message notification to the tracks view
        self.applicationMessages.push({
          severity: "error",
          summary: "Error clearing notifications",
          detail: "Error trying to clear all notifications",
          autoTimeout: parseInt("0")
        });
      }
    };

    self.connected = function() {
      // self.markNotificationsAsRead();
      self.fetchNotifications();
      // self.fetchCount();
    };
  }
  return new notificationsViewModel();
});
