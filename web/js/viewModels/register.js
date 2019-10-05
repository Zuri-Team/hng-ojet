<<<<<<< HEAD
define([
  "knockout",
  "./api",
  "jquery",
  "ojs/ojcore",
  "ojs/ojrouter",
  "ojs/ojformlayout",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function (ko, api, $) {
  function RegisterViewModel() {
    var self = this;
    var router = oj.Router.rootInstance;

    self.firstname = ko.observable();
    self.lastname = ko.observable();
    self.stack = ko.observable();
    self.location = ko.observable();

    //account info
    self.username = ko.observable();
    self.email = ko.observable();
    self.pass = ko.observable();
    self.rpass = ko.observable();

    self.login = function () {
      router.go("login");
    };

    self.connected = function () {
      // Implement if needed
      function validate() {
        var sect = $("#fbk");
        var feedback = function (text, color = "danger") {
          return `<div class=" mt-3 alert alert-${color} h5 show fb_alert" role="alert">
            <small>${text}</small>
          </div>`;
        };

        var progressbar = function () {
          return `<div class="progress position-relative mt-3">
          <div class="position-absolute h-100 w-100 progress-bar progress-bar-striped progress-bar-animated bg-info"
            role="progressbar">
            <span class="oj-text-sm font-weight-bold">Processing registration</span>
          </div>
        </div>`;
        };

        let firstname = self.firstname();
        let email = self.email();
        let lastname = self.lastname();
        let username = self.username();
        let password = self.pass();
        let confirm_password = self.rpass();
        let stack = self.stack();
        let location = self.location();

        if (
          (firstname &&
            lastname &&
            email &&
            username &&
            stack &&
            location &&
            password &&
            confirm_password) !== undefined
        ) {
          validated = true;
          if (!(email.match(/([@])/) && email.match(/([.])/))) {
            validated = false;
            sect.html(feedback("Please enter a valid email"));
          }
          if (password.length < 4 || confirm_password.length < 4) {
            validated = false;
            sect.html(feedback("Password should be minimum 4 characters"));
          } else {
            if (password !== confirm_password) {
              sect.html(feedback("Passwords does not match"));
              validated = false;
            }
          }
          if (validated == true) {
            sect.html(progressbar());
            $.post(`${api}/api/register`, {
              firstname,
              lastname,
              email,
              username,
              password,
              confirm_password,
              stack,
              location
            })
              .done(resp => {
                if (resp.status == true) {
                  sect.html(
                    feedback(
                      "Account created, redirecting to login page...",
                      "success"
                    )
                  );
                  setTimeout(function () {
                    router.go("login");
                  }, 2000);
                }
              })
              .fail(() => {
                sect.html(
                  feedback(
                    "Sorry, your registration could not be completed. Your username or email is already registered to an account"
                  )
                );
              });
          }
        } else {
          console.log("wrong");
          sect.html(feedback("All fields are required"));
        }
      }

      $("#next").click(function () {
        $("#profileinfo").hide();
        $("#accinfo").show();
      });
      $("#prev").click(function () {
        $("#profileinfo").show();
        $("#accinfo").hide();
      });

      self.signup = function () {
        validate();
      };
    };

    self.disconnected = function () {
      // Implement if needed
    };

    self.transitionCompleted = function () {
      // Implement if needed
    };
  }

  return new RegisterViewModel();
});
=======
define(["knockout","./api","jquery","ojs/ojcore","ojs/ojrouter","ojs/ojformlayout","ojs/ojinputtext","ojs/ojselectcombobox"],function(e,o,a){return new function(){var s=this,t=oj.Router.rootInstance;s.firstname=e.observable(),s.lastname=e.observable(),s.stack=e.observable(),s.location=e.observable(),s.username=e.observable(),s.email=e.observable(),s.pass=e.observable(),s.rpass=e.observable(),s.login=function(){t.go("login")},s.connected=function(){a("#next").click(function(){a("#profileinfo").hide(),a("#accinfo").show()}),a("#prev").click(function(){a("#profileinfo").show(),a("#accinfo").hide()}),s.signup=function(){!function(){var e=a("#fbk"),n=function(e,o="danger"){return`<div class=" mt-3 alert alert-${o} h5 show fb_alert" role="alert">\n            <small>${e}</small>\n          </div>`};let r=s.firstname(),i=s.email(),l=s.lastname(),c=s.username(),d=s.pass(),m=s.rpass(),u=s.stack(),f=s.location();void 0!==(r&&l&&i&&c&&u&&f&&d&&m)?(validated=!0,i.match(/([@])/)&&i.match(/([.])/)||(validated=!1,e.html(n("Please enter a valid email"))),d.length<4||m.length<4?(validated=!1,e.html(n("Password should be minimum 4 characters"))):d!==m&&(e.html(n("Passwords does not match")),validated=!1),1==validated&&(e.html('<div class="progress position-relative mt-3">\n          <div class="position-absolute h-100 w-100 progress-bar progress-bar-striped progress-bar-animated bg-info"\n            role="progressbar">\n            <span class="oj-text-sm font-weight-bold">Processing registration</span>\n          </div>\n        </div>'),a.post(`${o}/api/register`,{firstname:r,lastname:l,email:i,username:c,password:d,confirm_password:m,stack:u,location:f}).done(o=>{1==o.status&&(e.html(n("Account created, redirecting to login page...","success")),setTimeout(function(){t.go("login")},2e3))}).fail(()=>{e.html(n("Sorry, your registration could not be completed. Your username or email is already registered to an account"))}))):(console.log("wrong"),e.html(n("All fields are required")))}()}},s.disconnected=function(){},s.transitionCompleted=function(){}}});
>>>>>>> 47c204b670044215f192ee69f48a3830b599a9a9
