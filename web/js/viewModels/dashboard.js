define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojmodule-element-utils",
  "jquery",
  "ojs/ojknockout",
  "ojs/ojoffcanvas",
  "ojs/ojbutton",
  "ojs/ojmodule",
  "ojs/ojcomposite",
  "ojs/ojavatar",
  "ojs/ojlabel",
  "ojs/ojprogress",
  "views/task-card/loader"
], function (oj, ko, moduleUtils) {
  function DashboardViewModel() {
    var self = this;
    var router = oj.Router.rootInstance;
    self.fullname = ko.observable("Seye Oyeniran");
    self.stage = ko.observable(3);
    self.track = ko.observable("Design");
    self.currentweek = ko.observable(2);
    self.totalweeks = ko.observable(10);
    self.progress = ko.observable(30);
    self.welcomeMessage = ko.observable();
    self.slack = ko.observable("@shazomii");
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

    self.submitTask = () => {
      router.go('submission');
    }

    self.drawer = {
      displayMode: "overlay",
      selector: "#drawer",
      content: "#main",
      modality: "modal"
    };

    self.toggleDrawer = function () {
      return oj.OffcanvasUtils.toggle(self.drawer);
    };

    self.logout = function () {
      sessionStorage.clear();
      router.go("login");
    };

    self.connected = function () {
      let user = sessionStorage.getItem("user");
      user = JSON.parse(user);
      if (sessionStorage.getItem("user_token") == null) {
        router.go("login");
      }
      self.fullname(`${user.firstname} ${user.lastname}`);
      self.track(`${user.stack}`);
      self.slack(user.slack);
      self.welcomeMessage(`Welcome, ${user.firstname} ${user.lastname}`)
    };
  }

  return new DashboardViewModel();
});
