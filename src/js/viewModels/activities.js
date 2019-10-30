define([
    "knockout",
    "jquery",
    "./api",
    "ojs/ojarraydataprovider",
    "ojs/ojpagingdataproviderview",
    "ojs/ojmodel",
    "ojs/ojlistview",
    "ojs/ojdialog",
    "ojs/ojvalidation-datetime",
    "ojs/ojtimezonedata",
    "ojs/ojpagingcontrol",
    'ojs/ojbutton', 'ojs/ojradioset', 'ojs/ojlabel'
  ], function(ko, $, api, ArrayDataProvider, Paging) {
    function activityModel() {
      let self = this;
      let RESTurl = `${api}/api/activity`;
      let userToken = sessionStorage.getItem("user_token");

      self.activityToView = ko.observable('all');
      self.searchQuery - ko.observable('');
  

        self.activityToView.subscribe(function (newValue) {
            var radiosetInstances = document.getElementById('formId').querySelectorAll('oj-radioset');
            for (var i = 0; i < radiosetInstances.length; i++) {
              if (newValue === "all") {
                self.fetchActivities("all")
              } else if (newValue === "admin") {
                self.fetchActivities("admins")
              } else if (newValue === "intern") {
                self.fetchActivities("interns")
              }
            }
          });

          self.fetchActivities = async(role) => {
            try {
                const response = await fetch(`${RESTurl}/${role}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                const data = await response.json();
                console.log(data)

                // self.dataProvider(
                //     new PagingDataProviderView(new ArrayDataProvider(data, { keyAttributes: "id" })));
            } catch (err) {
                console.log(err);
            }
        };
 
    }
  
    return new activityModel();
  });
  