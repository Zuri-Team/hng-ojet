define([
    'ojs/ojcore', 
    'knockout', 
    'jquery', 
    'ojs/ojbootstrap', 
    'ojs/ojresponsiveutils', 
    'ojs/ojresponsiveknockoututils',
    "ojs/ojinputtext", 
    'ojs/ojknockout', 
    'ojs/ojselectcombobox', 
    'ojs/ojoffcanvas', 
    'ojs/ojbutton', 
    'ojs/ojmodule', 
    'ojs/ojcomposite', 
    'ojs/ojavatar', 
    'ojs/ojlabel', 
    'views/task-card/loader', 
    'ojs/ojfilepicker', 
    'ojs/ojformlayout', 
    'ojs/ojbutton'
],
function(oj, ko, $, Bootstrap, responsiveUtils, responsiveKnockoutUtils) {

    
    function UserDashboardViewModel() {
        var self = this;
        var router = oj.Router.rootInstance;

        self.selectedItem = ko.observable("Dashboard");

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

        self.submitTask = () => {
            router.go('submission');
        }

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
            $("#usercontent, #side-nav").toggleClass("smactive");
        };

        self.sb_sm = ko.observable(false);
            self.searchbar_sm = function() {
            self.sb_sm(!self.sb_sm());
        };

        self.logout = function() {
            sessionStorage.clear();
            router.go("login")
        }

        self.connected = function() {
            let user = sessionStorage.getItem("user");
            user = JSON.parse(user);
            if (sessionStorage.getItem("user_token") == null) {
              router.go("login");
            }
            self.fullname(`${user.firstname} ${user.lastname}`);
      
            $("#navlistcontainer li a").on("click", function() {
              let attr = $(this).attr("for");
              $("#usercontent_body > div").hide();
              $(`#usercontent_body > div[id='${attr}']`).show();
            });
          };
    }
    // var advm = new UserDashboardViewModel();
    // ko.applyBindings(advm, document.getElementById('navlist'));

    return new UserDashboardViewModel();
});