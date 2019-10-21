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
    self.role = ko.observable("")
    self.firstStage = ko.observable(false)
    self.lastStage = ko.observable(false)

    // extract the user ID we have to work with
    const user_id = params.userModel().data.id;


    // Get auth token from session storage 
    var userToken = sessionStorage.getItem("user_token");
  

    // base URL
    const userProfileURL = `${api}/api/user-profile`



    // utility functions 

    self.promote = async() => {

        try {
            const response = await fetch(`${userProfileURL}/promote/${user_id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            const { data, message } = await response.json();
            console.log(data, message);
            self.fetchUserProfile();
        } catch (err) {
            console.log(err);
        }

    }

    self.demote = async() => {

        try {
            const response = await fetch(`${userProfileURL}/demote/${user_id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            const { data, message } = await response.json();
            console.log(data, message);
            self.fetchUserProfile();
        } catch (err) {
            console.log(err);
        }

    }


    self.menuItemAction = function( event ) {
        self.selectedMenuItem(event.target.value);

    switch(event.target.value) {
            case ("Make Admin"): {
                (async() => {

                    try {
                        const response = await fetch(`${userProfileURL}/make-admin/${user_id}`, {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${userToken}`
                            }
                        });
                        const { data, message } = await response.json();
                        console.log(data, message);
                        self.isUser(false);
                        self.fetchUserProfile();
                    } catch (err) {
                        console.log(err);
                    }
            
                })()
                break;
        }
            case ("Make User"): {
                (async() => {

                    try {
                        const response = await fetch(`${userProfileURL}/remove-admin/${user_id}`, {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${userToken}`
                            }
                        });
                        const { data, message } = await response.json();
                        console.log(data, message);
                        self.isUser(true);
                        self.fetchUserProfile();
                    } catch (err) {
                        console.log(err);
                    }
            
                })()
                break;
        }
            case ("Activate"): {
                (async() => {

                    try {
                        const response = await fetch(`${userProfileURL}/activate/${user_id}`, {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${userToken}`
                            }
                        });
                        const { data, message } = await response.json();
                        console.log(data, message);
                        self.activate(false);
                        self.fetchUserProfile();
                    } catch (err) {
                        console.log(err);
                    }
            
                })()
                break;
        }
            case ("Deactivate"): {
                (async() => {

                    try {
                        const response = await fetch(`${userProfileURL}/deactivate/${user_id}`, {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${userToken}`
                            }
                        });
                        const { data, message } = await response.json();
                        console.log(data, message);
                        self.activate(true);
                        self.fetchUserProfile();
                    } catch (err) {
                        console.log(err);
                    }
            
                })()
                break;
        }
            case ("Delete"): {
                (async() => {

                    try {
                        const response = await fetch(`${userProfileURL}/delete/${user_id}`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${userToken}`
                            }
                        });
                        const { data, message } = await response.json();
                        console.log(data, message);
                        self.fetchUserProfile();
                    } catch (err) {
                        console.log(err);
                    }
            
                })()
                break;
        }
    }
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
            // self.team(`${data.teams[0]['team_name']}`)
            self.stage(`${data.stage}`)
            self.role(`${data.role}`)

                console.log(data, data.role, data.active)
            if(data.role == "admin" || data.role == "superadmin"){
                self.isUser(false)
            } else {
                self.isUser(true)
            }
        
            if(data.active == 1){
                self.activate(false)
            } else {
                self.activate(true)
            }

            if(data.stage === 10) {
                self.lastStage(true)
            } else if (data.stage === 1) {
                self.firstStage(true)
            } else {
                rself.lastStage(false)
                rself.firstStage(false)
            }
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