define(["knockout", "jquery", "../ckeditor"], function(ko, $, ClassicEditor) {
  function viewPost(params) {
    let { data } = params.postSelected._latestValue;
    let self = this;
    self.category = ko.observable(data.category.title);
    self.title = ko.observable(data.post_title);
    self.post = ko.observable(data.post_body);
    self.time = ko.observable(data.created_at);
    self.author = ko.observable(`${data.user.firstname} ${data.user.lastname}`);
    self.close = () => {
      params.fullpost(false);
      params.postpg("d-block");
    };
    self.toggle_comment_box = () => {
      $("#commentBox").slideToggle();
    };
    self.handleAttached = () => {
      $("#fp").html(self.post());
      ClassicEditor.create(document.querySelector("#replypost"), {
        toolbar: ["bold", "link", "underline"]
      });
    };
  }
  return viewPost;
});
