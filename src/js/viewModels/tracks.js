define([
  "knockout",
  "ojs/ojarraytreedataprovider",
  "./api",
  "ojs/ojknockout-keyset",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojswitch",
  "ojs/ojdialog",
  "ojs/ojinputtext"
], function(ko, ArrayTreeDataProvider, api, keySet) {
  function tracksViewModel() {
    var self = this;

    var tracksURL = `${api}/api/track`;

    var userToken = sessionStorage.getItem("user_token");

    self.selectedItems = new keySet.ObservableKeySet(); // observable bound to selection option to monitor current selections
    self.selectedSelectionRequired = ko.observable(false);
    self.firstSelectedItem = ko.observable();

    self.selectedIds = ko.observableArray([]);
    self.currentItemId = ko.observable();

    self.dataProvider = ko.observable();

    self.handleSelectionChanged = function(event)
          {
              self.selectedIds(event.detail.value); // show selected list item elements' ids
            
          
            };
  
          self.handleCurrentItemChanged = function(event)
          {
              var itemId = event.detail.value
              // Access current item via ui.item
              self.currentItemId(itemId);
              console.log(self.currentItemId())
          }

    self.fetchTracks = async () => {
      try {
        const response = await fetch(`${tracksURL}/list`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const {
          data: { data }
        } = await response.json();

        console.log(data);
        self.dataProvider(
          new ArrayTreeDataProvider(data, { keyAttributes: "id" })
        );
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchTracks();

    self.createTrack = () => {
      console.log("track created")
    }

    self.editTrack = () => {
      console.log("mama");
    };
    self.deleteTrack = () => {
      console.log("papa");
    };
  }
  return new tracksViewModel();
});
