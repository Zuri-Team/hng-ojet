  define(['knockout', "jquery", "./api", 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojtable'],
  function(ko, $, api, Bootstrap, ArrayDataProvider)
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
        success: res => {
          if (res.status == true) {
            self.dataProvider(new ArrayDataProvider(res.data, {keyAttribute: 'id'}));
          }
        }
      });
    }
    
    fetchinterns();
  }

  return new internModel();
});
