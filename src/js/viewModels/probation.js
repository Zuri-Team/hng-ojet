define([
  "knockout",
  "jquery",
  "./api",
  "ojs/ojbootstrap",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "ojs/ojavatar",
  "ojs/ojtable",
  "ojs/ojlistview",
  "ojs/ojlabel"
], function(ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView) {
  function probationViewModel() {
    var self = this;
    self.interns = ko.observableArray([]);
    self.firstSelectedIntern = ko.observable();

    self.id = ko.observable();
    self.firstname = ko.observable();
    self.lastname = ko.observable();
    self.username = ko.observable();
    self.isUserProfile = ko.observable(false);
    self.totalInterns = ko.observable("");
    self.user_id = ko.observable();
    self.probated_by = ko.observable();
    self.probation_reason = ko.observable();
    self.probatedInterns = ko.observableArray([]);
    self.probatedInternsId = ko.observableArray([]);
    self.avatarSize = ko.observable("md");

    self.dataProvider = ko.observable();

    var userToken = localStorage.getItem("user_token");

    self.selectedInternChanged = function(event) {
      // Check whether click is a category selection or deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display interns
        // Populate iterns list observable using firstSelectedXxx API
        let { data } = self.firstSelectedIntern();
        if (data == null) {
          return;
        } else {
          self.isUserProfile(true);
        }
      }
    };
    self.fetchdashboard = function() {
      $.ajax({
        url: `${api}/api/probation/all`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: ({ status, data }) => {
          if (status == "success") {
            self.totalInterns(data.length);
            // console.log(data);
          }
        }
      });
    };

    self.fetchdashboard();

    self.fetchProbatedInterns = function() {
      $.ajax({
        url: `${api}/api/probation/all`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: ({ status, data }) => {
          if (status == "success") {
            for (index in data) {
              data[index].id = data[index].user_id;
            }
            self.dataProvider(
              new PagingDataProviderView(
                new ArrayDataProvider(data, { keyAttributes: "user_id" })
              )
            );
          }
        }
      });
    };
    self.fetchProbatedInterns();

    self.connected = function() {
      self.fetchProbatedInterns();
    };
  }

  return new probationViewModel();
});
