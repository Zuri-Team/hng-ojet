define(['ojs/ojcore',
'knockout',
'jquery',
'./api',
'ojs/ojarraydataprovider',
'ojs/ojavatar',
'ojs/ojbutton', 'ojs/ojmenu', 'ojs/ojoption'
],
function (oj, ko, $, api) {
function UserProfileModel(params) {
    var self = this;
    self.hideProfile = ko.observable();
    self.activate = ko.observable(false)
    self.isUser = ko.observable(true)
    self.selectedMenuItem = ko.observable("");


    // User Profile Observables
    self.fullName = ko.observable("");
    self.team = ko.observable("");
    self.stage = ko.observable("");


    // extract the user ID we have to work with
    const user_id = params.userModel().data.id;


    // Get auth token from session storage 
    var userToken = sessionStorage.getItem("user_token");
  

    // base URL
    const userProfileURL = `${api}/api/user-profile`



    self.menuItemAction = function( event ) {
        self.selectedMenuItem(event.target.value);
    }
    console.log(self.selectedMenuItem())



    self.fetchUserProfile = async() => {

        try {
            const response = await fetch(`${userProfileURL}/${user_id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            const { data } = await response.json();
            self.fullName(`${data.firstname} ${data.lastname}`)
            self.team(`${data.teams[0]['team_name']}`)
            self.stage(`${data.stage}`)
            console.log(data);
        } catch (err) {
            console.log(err);
        }

    }
    self.fetchUserProfile();



    self.Home = () => {
        self.hideProfile(params.hideProfile(false))
    }
console.log(params.userModel().key, params.hideProfile())
}
return UserProfileModel;
});



   //     /* Variables */
    // self.ticketId = ko.observable();
    // self.title = ko.observable();
    // self.author = ko.observable();
    // self.dateCreated = ko.observable();
    // self.showDateDifference = ko.observable();
    // self.message = ko.observable();
    // self.status = ko.observable()
    // self.attachment = ko.observable();

    // self.userModel = ko.computed(function () {

    //     self.ticketId(params.ticketModel().get('id'))
    //     self.title(params.ticketModel().get('title'))
    //     self.author(params.ticketModel().get('author'))
    //     self.dateCreated(params.ticketModel().get('dateCreated'))
    //     self.message(params.ticketModel().get('message'))
    //     self.status(params.ticketModel().get('status'))
    //     self.attachment(params.ticketModel().get('attachment'))
    //     return params.ticketModel();
        
    //     });