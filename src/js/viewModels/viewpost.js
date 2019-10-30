define(["ojs/ojcore", "knockout", "jquery"], function(oj, ko, $) {
  function viewPost(params) {
    let { data } = params.postSelected._latestValue;
    let self = this;
    self.category = ko.observable(data.category.title);
    self.title = ko.observable(data.post_title);
    self.post = ko.observable(data.post_body);
    self.time = ko.observable(data.created_at);
    self.author = ko.observable(`${data.user.firstname} ${data.user.lastname}`);
    self.fullpost = ko.observable(true);
    self.close = () => {
      self.fullpost(params.fullpost(false));
    };
    self.toggle_comment_box = () => {
      $("#commentBox").slideToggle();
    };
  }
  return viewPost;
});
