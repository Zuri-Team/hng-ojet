define([
  "knockout",
  "ojs/ojbootstrap",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojinputnumber",
  "ojs/ojtable",
  "ojs/ojlabel",
  "ojs/ojvalidationgroup"
], function(ko, Bootstrap, ArrayDataProvider) {
  function InternViewModel() {
    var self = this;
    var internArray = [
      {
        InternId: "HNGI0001",
        InternName: "Jude Jay",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "Gospel Chinyereugo",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "Abasifreke",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "Mannie",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "Janet john",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "John",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "Shazomi",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "Angela",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "Akeju",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      },
      {
        InternId: "HNGI0001",
        InternName: "Uncle Miscellaneous",
        PhoneNumber: 08109503956,
        Track: "OJET",
        Points: 3000,
        Stage: 6
      }
    ];
    self.internObservableArray = ko.observableArray(internArray);
    self.dataprovider = new ArrayDataProvider(self.internObservableArray, {
      keyAttributes: "@index"
    });
    self.groupValid = ko.observable();

    //add to the observableArray
    self.addRow = function() {
      if (self.groupValid() == "invalidShown") {
        return;
      }
      var user = {
        InternId: self.inputInternId(),
        InternName: self.inputInternName(),
        PhoneNumber: self.inputPhoneNumber(),
        Track: self.inputTrack(),
        Points: self.inputPoints(),
        Stage: self.inputStage()
      };
      self.internObservableArray.push(user);
    }.bind(self);

    //used to update the fields based on the selected row
    self.updateRow = function() {
      if (self.groupValid() == "invalidShown") {
        return;
      }
      var element = document.getElementById("table");
      var currentRow = element.currentRow;

      if (currentRow != null) {
        self.internObservableArray.splice(currentRow["rowIndex"], 1, {
          InternId: self.inputInternId(),
          InternName: self.inputInternName(),
          PhoneNumber: self.inputPhoneNumber(),
          Track: self.inputTrack(),
          Points: self.inputPoints(),
          Stage: self.inputStage()
        });
      }
    }.bind(self);

    //used to remove the selected row
    self.removeRow = function() {
      var element = document.getElementById("table");
      var currentRow = element.currentRow;

      if (currentRow != null) {
        self.internObservableArray.splice(currentRow["rowIndex"], 1);
      }
    }.bind(self);

    //intialize the observable values in the forms
    self.inputInternId = ko.observable();
    self.inputInternName = ko.observable();
    self.inputPhoneNumber = ko.observable();
    self.inputTrack = ko.observable();
    self.inputPoints = ko.observable();
    self.inputStage = ko.observable();
    self.currentRowListener = function(event) {
      var data = event.detail;
      if (event.type == "currentRowChanged" && data["value"] != null) {
        var rowIndex = data["value"]["rowIndex"];
        var intern = self.internObservableArray()[rowIndex];
        if (intern != null) {
          self.inputInternId(intern["InternId"]);
          self.inputInternName(intern["InternName"]);
          self.inputPhoneNumber(intern["PhoneNumber"]);
          self.inputTrack(intern["Track"]);
          self.inputPoints(intern["Points"]);
          self.inputStage(intern["Stage"]);
        }
      }
    }.bind(self);
  }

  // Bootstrap.whenDocumentReady().then(
  //   function()
  //   {
  //     ko.applyBindings(vm, document.getElementById('tableDemo'));
  //     var table = document.getElementById('table');
  //     table.addEventListener('currentRowChanged', currentRowListener());
  //   }
  //   );
  return new InternViewModel();
});
