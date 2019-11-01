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
  fetchdashboard();
  // fetchinterns();
  fetchProbatedInterns();
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
    }
  
  fetchdashboard();
  
//   function fetchinterns() {
//     $.ajax({
//       url: `${api}/api/interns`,
//       headers: {
//         Authorization: "Bearer " + userToken
//       },
//       method: "GET",
//       success: ({status, data}) => {
//         if (status == true) {
//           // console.log(data);
//           for (intern of data){
//             for (id of self.probatedInternsId()){
//               if (intern.id === id){
//                 // console.log(intern);
//                 self.probatedInterns().push(intern);
//                 // var probatedInterns = self.probatedInterns();
//             self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(self.probatedInterns(), {keyAttributes: 'id'})));
//               }
//             }
//           }
//       }

//     }
//   });  
// }
// fetchinterns();

    // self.fetchProbatedInterns = async()=>{
    //   try {
    //     const response = await fetch(
    //       `${api}/api/probation/all`,{
    //         method: "GET",
    //         headers: {
    //           Authorization: "Bearer " + userToken
    //         }
    //       });
    //       console.log(response)
    //       const {status, data} = await response.json();
    //       if (status == "success") {
    //         for (index in data){
    //           self.probated_by(data[index].probated_by);
    //         self.probation_reason(data[index].probation_reason);
    //         self.user_id(data[index].user_id);
    //         self.probatedInternsId().push(self.user_id());
    //         }
            
    //         console.log(self.probated_by());
    //         console.log(self.probation_reason());
    //         // self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    function fetchProbatedInterns() {
      $.ajax({
        url: `${api}/api/probation/all`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: ({status, data}) => {
          if (status == "success") {
            console.log(data);
            for (index in data){
              data[index].id = data[index].user_id;
            }
            // for (index in data){
            //   self.probated_by(data[index].probated_by);
            // self.probation_reason(data[index].probation_reason);
            // self.user_id(data[index].user_id);
            // self.probatedInternsId().push(self.user_id());
            // }
            
            console.log(self.probated_by());
            console.log(self.probation_reason());
            self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'user_id'})));
        }
  
      }
    });  
  }
  fetchProbatedInterns();


}

  return new probationViewModel();
  });
