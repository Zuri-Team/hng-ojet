/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./api",
    "ojs/ojarraydataprovider",
    "ojs/ojlabel",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojdialog",
    "ojs/ojinputtext"
  ], function(oj, ko, $, api, ArrayDataProvider) {
    function TracksViewModel() {
      var self = this;
  
      self.trackDataProvider = ko.observable(); //gets data for Tracks list
      self.trackData = ko.observable(""); //holds data for the Track details
      self.newTrack = ko.observableArray([]); //newItem holds data for the create track dialog
  
      // Activity selection observables
      self.trackSelected = ko.observable(false);
      self.selectedTrack = ko.observable();
      self.firstSelectedTrack = ko.observable();
  
      //REST endpoint
      //var RESTurl = `${api}/api/categories`;
  
      //User Token
      var userToken = sessionStorage.getItem("user_token");
  
      self.showCreateDialog = function(event) {
        document.getElementById("createDialog").open();
      };
  
      self.showEditDialog = function(event) {
        document.getElementById("editDialog").open();
      };
  
      /**
       * Handle selection from Categories list
       */
      self.selectedTrackChanged = function(event) {
        // Check whether click is a category selection or deselection
        if (event.detail.value.length != 0) {
          // If selection, populate and display Category details
          // Populate items list observable using firstSelectedXxx API
          self.trackData(self.firstSelectedTrack().data);
  
          self.trackSelected(true);
        } else {
          // If deselection, hide list
          self.trackSelected(false);
        }
      };
  
      self.createTracks = function(event, data) {
        let track = self.newTrack.track_name;
        let track_description = self.newTrack.track_description;
        //let mentors = self.newTrack.track_mentors;
        //let projects = self.newTrack.track_projects;
        console.log(track, track_description);
        $.ajax({
          url: `https://api.start.ng/api/track/create`,
          headers: {
            Authorization: "Bearer " + userToken
          },
          method: "POST",
          data: { track, track_description },
          success: () => {
            self.fetchTracks();
          },
          error: err => console.log(err)
        });
        document.getElementById("createNewTrack").value = "";
        document.getElementById("createNewDesc").value = "";
        document.getElementById("createDialog").close();
  
      };
  
      self.fetchTracks = function() {
        $.ajax({
          url: `https://api.start.ng/api/users/track/1/list`,
          headers: {
            Authorization: "Bearer " + userToken
          },
          method: "GET",
          success: res => {
            let { data } = res;
            self.trackDataProvider(
              new ArrayDataProvider(data, {
                keys: data.map(function(value) {
                  return value.id;
                })
              })
            );
          }
        });
      };
  
      self.updateTrackSubmit = function(event) {
        //var trackId = self.firstSelectedTrack().data.id;
        let track = self.firstSelectedTrack().data.track_name;
        let track_description = self.firstSelectedTrack().data.track_desc;
        console.log(track, track_description);
        $.ajax({
          url: `https://api.start.ng/api/track/edit`,
          headers: {
            Authorization: "Bearer " + userToken
          },
          method: "PUT",
          data: { track, track_description },
          success: res => {
            console.log(res);
            // let { data } = res;
            // self.categoryDataProvider(
            //   new ArrayDataProvider(data, {
            //     keys: data.map(function(value) {
            //       return value.id;
            //     })
            //   })
            // );
          },
          error: err => console.log(err)
        });
  
        document.getElementById("editDialog").close();
      };
  
      self.deleteCategory = function(event, data) {
        var trackId = self.firstSelectedTrack().data.id;
        let trackName = self.firstSelectedTrack().data.track_name;
        var really = confirm(
          "Are you sure you want to delete " + trackName + "?"
        );
        if (really) {
          $.ajax({
            url: `https://api.start.ng/api/track/delete`,
            headers: {
              Authorization: "Bearer " + userToken
            },
            method: "DELETE",
            wait: true,
            success: res => {
              console.log(res, self.newTrack());
              self.fetchTracks();
              self.trackSelected(false);
            },
            error: err => console.log(err)
          });
        }
      };
  
      self.fetchTracks();
      self.connected = function() {
        // Implement if needed
        // console.log(sessionStorage.getItem("user_token"));
        if (sessionStorage.getItem("user_token") == null) {
          router.go("login");
        }
      };
  
      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
        //self.activitySelected(false);
        //self.itemSelected(false);
      };
  
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }
  
    return new TracksViewModel();
  });
  