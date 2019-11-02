  define(['knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview',  'ojs/ojpagingcontrol', 'ojs/ojknockout', 'ojs/ojtable',  "ojs/ojlistview", "ojs/ojlabel",],
  function(ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView)
  { 
  function probationViewModel() {
    var self = this;
    self.interns = ko.observableArray([]);
    self.firstSelectedIntern = ko.observable();

    self.id = ko.observable();
    self.firstname = ko.observable();
    self.lastname = ko.observable();
    self.username = ko.observable();
    self.isUserProfile = ko.observable(false);
    self.totalInterns = ko.observable('');
    self.user_id = ko.observable();
    self.probated_by = ko.observable();
    self.probation_reason = ko.observable();
    self.probatedInterns = ko.observableArray([]);
    self.probatedInternsId = ko.observableArray([]);

    self.dataProvider = ko.observable();

    

    var userToken = sessionStorage.getItem("user_token");

    self.selectedInternChanged = function(event) {
      // Check whether click is a category selection or deselection
      if (event.detail.value.length != 0) {
        // If selection, populate and display interns
        // Populate iterns list observable using firstSelectedXxx API
        let { data } = self.firstSelectedIntern();
        console.log(data)
        if (data == null) {
          return;
        } else {
         console.log("clicked");
         self.isUserProfile(true);
        }
      }
    };
    function fetchdashboard () {
      $.ajax({
        url: `${api}/api/probation/all`,
        headers:{
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: ({status, data}) => {
            if (status == "success") {
                self.totalInterns(data.length);
                // console.log(data);
            }
        }
      });  
      setTimeout(fetchdashboard, 15000);
    }
  
  fetchdashboard();
 
    function fetchProbatedInterns() {
      $.ajax({
        url: `${api}/api/probation/all`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: ({status, data}) => {
          if (status == "success") {
            // console.log(data);
            for (index in data){
              data[index].id = data[index].user_id;
            }
            self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'user_id'})));
        }
  
      }
    }); 
    setTimeout(fetchProbatedInterns, 15000); 
  }
  fetchProbatedInterns();


}

  return new probationViewModel();
  });
