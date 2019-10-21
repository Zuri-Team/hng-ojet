define(['ojs/ojcore',
'knockout',
'jquery',
'ojs/ojarraydataprovider'
],
function (oj, ko, $) {
function UserProfileModel(params) {
    var self = this;
    self.hideProfile = ko.observable();

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

    self.Home = () => {
        self.hideProfile(params.hideProfile(false))
    }
console.log(params.userModel(), params.hideProfile())
}
return UserProfileModel;
});