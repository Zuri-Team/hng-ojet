define(['ojs/ojcore',
        'knockout',
        'jquery',
        'ojs/ojbootstrap',
        'ojs/ojresponsiveutils',
        'ojs/ojresponsiveknockoututils',
        'ojs/ojknockout','ojs/ojavatar',  'ojs/ojfilepicker', 'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojformlayout', 'ojs/ojbutton'],
 function(oj, ko, $, Bootstrap, responsiveUtils, responsiveKnockoutUtils) {

    function ProfileViewModel() {
      var self = this;


        self.fileNames = ko.observableArray([]);
  
        self.selectListener = function(event) {
          var files = event.detail.files;
          for (var i = 0; i < files.length; i++) {
            self.fileNames.push(files[i].name);
          }
        }
      
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.
      self.isSmall =responsiveKnockoutUtils.createMediaQueryObservable(
                    responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));

      // For small screens: labels on top
      // For medium or bigger: labels inline
      self.labelEdge = ko.computed(function() {
                                    return self.isSmall() ? "top" : "start";
                                  }, self);
      self.clickedButton = ko.observable("(None clicked yet)");
      self.buttonClick = function(event){
                            self.clickedButton(event.currentTarget.id);
                            return true;
                          }.bind(self);
      self.value = ko.observable("What");
      
      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new ProfileViewModel();
  }
  
);
