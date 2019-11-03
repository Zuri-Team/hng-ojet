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

        $(function () {
            $('#emoji').emoji({
                button:'&#x1F642;',
                emojis: ['&#x1F642;','&#x1F641;','&#x1f600;','&#x1f601;','&#x1f602;','&#x1f603;','&#x1f604;','&#x1f605;','&#x1f606;','&#x1f607;','&#x1f608;','&#x1f609;','&#x1f60a;','&#x1f60b;','&#x1f60c;','&#x1f60d;','&#x1f60e;','&#x1f60f;','&#x1f610;','&#x1f611;','&#x1f612;','&#x1f613;','&#x1f614;','&#x1f615;','&#x1f616;','&#x1f617;','&#x1f618;','&#x1f619;','&#x1f61a;','&#x1f61b;','&#x1f61c;','&#x1f61d;','&#x1f61e;','&#x1f61f;','&#x1f620;','&#x1f621;','&#x1f622;','&#x1f623;','&#x1f624;','&#x1f625;','&#x1f626;','&#x1f627;','&#x1f628;','&#x1f629;','&#x1f62a;','&#x1f62b;','&#x1f62c;','&#x1f62d;','&#x1f62e;','&#x1f62f;','&#x1f630;','&#x1f631;','&#x1f632;','&#x1f633;','&#x1f634;','&#x1f635;','&#x1f636;','&#x1f637;','&#x1f638;','&#x1f639;','&#x1f63a;','&#x1f63b;','&#x1f63c;','&#x1f63d;','&#x1f63e;','&#x1f63f;','&#x1f640;','&#x1f643;','&#x1f4a9;','&#x1f644;','&#x2620;','&#x1F44C;','&#x1F44D;','&#x1F44E;','&#x1F648;','&#x1F649;','&#x1F64A;'],
                listCSS: {
                    position: 'absolute', 
                    border: '1px solid gray', 
                    backgroundColor: '#fff', 
                    display: 'none',
                    fontSize:'20px'

                  }
            });
          })


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