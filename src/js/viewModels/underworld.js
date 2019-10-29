  define(['knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview',  'ojs/ojpagingcontrol', 'ojs/ojknockout', 'ojs/ojtable',  "ojs/ojlistview", "ojs/ojlabel",],
  function(ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView)
  { 
  function underworldModel() {
    var self = this;
    self.interns = ko.observableArray([]);
    self.firstSelectedIntern = ko.observable();

    self.id = ko.observable();
    self.firstname = ko.observable();
    self.lastname = ko.observable();
    self.username = ko.observable();
    self.isUserProfile = ko.observable(false);
    self.totalInterns = ko.observable('');

    self.dataProvider = ko.observable();

    

    var userToken = sessionStorage.getItem("user_token");

    self.selectedInternChanged = function(event) {
      // Check whether click is a category selection or deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display Category details
        // Populate items list observable using firstSelectedXxx API
        let { data } = self.firstSelectedIntern();
        // console.log(data)
        if (data == null) {
          return;
        } else {
        //  console.log("clicked")
         self.isUserProfile(true);
        }
      }
    };
    function fetchdashboard () {
      $.ajax({
        url: `${api}/api/stats/dashboard`,
        headers:{
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: ({status, data}) => {
            if (status == true) {
                self.totalInterns(data.total_interns);
            }
        }
      });  
    }
  
  fetchdashboard();

    function fetchinterns() {
      $.ajax({
        url: `${api}/api/interns`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: ({status, data}) => {
          if (status == true) {
            // console.log(data)
            self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
        }
  
      }
    });  
  }
  fetchinterns();
}

  return new underworldModel();
  });
