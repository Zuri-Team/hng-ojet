define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojarraydataprovider",
  "./api",
  "ojs/ojknockout-keyset",
  "ojs/ojpagingdataproviderview",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojswitch",
  "ojs/ojdialog",
  "ojs/ojinputtext",
  "ojs/ojmessages",
  "ojs/ojvalidation-datetime",
  "ojs/ojpagingcontrol",
  "jquery",
], function (oj, ko, ArrayDataProvider, api, keySet, PagingDataProviderView) {
  function coursesViewModel() {
    var self = this;

    var courseURL = `${api}/api/course`;

    var userToken = localStorage.getItem("user_token");

    // var date = "2019-10-09 00:22:40";
    // date = date.toISOString();
    // datetime converter
    // datetime converter
    self.formatDateTime = (date) => {
      var formatDateTime = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: "datetime",
        dateFormat: "medium",
        timeFormat: "short",
        timeZone: "Africa/Lagos",
      });

      var values = date.split(/[^0-9]/);
      var year = parseInt(values[0], 10);
      var month = parseInt(values[1], 10) - 1; // Month is zero based, so subtract 1
      var day = parseInt(values[2], 10);
      var hours = parseInt(values[3], 10);
      var minutes = parseInt(values[4], 10);
      var seconds = parseInt(values[5], 10);

      return formatDateTime.format(
        new Date(year, month, day, hours, minutes, seconds).toISOString()
      );
      // return formatDateTime.format(new Date(date).toISOString());
    };

    self.courseData = ko.observable(""); // holds data for the course details
    self.newCourse = ko.observableArray([]); // newItem holds data for the create course dialog
    self.selectedItems = new keySet.ObservableKeySet(); // observable bound to selection option to monitor current selections
    self.selectedSelectionRequired = ko.observable(false);
    self.firstSelectedItem = ko.observable();
    self.showCourseRequests = ko.observable(false);

    // notification messages observable
    self.applicationMessages = ko.observableArray([]);

    // Relevant observables
    self.selectedIds = ko.observableArray([]);
    self.currentItemId = ko.observable();
    self.dataProvider = ko.observable();

    self.courseRequestsShown = () => {
      self.showCourseRequests(true);
    };

    self.courseRequestsHidden = () => {
      self.showCourseRequests(false);
      self.fetchPendingCourseRequests();
    };

    self.handleSelectionChanged = function (event) {
      self.selectedIds(event.detail.value); // show selected list item elements' ids

      if (event.detail.value.length != 0) {
        // Populate tracks list observable using firstSelectedXxx API
        const { data } = self.firstSelectedItem();
        self.courseData(data);
      }
    };

    self.handleCurrentItemChanged = function (event) {
      var itemId = event.detail.value;
      // Access current item via ui.item
      self.currentItemId(itemId);
    };

    // Show dialogs
    self.showCreateCourse = function (event) {
      document.getElementById("createCourse").open();
    };

    self.showEditCourse = function (event) {
      document.getElementById("editCourse").open();
    };
    self.showDeleteCourse = function (event) {
      document.getElementById("deleteCourse").open();
    };

    //  Fetch all tracks
    self.fetchCourses = async () => {
      try {
        const response = await fetch(`http://test.hng.tech/api/course/all`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const { data } = await response.json();

        self.dataProvider(
          new PagingDataProviderView(
            new ArrayDataProvider(data, { keyAttributes: "id" })
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchCourses();

    // Create tracks
    self.createCourse = async () => {
      const course_name = self.newCourse.course_name;
      const course_description = self.newCourse.course_description;

      try {
        const response = await fetch(`${courseURL}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            course_name,
            course_description,
          }),
        });

        // send a success message notification to the tracks view
        self.applicationMessages.push({
          severity: "confirmation",
          summary: "New Course created",
          detail: "The new course " + course_name + " has been created",
          autoTimeout: parseInt("0"),
        });

        document.getElementById("createNewTitle").value = "";
        document.getElementById("createNewDesc").value = "";
        document.getElementById("createCourse").close();
        self.fetchCourses();
      } catch (err) {
        console.log(err);

        // send an error message notification to the tracks view
        self.applicationMessages.push({
          severity: "error",
          summary: "Error creating course",
          detail: "Error trying to create new course",
          autoTimeout: parseInt("0"),
        });
      }
    };

    // edit tracks
    self.editCourse = async () => {
      // This is plain es6 object destructuring. Sorry it is so nested.
      const {
        data: { id, course_description, course_name },
      } = self.firstSelectedItem();

      const course_id = id; // Form data needs id as track_id

      try {
        const response = await fetch(`${courseURL}/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            course_id,
            course_name,
            course_description,
          }),
        });

        // send a success message notification to the tracks view
        self.applicationMessages.push({
          severity: "confirmation",
          summary: course_name + " updated",
          detail: "Course " + course_name + " has been updated",
          autoTimeout: parseInt("0"),
        });
        document.getElementById("editCourse").close();
        self.fetchCourses();
      } catch (err) {
        console.log(err);

        // send an error message notification to the tracks view
        self.applicationMessages.push({
          severity: "error",
          summary: "Error updating course",
          detail: "Error trying to update course " + course_name,
          autoTimeout: parseInt("0"),
        });
      }
    };

    self.deleteCourse = async () => {
      // Get the id of the selected element
      const course_id = self.currentItemId();

      const {
        data: { course_name },
      } = self.firstSelectedItem();

      try {
        const response = await fetch(`${courseURL}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            course_id,
          }),
        });

        // send a success message notification to the tracks view
        self.applicationMessages.push({
          severity: "confirmation",
          summary: course_name + " deleted",
          detail: "Course " + course_name + " has been deleted",
          autoTimeout: parseInt("0"),
        });

        document.getElementById("deleteCourse").close();
        self.fetchCourses();
      } catch (err) {
        console.log(err);

        // send an error message notification to the tracks view
        self.applicationMessages.push({
          severity: "error",
          summary: "Error deleting course",
          detail: "Error trying to delete course " + course_name,
          autoTimeout: parseInt("0"),
        });
      }
    };

    self.requestCount = ko.observable("");
    self.fetchPendingCourseRequests = async () => {
      try {
        const response = await fetch(
          `${api}/api/course-requests/request-count`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const {
          data: { requests_count },
        } = await response.json();
        self.requestCount(requests_count);
      } catch (err) {
        console.log(err);
      }
    };
    self.fetchPendingCourseRequests();

    // listen for changes
    const pm = ko.dataFor(document.querySelector("#admin"));
    pm.selectedItem.subscribe(function () {
      if (pm.selectedItem() == "Courses") {
        self.fetchPendingCoursekRequests();
        self.fetchCourses();
      }
    });
  }
  return new coursesViewModel();
});
