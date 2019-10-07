define([
    'ojs/ojcore', 'knockout', 'jquery', 'ojs/ojbootstrap', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojknockout', 'ojs/ojoffcanvas', 'ojs/ojbutton', 'ojs/ojmodule', 'ojs/ojcomposite', 'ojs/ojavatar', 'ojs/ojlabel', 'views/task-card/loader', 'ojs/ojfilepicker', 'ojs/ojinputtext', 'ojs/ojformlayout', 'ojs/ojbutton'
],
function(oj, ko, $, Bootstrap, responsiveUtils, responsiveKnockoutUtils) {

    function AdminDashboardViewModel() {
        var self = this;
        var router = oj.Router.rootInstance;

        self.selectedItem = ko.observable("Dashboard");
    
    


        self.fullname = ko.observable('Admin');
        self.track = ko.observable('Design');
        self.slack = ko.observable('@xyluz');
        self.fileNames = ko.observableArray([]);
  
        self.selectListener = function(event) {
          var files = event.detail.files;
          for (var i = 0; i < files.length; i++) {
            self.fileNames.push(files[i].name);
          }
        }
        self.name = ko.observable('');
        self.email = ko.observable('');
        self.bio = ko.observable('');
        self.url = ko.observable('');
        self.location = ko.observable('');
        self.displayName = ko.observable('@');

        self.drawer = {
            "displayMode": "overlay",
            "selector": "#drawer",
            "content": "#main",
            "modality": "modal"
        };

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

        self.toggleDrawer = function() {
            return oj.OffcanvasUtils.toggle(self.drawer);
        };

        self.logout = function() {
            sessionStorage.clear();
            router.go("login")
        }

        // self.connected = function() {
        //     if (sessionStorage.getItem("user_token") == null) {
        //         router.go("login");
        //     }
        // }
    }
    // var advm = new AdminDashboardViewModel();
    // ko.applyBindings(advm, document.getElementById('navlistdemo'));

    return new AdminDashboardViewModel();
});