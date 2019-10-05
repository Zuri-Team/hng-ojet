<<<<<<< HEAD
define([
        'ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojoffcanvas', 'ojs/ojbutton', 'ojs/ojmodule', 'ojs/ojcomposite', 'ojs/ojavatar', 'ojs/ojlabel', 'ojs/ojprogress', 'views/task-card/loader'
    ],
    function(oj, ko) {

        function DashboardViewModel() {
            var self = this;
            var router = oj.Router.rootInstance;
            self.fullname = ko.observable('Seye Oyeniran');
            self.stage = ko.observable(3);
            self.track = ko.observable('Design');
            self.currentweek = ko.observable(2);
            self.totalweeks = ko.observable(10);
            self.progress = ko.observable(30);
            self.slack = ko.observable('@shazomii');
            self.tasks = [{
                    taskTitle: "Create a Chatbot App",
                    details: "Here are details for the Chatbot App"
                },
                {
                    taskTitle: "Deploy a Serverless App",
                    details: "Here are the details for the Serverless App"
                }
            ];

            self.drawer = {
                "displayMode": "overlay",
                "selector": "#drawer",
                "content": "#main",
                "modality": "modal"
            };

            self.toggleDrawer = function() {
                return oj.OffcanvasUtils.toggle(self.drawer);
            };

            self.logout = function() {
                sessionStorage.clear();
                router.go("login")
            }

            self.connected = function() {
                if (sessionStorage.getItem("user_token") == null) {
                    router.go("login");
                }
            }
        }


        /*
         * Returns a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.  Return an instance of the ViewModel if
         * only one instance of the ViewModel is needed.
         */
        return new DashboardViewModel();
    });
=======
define(["ojs/ojcore","knockout","jquery","ojs/ojknockout","ojs/ojoffcanvas","ojs/ojbutton","ojs/ojmodule","ojs/ojcomposite","ojs/ojavatar","ojs/ojlabel","ojs/ojprogress","views/task-card/loader"],function(e,o){return new function(){var s=this,t=e.Router.rootInstance;s.fullname=o.observable("Seye Oyeniran"),s.stage=o.observable(3),s.track=o.observable("Design"),s.currentweek=o.observable(2),s.totalweeks=o.observable(10),s.progress=o.observable(30),s.slack=o.observable("@shazomii"),s.tasks=[{taskTitle:"Create a Chatbot App",details:"Here are details for the Chatbot App"},{taskTitle:"Deploy a Serverless App",details:"Here are the details for the Serverless App"}],s.drawer={displayMode:"overlay",selector:"#drawer",content:"#main",modality:"modal"},s.toggleDrawer=function(){return e.OffcanvasUtils.toggle(s.drawer)},s.logout=function(){sessionStorage.clear(),t.go("login")},s.connected=function(){null==sessionStorage.getItem("user_token")&&t.go("login")}}});
>>>>>>> 47c204b670044215f192ee69f48a3830b599a9a9
