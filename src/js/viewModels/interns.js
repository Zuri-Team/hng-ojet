  define(['knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview',  'ojs/ojpagingcontrol', 'ojs/ojknockout', 'ojs/ojtable'],
  function(ko, $, api, Bootstrap, ArrayDataProvider, PagingDataProviderView)
  { 
  function internModel() {
    self = this;
    self.interns = ko.observableArray([]);

    self.id = ko.observable();
    self.firstname = ko.observable();
    self.lastname = ko.observable();
    self.username = ko.observable();

    self.dataProvider = ko.observable();

    var userToken = sessionStorage.getItem("user_token");

    function fetchinterns() {
      $.ajax({
        url: `${api}/api/interns`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: ({status, data}) => {
          if (status == true) {
            self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
        }
      }
    });  
  }
  fetchinterns();
}
  return new internModel();
  });
