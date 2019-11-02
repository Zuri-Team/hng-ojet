define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojinputtext",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojoffcanvas",
  "ojs/ojbutton",
  "ojs/ojdialog",
  "ojs/ojmodule",
  "ojs/ojcomposite",
  "ojs/ojavatar",
  "ojs/ojlabel",
  "ojs/ojfilepicker",
  "ojs/ojformlayout",
  "ojs/ojbutton",
  "ojs/ojcollapsible",
  "ojs/ojtrain",
  "ojs/ojmessages",
  "ojs/ojvalidation-datetime",
  "ojs/ojtimezonedata"
], function(oj, ko, $, api, ArrayDataProvider, ResponsiveUtils, ResponsiveKnockoutUtils) {
  function UserDashboardViewModel() {
    var self = this;
    var router = oj.Router.rootInstance;
    var userToken = sessionStorage.getItem("user_token");

    //logout button
    self.open = function (event) {
      document.getElementById('logoutModal').open();
    };
    self.logout = function() {
      sessionStorage.clear();
      router.go("login");
    };
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
    self.notifsCount = ko.observable();
    self.taskSubmit = ko.observableArray([]);
    self.notificationCount = ko.observable("");

    var submissionURL = `${api}/api/submissions`;
    var notificationsURL = `${api}/api/notifications`;

    self.stepArray = ko.observableArray([
      { id: "1" },
      { id: "2" },
      { id: "3" },
      { id: "4" },
      { id: "5" },
      { id: "6" },
      { id: "7" },
      { id: "8" },
      { id: "9" },
      { id: "10" }
    ]);
    self.updateLabelText = event => {
      var train = document.getElementById("train");
      self.selectedStepLabel(train.getStep(event.detail.value).label);
    };

    self.applicationMessages = ko.observableArray([]);

    //fetch unread notifications count
    self.fetchCount = async () => {
      try {
        const response = await fetch(`${notificationsURL}/notification_count`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        var data = await response.json();
        console.log(data);

        if (data.data.notification_count > 0)
          self.notificationCount(data.data.notification_count);
      } catch (err) {
        console.log(err);
      }
    };

    // datetime converter
    self.formatDateTime = date => {
      var formatDateTime = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: "datetime",
        dateFormat: "medium",
        timeFormat: "short",
        timeZone: "Africa/Lagos"
      });

      return formatDateTime.format(new Date(date).toISOString());
    };

    self.tasks = ko.observable({});

    function getTasks(id) {
      $.ajax({
        type: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`
        },

        url: `${api}/api/track/${id}/tasks`,
        success: function(res) {
          // console.log(res);
          let [latest] = res.data;
          latest.deadline = self.formatDateTime(latest.deadline);
          self.tasks(latest);
        }
      });
    }

    function fetchTrack(id) {
      $.ajax({
        type: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`
        },

        url: `${api}/api/user-profile/${id}`,
        success: function(response) {
          let [{ id, track_name }] = response.data.tracks;
          self.tracks(track_name);
          getTasks(id);
        }
      });
    }

    self.submitTask = async () => {
      let task_title = self.taskSubmit.task_title;
      let task_url = self.taskSubmit.task_url;
      let task_comment = self.taskSubmit.task_comment;
      console.log(task_url, task_comment);
      try {
        const response = await fetch(`${submissionURL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
          },
          body: JSON.stringify({
            task_title,
            task_url,
            task_comment
          })
        });

        self.applicationMessages.push({
          severity: "confirmation",
          summary: "Task submitted",
          detail: "You have successfully submitted " + track_name,
          autoTimeout: parseInt("0")
        });
        document.getElementById("taskURL").value = "";
        document.getElementById("taskComment").value = "";
        console.log("task submitted");
      } catch (err) {
        console.log(err);
        self.applicationMessages.push({
          severity: "error",
          summary: "Error submitting task",
          detail: "Error submitting task. Please try again.",
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

    self.tagsDataProvider = new ArrayDataProvider(this.tags, {
      keyAttributes: "value"
    });
    // self.searchTriggered = ko.observable();
    self.searchTerm = ko.observable();
    self.searchTimeStamp = ko.observable();

    self.search = function(event) {
      var eventTime = getCurrentTime();
      var trigger = event.type;
      var term;

      if (trigger === "ojValueUpdated") {
        // search triggered from input field
        // getting the search term from the ojValueUpdated event
        term = event["detail"]["value"];
        trigger += " event";
      } else {
        // search triggered from end slot
        // getting the value from the element to use as the search term.
        term = document.getElementById("search").value;
        trigger = "click on search button";
      }

      // self.searchTriggered("Search triggered by: " + trigger);
      self.searchTerm("Search term: " + term);
      self.searchTimeStamp("Last search fired at: " + eventTime);
    };


    this.keyword = ko.observableArray();

    self.fullname = ko.observable("");
    self.tracks = ko.observable("");
    self.slack = ko.observable("");
    self.fileNames = ko.observableArray([]);

    self.selectListener = function(event) {
      var files = event.detail.files;
      self.fileNames.push(files[i].name);
    };
     
  //   function fetchProbatedInterns() {
  //     $.ajax({
  //       url: `${api}/api/probation/all`,
  //       headers: {
  //         Authorization: "Bearer " + userToken
  //       },
  //       method: "GET",
  //       success: ({status, data}) => {
  //         if (status == "success") {
  //           for (index in data){
  //             self.probated_by(data[index].probated_by);
  //           self.probation_reason(data[index].probation_reason);
  //           self.user_id(data[index].user_id);
  //           self.probatedInternsId().push(self.user_id());
  //           }
            
  //           console.log(self.probated_by());
  //           console.log(self.probation_reason());
  //           // self.dataProvider(new PagingDataProviderView(new ArrayDataProvider(data, {keyAttributes: 'id'})));
  //       }
  
  //     }
  //   });  
  // }
  // fetchProbatedInterns();

    //route to notifications
    self.gotoNotifications = function() {
      router.go("notifications");
    };

    self.connected = function() {
      if (sessionStorage.getItem("user_token") == null) {
        router.go("login");
      }
      let user = sessionStorage.getItem("user");
      user = JSON.parse(user);
      fetchTrack(user.id);
      self.fullname(`${user.firstname} ${user.lastname}`);
      self.stepArray().map((stage, i) => {
        stage.disabled = true;
        if (i + 1 == user.stage) {
          stage.disabled = false;
          self.selectedStepValue(stage.id);
          self.selectedStepLabel = ko.observable(stage.id);
        }
      });

      //notifications unread count
      self.fetchCount();

      //notifications click
      $("#notifi").on("click", function() {
        let attr = $(this).attr("for");
        $("#maincontent_intern_body > div").hide();
        $(`#maincontent_intern_body > div[id='${attr}']`).show();
      });

      $("#sidebar li a").on("click", function() {
        let attr = $(this).attr("for");
        $("#maincontent_intern_body > div").hide();
        $(`#maincontent_intern_body > div[id='${attr}']`).show();
      });
    };
  }
  return new UserDashboardViewModel();
});
