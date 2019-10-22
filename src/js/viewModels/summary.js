//   define(['knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview',  'ojs/ojpagingcontrol', 'ojs/ojknockout', 'ojs/ojchart', 'ojs/ojtable'],
//   function(ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView)
//   { 
//   function summaryModel() {
//     self = this;
//     self.interns = ko.observableArray([]);

//     self.id = ko.observable();
//     self.firstname = ko.observable();
//     self.lastname = ko.observable();
//     self.username = ko.observable();

//     self.dataProvider = ko.observable();
//     self.genderMaleValue = ko.observable();
//     self.genderFemaleValue = ko.observable();
//     self.genderDataProvider = ko.observable();
//     var countMale=0;
//     var countFemale=0;

//     var userToken = sessionStorage.getItem("user_token");

//     function fetchinterns() {
//       $.ajax({
//         url: `${api}/api/interns`,
//         headers: {
//           Authorization: "Bearer " + userToken
//         },
//         method: "GET",
//         success: ({status, data}) => {
//           if (status == true) {
//             self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
//             for (intern of data){
//             console.log(intern);
//               if (intern.gender==='male'){
//                 countMale++;
//               } else if (intern.gender==='female'){
//                 countFemale++;
//               } else {
//                 countMale++;
//               }
//               self.genderMaleValue(countMale);
//               self.genderFemaleValue(countFemale);
//             }
            
           
//         }
//       }
//     });  
//   }
//   fetchinterns();

//   /* chart data */
//   self.genderDataProvider(new ArrayDataProvider(data, {keyAttributes: 'id'}));

// }
//   return new summaryModel();
//   });


define(['knockout', 'ojs/ojbootstrap','ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojknockout'],
function(ko, Bootstrap, ArrayDataProvider)
{   
function ChartModel() {

  var self = this;
  self.dataProvider = ko.observable();
/* chart data */
var array = [
  {
    "id": 0,
    "series": "Male",
    "group": "Gender",
    "value": 42
  },
  {
    "id": 1,
    "series": "Female",
    "group": "Gender",
    "value": 55
  }
]

self.dataProvider(new ArrayDataProvider(array, {keyAttributes: 'id'}));
}

return new ChartModel();
});