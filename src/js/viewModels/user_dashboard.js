define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./api",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
  "ojs/ojpagingcontrol",
  "ojs/ojlistview",
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
  "ojs/ojtimezonedata",
  "ojs/ojradioset"
], function(oj, ko, $, api, ArrayDataProvider, PagingDataProviderView) {
  function UserDashboardViewModel() {
    var self = this;
    var router = oj.Router.rootInstance;
    var userToken = sessionStorage.getItem("user_token");
    var user = sessionStorage.getItem("user");
    user = JSON.parse(user);
    self.user_id = ko.observable(user.id);

    self.selectedItem = ko.observable();
    self.dataProvider = ko.observable();

    self.tracksArray = ko.observable([]);

    self.isNotify = ko.observable(false);

    self.drawer = {
      displayMode: "overlay",
      selector: "#sidebar",
      content: "#maincontent"
    };

    self.toggleDrawer = function() {
      self.isNotify(false);
      return oj.OffcanvasUtils.toggle(self.drawer);
    };

    //logout button
    self.open = function(event) {
      document.getElementById("logoutModal").open();
    };
    self.logout = function() {
      sessionStorage.clear();
      router.go("login");
    };

    self.sb_sm = ko.observable(false);
    self.searchbar_sm = function() {
      self.sb_sm(!self.sb_sm());
    };

    self.selectedStepValue = ko.observable();
    self.selectedStepLabel = ko.observable();

    //self.notifsCount = ko.observable();
    self.newTrack = ko.observableArray([]); //newItem holds data for the create track dialog
    self.track = ko.observableArray([]);
    self.tracks_id = ko.observable();
    self.chosenAction = ko.observable("");

    self.notifsCount = ko.observable();
    self.taskSubmit = ko.observable({});

    // tasks specific observables
    self.taskURL = ko.observable({});
    self.task = ko.observableArray([]);
    self.task_id = ko.observable();
    self.comment = ko.observable();

    self.notificationCount = ko.observable("");
    self.probated_by = ko.observable();
    self.probation_reason = ko.observable();
    self.deadline = ko.observable();
    self.onProbation = ko.observable(false);

    var notificationsURL = `${api}/api/notifications`;

    self.popModal = () => {
      document.getElementById("requestDialog").open();
    };

    self.revealModal = () => {
      document.getElementById("submitDialog").open();
    };

    self.submitRequest = async () => {
      const track_id = self.tracks_id();
      const user_id = self.user_id();
      const reason = self.newTrack.reason;
      const action = self.chosenAction();
      try {
        const response = await fetch(`${api}/api/track-requests/send-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
          },
          body: JSON.stringify({
            track_id,
            user_id,
            action,
            reason
          })
        });
        const { message } = await response.json();
        document.getElementById("requestDialog").close();
        self.applicationMessages.push({
          severity: "confirmation",
          summary: `Track Request`,
          detail: `${message}`,
          autoTimeout: parseInt("0")
        });
      } catch (err) {
        console.log(err);
        self.applicationMessages.push({
          severity: "error",
          summary: `Error sending request`,
          detail: `${message}`,
          autoTimeout: parseInt("0")
        });
      }
    };

    self.submitTask = async () => {
      const task_id = self.task_id();
      const user_id = self.user_id();
      const submission_link = self.taskURL().url;
      const comment = self.comment();

      try {
        const response = await fetch(`${api}/api/submissions`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userToken}`
          },
          body: JSON.stringify({
            user_id,
            task_id,
            submission_link,
            comment
          })
        });
        const { message, status } = await response.json();
        document.getElementById("submitDialog").close();
        if (status == 200) {
          self.applicationMessages.push({
            severity: "confirmation",
            summary: `Track Request`,
            detail: `${message}`,
            autoTimeout: parseInt("0")
          });
        } else {
          self.applicationMessages.push({
            severity: "error",
            summary: `Error sending request`,
            detail: `${message}`,
            autoTimeout: parseInt("0")
          });
        }
      } catch (err) {
        console.log(err);
        self.applicationMessages.push({
          severity: "error",
          summary: `Error sending request`,
          detail: `${message}`,
          autoTimeout: parseInt("0")
        });
      }
    };

    //  Fetch all tracks
    self.fetchTracks = async () => {
      try {
        const response = await fetch(`${api}/api/track/all`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const {
          data: { data }
        } = await response.json();

        self.track(data.map(track => track));
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchTracks();

    self.fetchTasks = async () => {
      try {
        const response = await fetch(`${api}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        // return console.log(await response.json());
        const { data } = await response.json();

        self.task(data.map(task => task));
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchTasks();

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
        // console.log(data);

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

    self.getTasks = async id => {
      try {
        const response = await fetch(`${api}/api/track/${id}/tasks`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        const { data } = await response.json();
        // console.log(data);

        self.dataProvider(
          new PagingDataProviderView(
            new ArrayDataProvider(data, {
              keys: data.map(function(value) {
                value.deadline = self.formatDateTime(value.deadline);
                return value.title;
              })
            })
          )
        );
      } catch (err) {
        console.log(err);
      }
    };

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
          self.tracksArray(
            response.data.tracks.map(tracks => `   ${tracks.track_name}`)
          );
          self.getTasks(id);
        }
      });
    }

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

    //route to notifications
    self.gotoNotifications = function() {
      router.go("notifications");
    };

    self.profile_img = ko.observable("/css/images/smiley.png");
    function display_user_info(id) {
      $.ajax({
        url: `${api}/api/profile/${id}`,
        headers: {
          Authorization: "Bearer " + userToken
        },
        method: "GET",
        success: res => {
          const [...data] = res.data;
          const [user, profile] = data;
          const { firstname, lastname, username } = user;
          const { profile_img } = profile;
          self.profile_img(profile_img);
          self.fullname(`${firstname} ${lastname}`);
        }
      });
    }

    self.connected = function() {
      if (sessionStorage.getItem("user_token") == null) {
        router.go("login");
      }
      let user = sessionStorage.getItem("user");
      user = JSON.parse(user);

      function fetchIfProbated() {
        $.ajax({
          url: `${api}/api/probation/status/${user.id}`,
          headers: {
            Authorization: "Bearer " + userToken
          },
          method: "GET",
          success: ({ status, data }) => {
            if (status == "success") {
              if (data.probator !== undefined) {
                self.onProbation(data.status);
                self.probated_by(
                  data.probator.firstname + " " + data.probator.lastname
                );
                self.probation_reason(data.probation_reason);
                self.deadline(data.exit_on);
              } else {
                self.onProbation(false);
              }
            }
          }
        });
      }

      fetchIfProbated();
      fetchTrack(user.id);
      display_user_info(user.id);
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

      // Go back to dashboard

      self.dashboard = () => {
        self.isNotify(false);
      };

      self.toggleNotify = () => {
        self.isNotify(!self.isNotify());
      };

      // //notifications click
      // $("#notifi").on("click", function () {
      //   let attr = $(this).attr("for");
      //   $("#maincontent_intern_body > div").hide();
      //   $(`#maincontent_intern_body > div[id='${attr}']`).toggle();
      // });

      $("#sidebar li a").on("click", function() {
        let attr = $(this).attr("for");
        $("#maincontent_intern_body > div").hide();
        $(`#maincontent_intern_body > div[id='${attr}']`).show();
        oj.OffcanvasUtils.close(self.drawer);
        if (attr == "overview-intern") {
          display_user_info(user.id);
        }
      });
    };
  }
  return new UserDashboardViewModel();
});
