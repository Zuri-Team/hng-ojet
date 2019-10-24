define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojmodule-element-utils",
  "jquery",
  "./api",
  "ojs/ojknockout",
  "ojs/ojoffcanvas",
  "ojs/ojbutton",
  "ojs/ojmodule",
  "ojs/ojcomposite",
  "ojs/ojavatar",
  "ojs/ojlabel",
  "ojs/ojprogress",
  "views/task-card/loader",
  "ojs/ojtrain"
], function(oj, ko, moduleUtils, $, api) {
  function DashboardViewModel() {
    var self = this;
    var router = oj.Router.rootInstance;
    var internsURL = `${api}/api/interns`;
    self.fullname = ko.observable("Seye Oyeniran");
    self.stage = ko.observable(1);
    self.track = ko.observable("Design");
    self.currentweek = ko.observable(1);
    self.totalweeks = ko.observable(10);
    self.progress = ko.observable(30);
    self.welcomeMessage = ko.observable();
    self.slack = ko.observable("@shazomii");

    self.selectedItem = ko.observable("User Dashboard");
    self.selectedStepValue = ko.observable("stg1");
    self.selectedStepLabel = ko.observable("Stage One");

    self.stepArray = ko.observableArray([
      { label: "Stage One", id: "stg1" },
      { label: "Stage Two", id: "stg2" },
      { label: "Stage Three", id: "stg3" },
      { label: "Stage Four", id: "stg4" },
      { label: "Stage Five", id: "stg5" },
      { label: "Stage Six", id: "stg6" },
      { label: "Stage Seven", id: "stg7" },
      { label: "Stage Eight", id: "stg8" },
      { label: "Stage Nine", id: "stg9" },
      { label: "Stage Ten", id: "stg10" }
    ]);
    self.updateLabelText = event => {
      var train = document.getElementById("train");
      self.selectedStepLabel(train.getStep(event.detail.value).label);
    };
    self.tasks = [
      {
        taskTitle: "Create a Chatbot App",
        details: "Here are details for the Chatbot App"
      },
      {
        taskTitle: "Deploy a Serverless App",
        details: "Here are the details for the Serverless App"
      }
    ];

    self.fetchNotifs = async() => {
      try {
          const response = await fetch(`${internsURL}/list`, {
              headers: {
                  Authorization: `Bearer ${userToken}`
              }
          });
          const {
              data: { data }
          } = await response.json();
          console.log(data);

      } catch (err) {
          console.log(err);
      }
  };
  self.fetchNotifs();

    self.submitTask = () => {
      router.go("submission");
    };

    self.drawer = {
      displayMode: "overlay",
      selector: "#drawer",
      content: "#main",
      modality: "modal"
    };

    self.toggleDrawer = function() {
      return oj.OffcanvasUtils.toggle(self.drawer);
    };

    self.logout = function() {
      sessionStorage.clear();
      router.go("login");
    };

    self.connected = function() {
      let user = sessionStorage.getItem("user");
      user = JSON.parse(user);
      if (sessionStorage.getItem("user_token") == null) {
        router.go("login");
      }
      self.fullname(`${user.firstname} ${user.lastname}`);
      self.track(`${user.stack}`);
      console.log(user);
      self.slack(user.slack);
      self.stage(1);
      self.currentweek(1);
      self.welcomeMessage(`Welcome, ${user.firstname} ${user.lastname}`);
    };
  }

  return new DashboardViewModel();
});
