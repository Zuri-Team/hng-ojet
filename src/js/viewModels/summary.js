define(['knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojknockout'],
function(ko, $, api, Bootstrap, ArrayDataProvider)
{   
function summaryModel() {

  var self = this;
  self.chartProvider = ko.observable();
  self.trackProvider = ko.observable();
  self.stageProvider = ko.observable();

/* chart data */


var userToken = sessionStorage.getItem("user_token");


           
      function fetchsummary () {
        $.ajax({
          url: `${api}/api/stats/summary`,
          headers:{
            Authorization: "Bearer " + userToken
          },
          method: "GET",
          success: ({status, data}) => {
            if (status == "success") {
              // console.log(data);
              self.chartProvider(new ArrayDataProvider(data.gender, {keyAttributes: 'id'}));
              // console.log(self.chartProvider());
              self.stageProvider(new ArrayDataProvider(data.stages, {keyAttributes: 'id'}));
              self.trackProvider(new ArrayDataProvider(data.tracks, {keyAttributes: 'id'}));
              // self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
          }
        }
        });  
      }

      fetchsummary();

};

return new summaryModel();
});