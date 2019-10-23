define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojinputtext",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojoffcanvas",
  "ojs/ojbutton",
  "ojs/ojmodule",
  "ojs/ojcomposite",
  "ojs/ojavatar",
  "ojs/ojlabel",
  "ojs/ojfilepicker",
  "ojs/ojformlayout",
  "ojs/ojbutton",
  "ojs/ojcollapsible",
  "ojs/ojtrain",
  "ojs/ojmessages"
], function(oj, ko, $, ResponsiveUtils, ResponsiveKnockoutUtils) {
  function UserDashboardViewModel() {
    var self = this;
    var router = oj.Router.rootInstance;

    self.selectedItem = ko.observable("Dashboard");

    self.isSmall = ResponsiveKnockoutUtils.createMediaQueryObservable(
      ResponsiveUtils.getFrameworkQuery(
        ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
      )
    );
    // toggle hambuger on navbar
    self.toggleDrawer = function() {
      $("#maincontent, #sidebar").toggleClass("smactive");
    };
    self.sb_sm = ko.observable(false);
    self.searchbar_sm = function() {
      self.sb_sm(!self.sb_sm());
    };

    self.selectedStepValue = ko.observable();
    self.selectedStepLabel = ko.observable();

    self.stepArray = ko.observableArray([
      { label: "Stage One", id: "1" },
      { label: "Stage Two", id: "2" },
      { label: "Stage Three", id: "3" },
      { label: "Stage Four", id: "4" },
      { label: "Stage Five", id: "5" },
      { label: "Stage Six", id: "6" },
      { label: "Stage Seven", id: "7" },
      { label: "Stage Eight", id: "8" },
      { label: "Stage Nine", id: "9" },
      { label: "Stage Ten", id: "10" }
    ]);
    self.updateLabelText = event => {
      var train = document.getElementById("train");
      self.selectedStepLabel(train.getStep(event.detail.value).label);
    };

    self.stepArray().map((stage, i) => {
      stage.disabled = true;
      if (i + 1 == 7) {
        stage.disabled = false;
        self.selectedStepValue(stage.id);
        self.selectedStepLabel = ko.observable(stage.id);
      }
    });
    // console.log(self.stepArray());

    self.tasks = ko.observableArray([
      {
        taskTitle: "Chatbot App",
        details:
          "Create a chatbot app for slack. The app should be able to save conversations to external hard drive."
      },
      {
        taskTitle: "Deploy a Serverless App",
        details: "Here are the details for the Serverless App"
      }
    ]);

    self.applicationMessages = ko.observableArray([]);
    self.url = ko.observable("");
    self.taskDescription = ko.observable("");

    self.submitTask = () => {
      if (self.url() !== "" && self.taskDescription() != "") {
        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Task has been submitted successfully",
          autoTimeout: parseInt("0")
        });
      } else {
        self.applicationMessages.push({
          severity: "error",
          summary: "Please fill in all the fields before submitting task",
          autoTimeout: parseInt("0")
        });
      }
    };

    this.tags = ko.observableArray([
      { value: ".net", label: ".net" },
      { value: "Accounting", label: "Accounting" },
      { value: "ADE", label: "ADE" },
      { value: "Adf", label: "Adf" },
      { value: "Adfc", label: "Adfc" },
      { value: "Adfm", label: "Adfm" },
      { value: "Android", label: "Android" },
      { value: "Aria", label: "Aria" },
      { value: "C", label: "C" },
      { value: "C#", label: "C#" },
      { value: "C++", label: "C++" },
      { value: "Chrome", label: "Chrome" },
      { value: "Cloud", label: "Cloud" },
      { value: "CSS3", label: "CSS3" },
      { value: "DBA", label: "DBA" },
      { value: "Eclipse", label: "Eclipse" },
      { value: "Firefox", label: "Firefox" },
      { value: "Git", label: "Git" },
      { value: "Hibernate", label: "Hibernate" },
      { value: "HTML", label: "HTML" },
      { value: "HTML5", label: "HTML5" },
      { value: "IE", label: "IE" },
      { value: "IOS", label: "IOS" },
      { value: "Java", label: "Java" },
      { value: "Javascript", label: "Javascript" },
      { value: "JDeveloper", label: "JDeveloper" },
      { value: "Jet", label: "jet" },
      { value: "JQuery", label: "JQuery" },
      { value: "JQueryUI", label: "JQueryUI" },
      { value: "JS", label: "JS" },
      { value: "Knockout", label: "Knockout" },
      { value: "MAF", label: "MAF" },
      { value: "Maven", label: "Maven" },
      { value: "MCS", label: "MCS" },
      { value: "MySql", label: "MySql" },
      { value: "Netbeans", label: "Netbeans" },
      { value: "Oracle", label: "Oracle" },
      { value: "Solaris", label: "solaris" },
      { value: "Spring", label: "spring" },
      { value: "Svn", label: "Svn" },
      { value: "UX", label: "UX" },
      { value: "xhtml", label: "xhtml" },
      { value: "XML", label: "XML" }
    ]);

    this.keyword = ko.observableArray();

    self.fileNames = ko.observableArray([]);

    self.selectListener = function(event) {
      var files = event.detail.files;
        self.fileNames.push(files[i].name);
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
      self.tracks(`${user.stack}`);

      $("#sidebar li a").on("click", function() {
        let attr = $(this).attr("for");
        $("#maincontent_intern_body > div").hide();
        $(`#maincontent_intern_body > div[id='${attr}']`).show();
      });
    };
  }
  return new UserDashboardViewModel();
});
