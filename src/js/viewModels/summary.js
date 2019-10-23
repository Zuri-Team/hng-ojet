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


define(['knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojknockout'],
function(ko, Bootstrap, ArrayDataProvider)
{   
function summaryModel() {

  var self = this;
  self.chartProvider = ko.observable();
  self.trackProvider = ko.observable();
  self.stageProvider = ko.observable();

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
// console.log(array[0].value)
self.chartProvider(new ArrayDataProvider(array, {keyAttributes: 'id'}));
// console.log(self.chartProvider())

//Tracks data summary
var tracks = [
  {
    "id": 0,
    "series": "Front-end",
    "group": "Tracks",
    "value": 200
  },
  {
    "id": 1,
    "series": "Digital Marketing",
    "group": "Tracks",
    "value": 30
  },
  {
    "id": 2,
    "series": "Backend",
    "group": "Tracks",
    "value": 100
  },
  {
    "id": 3,
    "series": "Machine Learning",
    "group": "Tracks",
    "value": 50
  },
  {
    "id": 4,
    "series": "Devops",
    "group": "Tracks",
    "value": 40
  }
]
self.trackProvider(new ArrayDataProvider(tracks, {keyAttributes: 'id'}));

// Stage data summary
var stage =   [
  {
    "id": 0,
    "series": "Active",
    "group": "Stage 1",
    "value": 4209
  },
  {
    "id": 1,
    "series": "Deactivated",
    "group": "Stage 1",
    "value": 2000
  },
  {
    "id": 2,
    "series": "Active",
    "group": "Stage 2",
    "value": 3445
  },
  {
    "id": 3,
    "series": "Deactivated",
    "group": "Stage 2",
    "value": 340
  },
  {
    "id": 4,
    "series": "Active",
    "group": "Stage 3",
    "value": 554
  },
  {
    "id": 5,
    "series": "Deactivated",
    "group": "Stage 3",
    "value": 555
  },
  {
    "id": 6,
    "series": "Active",
    "group": "Stage 4",
    "value": 304
  },
  {
    "id": 7,
    "series": "Deactivated",
    "group": "Stage 4",
    "value": 230
  },
  {
    "id": 8,
    "series": "Active",
    "group": "Stage 5",
    "value": 365
  },
  {
    "id": 9,
    "series": "Deactivated",
    "group": "Stage 5",
    "value": 136
  },
  {
    "id": 10,
    "series": "Active",
    "group": "Stage 6",
    "value": 504
  },
  {
    "id": 11,
    "series": "Deactivated",
    "group": "Stage 6",
    "value": 50
  },
  {
    "id": 12,
    "series": "Active",
    "group": "Stage 7",
    "value": 224
  },
  {
    "id": 13,
    "series": "Deactivated",
    "group": "Stage 7",
    "value": 12
  },
  {
    "id": 14,
    "series": "Active",
    "group": "Stage 8",
    "value": 146
  },
  {
    "id": 15,
    "series": "Deactivated",
    "group": "Stage 8",
    "value": 6
  },
  {
    "id": 16,
    "series": "Active",
    "group": "Stage 9",
    "value": 122
  },
  {
    "id": 17,
    "series": "Deactivated",
    "group": "Stage 9",
    "value": 2
  },
  {
    "id": 18,
    "series": "Active",
    "group": "Stage 10",
    "value": 106
  },
  {
    "id": 19,
    "series": "Deactivated",
    "group": "Stage 10",
    "value": 3
  }
]
self.stageProvider(new ArrayDataProvider(stage, {keyAttributes: 'id'}));

};

return new summaryModel();
});