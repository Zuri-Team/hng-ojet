define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./api",
    "ojs/ojarraydataprovider",
    "ojs/ojpagingdataproviderview",
    'ojs/ojknockout',
    "ojs/ojmodel",
    "ojs/ojlistview",
    "ojs/ojdialog",
    "ojs/ojvalidation-datetime",
    "ojs/ojtimezonedata",
    "ojs/ojmessages",
    "ojs/ojpagingcontrol"
], function(oj, ko, $, api, ArrayDataProvider, Paging) {
    function postViewModel() {
        var self = this;
        var RESTurl = `${api}/api/posts`;
        var userToken = sessionStorage.getItem("user_token");

        // form-data for new post
        self.category_id = ko.observable();
        self.newpost = ko.observable({});
        self.postSelected = ko.observable({});
        self.dataProvider = ko.observable();

        self.viewPost = ko.observable(false);

        self.post_btn_toggler = ko.observable(false);
        self.post_view_title = ko.observable("New Post");
        self.categories = ko.observableArray([]);
        // notification messages observable
        self.applicationMessages = ko.observableArray();

        self.post_view_toggle = () => {
            self.post_btn_toggler(!self.post_btn_toggler());
            self.post_view_title() == "New Post" ?
                self.post_view_title("Back") :
                self.post_view_title("New Post");
        };

        self.postSelectedChanged = function(event) {
            if (event.detail.value.length != 0) {
                let { data } = self.postSelected();
                if (data == null) {
                    return;
                } else {
                    self.viewPost(true);
                }

            }
        };

        self.refreshList = () => {
            self.fetchPost();
        };

        function fetchCategories() {
            self.categories([]);
            $.ajax({
                url: `${api}/api/categories`,
                headers: {
                    Authorization: "Bearer " + " " + userToken
                },
                method: "GET",
                success: res => {
                    self.categories(res.data.map(cats => cats));
                }
            });
        }
        
        // datetime converter
        self.formatDateTime = date => {
            var formatDateTime = oj.Validation.converterFactory(
                oj.ConverterFactory.CONVERTER_TYPE_DATETIME
            ).createConverter({
                formatType: "datetime",
                dateFormat: "medium",
                timeFormat: "short",
                timeZone: "Africa/Lagos"
            });

            return formatDateTime.format(new Date(date).toISOString());
        };

        self.createPost = () => {
            let category_id = self.category_id;
            let post_title = self.newpost().title;
            let post_body = self.newpost().body;
            $.ajax({
                url: `${RESTurl}`,
                headers: {
                    Authorization: "Bearer " + userToken
                },
                method: "POST",
                data: { category_id, post_title, post_body },
                success: res => {
                    if (res.status == true) {
                        self.newpost({});
                        self.fetchPost();
                        self.post_btn_toggler(false);
                        self.applicationMessages.push({
                            severity: "confirmation",
                            summary: "Post created successfully",
                            autoTimeout: parseInt("0")
                        });
                    }
                },
                error: err => {
                    console.log(err);
                    self.applicationMessages.push({
                        severity: "error",
                        summary: "An error was encountered, unable to create post",
                        autoTimeout: parseInt("0")
                    });
                }
            });
        };


        self.fetchPost = () => {
            $.ajax({
                url: `${RESTurl}`,
                headers: {
                    Authorization: "Bearer " + userToken
                },
                method: "GET",
                success: res => {
                    if (res.status == true) {
                        let { data } = res.data;
                        self.dataProvider(
                            new Paging(
                                new ArrayDataProvider(data, {
                                    keys: data.map(function(value) {
                                        value.created_at = self.formatDateTime(value.created_at);
                                        return value.post_title;
                                    })
                                })
                            )
                        );
                    }
                }
            });
        };


        fetchCategories();
        self.fetchPost();
        // listen for changes
        let pm = ko.dataFor(document.querySelector("#admin"));
        pm.selectedItem.subscribe(function() {
            if (pm.selectedItem() == "Posts") {
                fetchCategories();
                self.fetchPost();
            }
        });
    }

    return new postViewModel();
});