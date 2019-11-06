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
    $(document).on("click","#emoji-picker",function(e){
      e.stopPropagation();
       $('.intercom-composer-emoji-popover').toggleClass("active");
   });
   
   $(document).click(function (e) {
       if ($(e.target).attr('class') != '.intercom-composer-emoji-popover' && $(e.target).parents(".intercom-composer-emoji-popover").length == 0) {
           $(".intercom-composer-emoji-popover").removeClass("active");
       }
   });
   
   $(document).on("click",".intercom-emoji-picker-emoji",function(e){
       $(".test-emoji").append($(this).html());
   });
   
   $('.intercom-composer-popover-input').on('input', function() {
       var query = this.value;
       if(query != ""){
         $(".intercom-emoji-picker-emoji:not([title*='"+query+"'])").hide();
       }
       else{
         $(".intercom-emoji-picker-emoji").show();
       }
   });
  }
  return viewPost;
});
