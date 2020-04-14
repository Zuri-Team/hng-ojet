define([
  'knockout',
  'jquery',
  '../ckeditor',
  './api',
  'ojs/ojarraydataprovider',
  'ojs/ojpagingdataproviderview',
  'ojs/ojhtmlutils',
  'ojs/ojbinddom',
  'ojs/ojlistview',
  'ojs/ojdialog',
  'ojs/ojvalidation-datetime',
  'ojs/ojtimezonedata',
  'ojs/ojmessages',
  'ojs/ojpagingcontrol',
  'ojs/ojmodel'
], function (ko, $, ClassicEditor, api, ArrayDataProvider, Paging, HtmlUtils) {
  function viewPost (params) {
    const self = this

    self.category = ko.observable('')
    self.title = ko.observable('')
    const data = params.post()
    self.category(data.category.title)
    self.title(data.post_title)

    self.post_body = ko.observable({
      view: HtmlUtils.stringToNodeArray(data.post_body)
    })
    self.time = ko.observable(data.created_at)
    self.author = ko.observable(`${data.user.firstname} ${data.user.lastname}`)

    self.editor = ko.observable()
    const RESTurl = `${api}/api/post-comment`
    const userToken = localStorage.getItem('user_token')
    let user = localStorage.getItem('user')
    user = JSON.parse(user)

    self.commentsProvider = ko.observable()
    self.comment = ko.observable({})
    self.commentSelected = ko.observable()
    self.commentChanged = () => {
      const { data } = self.commentSelected()
      if (data != null) {
        self.comment(data)
      }
    }

    // datetime converter
    self.formatDateTime = date => {
      var formatDateTime = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: 'datetime',
        dateFormat: 'medium',
        timeFormat: 'short',
        timeZone: 'Africa/Lagos'
      })

      var values = date.split(/[^0-9]/)
      var year = parseInt(values[0], 10)
      var month = parseInt(values[1], 10) - 1 // Month is zero based, so subtract 1
      var day = parseInt(values[2], 10)
      var hours = parseInt(values[3], 10)
      var minutes = parseInt(values[4], 10)
      var seconds = parseInt(values[5], 10)

      return formatDateTime.format(new Date(year, month, day, hours, minutes, seconds).toISOString())
      // return formatDateTime.format(new Date(date).toISOString());
    }

    self.close = () => {
      params.fullpost(false)
      params.postpg('d-block')
    }
    self.toggle_comments = () => {
      $('#comments').slideToggle()
    }
    self.toggle_comment_box = () => {
      $('#commentBox').slideToggle()
    }
    self.no_of_comments = ko.observable('')
    self.fetch_comments = () => {
      const id = data.id
      $.ajax({
        url: `${RESTurl}/${id}/comments`,
        headers: {
          Authorization: 'Bearer ' + userToken
        },
        method: 'GET',
        success: ({ status, data }) => {
          if (status == true) {
            self.no_of_comments(data.length)
            self.commentsProvider(
              new Paging(
                new ArrayDataProvider(data, {
                  keys: data.map(function (value) {
                    value.created_at = self.formatDateTime(value.created_at)
                    value.comment = {
                      view: HtmlUtils.stringToNodeArray(value.comment)
                    }
                    return value.id
                  })
                })
              )
            )
          }
        },
        error: err => console.log(err)
      })
    }

    self.post_comment = () => {
      const id = data.id
      const comment = self.editor().getData()
      $.ajax({
        url: `${RESTurl}/${id}/comment`,
        headers: {
          Authorization: 'Bearer ' + userToken
        },
        method: 'POST',
        data: { comment },
        success: ({ status, data }) => {
          if (status == true) {
            self.toggle_comment_box()
            self.editor().setData('')
            self.fetch_comments()
          }
        },
        error: err => console.log(err)
      })
    }

    self.edit_comment = () => {
      const id = self.comment().id
      $.ajax({
        url: `${RESTurl}/comment/${id}`,
        headers: {
          Authorization: 'Bearer ' + userToken
        },
        method: 'PUT',
        data: { comment },
        success: ({ status, data }) => {
          if (status == true) {

          }
        },
        error: err => console.log(err)
      })
    }
    self.delete_comment = () => {
      setTimeout(() => {
        const id = self.comment().id
        $.ajax({
          url: `${RESTurl}/comment/${id}`,
          headers: {
            Authorization: 'Bearer ' + userToken
          },
          method: 'DELETE',
          success: ({ status }) => {
            if (status == true) {
              self.fetch_comments()
            }
          },
          error: err => console.log(err)
        })
      }, 0)
    }
    self.isAdmin = ko.observable()
    self.handleAttached = () => {
      params.post()
      self.fetch_comments()
      user.role == 'intern' ? self.isAdmin(false) : self.isAdmin(true)
      ClassicEditor.create(document.querySelector('#replypost'), {
        toolbar: ['bold', 'link', 'underline']
      }).then(editor => self.editor(editor))
    }

    // Emoji controllers
    $(document).on('click', '#emoji-button', function (e) {
      e.stopPropagation()
      $('.intercom-composer-emoji-popover').toggleClass('active')
    })

    $(document).click(function (e) {
      if (
        $(e.target).attr('class') != '.intercom-composer-emoji-popover' &&
        $(e.target).parents('.intercom-composer-emoji-popover').length == 0
      ) {
        $('.intercom-composer-emoji-popover').removeClass('active')
      }
    })

    $(document).on('click', '.intercom-emoji-picker-emoji', function () {
      if ($('.emojis').text().includes($(this).html())) {
        return
      } $('.emojis').append($(this).text())
    })

    $('.intercom-composer-popover-input').on('input', function () {
      var query = this.value
      if (query != '') {
        $(".intercom-emoji-picker-emoji:not([title*='" + query + "'])").hide()
      } else {
        $('.intercom-emoji-picker-emoji').show()
      }
    })
  }
  return viewPost
})
