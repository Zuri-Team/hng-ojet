define(['ojs/ojcore',
  'knockout',
  'jquery',
  './api',
  'ojs/ojmessages'
],
function (oj, ko, $, api, ArrayDataProvider) {
  function ProfileViewModel () {
    var self = this
    var RESTurl = `${api}/api/profile`
    var userToken = localStorage.getItem('user_token')
    const user = JSON.parse(localStorage.getItem('user'))
    const id = user.id

    // notification messages observable
    self.applicationMessages = ko.observableArray([])
    self.firstname = ko.observable('')
    self.lastname = ko.observable('')
    self.username = ko.observable('@')
    self.phone = ko.observable('')
    self.email = ko.observable('')
    self.bio = ko.observable('')
    self.stack = ko.observable('')
    self.url = ko.observable('')
    self.location = ko.observable('')
    self.profile = ko.observable('')
    self.devstack = ko.observableArray([
      { value: 'UI/UX', label: 'UI/UX' },
      { value: 'FrontEnd', label: 'FrontEnd' },
      { value: 'Backend', label: 'Backend' },
      { value: 'Digital Marketing', label: 'Digital Marketing' },
      { value: 'DevOps', label: 'DevOps' },
      { value: 'FrontEnd', label: 'FrontEnd' }
    ])
    // Events
    self.acceptStr = ko.observable('image/*')
    self.acceptArr = ko.pureComputed(function () {
      var accept = self.acceptStr()
      return accept ? accept.split(',') : []
    }, self)
    self.editing = ko.observable(false)
    self.editprofile = () => {
      self.editing(true)
    }
    self.cancelediting = () => {
      self.editing(false)
    }
    self.update = () => {
      const form = {
        firstname: self.firstname(),
        lastname: self.lastname(),
        username: self.username(),
        email: self.email(),
        bio: self.bio(),
        url: self.url()
      }
      $.ajax({
        url: `${RESTurl}/${id}/edit`,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + userToken
        },
        data: form,
        contentType: 'application/x-www-form-urlencoded',
        method: 'POST',
        type: 'POST',
        success: function ({ status }) {
          if (status == true) {
            self.editing(false)
            self.fetchProfile()
            self.applicationMessages.push({

              severity: 'confirmation',
              summary: 'Update Successful',
              detail: 'Your profile has been successfully updated',
              autoTimeout: parseInt('0')

            })
          }
        },
        error: function (error) {
          self.applicationMessages.push({
            severity: 'error',
            summary: 'Failed to Update',
            detail: 'An error occurred while updating your profile. Try Again',
            autoTimeout: parseInt('0')

          })
        }
      })
    }

    self.fetchProfile = function () {
      $.ajax({
        url: `${RESTurl}/${id}`,
        headers: {
          Authorization: 'Bearer ' + userToken
        },
        method: 'GET',
        success: res => {
          const [...data] = res.data
          const [user, profile] = data
          const { firstname, lastname, username, email } = user
          const { bio, url, phone, profile_img } = profile
          self.firstname(firstname)
          self.lastname(lastname)
          self.username(username)
          self.email(email)
          self.bio(bio)
          self.url(url)
          // self.phone(phone)

          const profileImg = document.getElementsByClassName('profile_img')
          for (i = 0; i < profileImg.length; i++) {
            profileImg[i].src = localStorage.getItem('slackImg')
            // profileImg[i].src = profile_img;
          }
        }
      })
    }
    self.fetchProfile()
    self.handleAttached = () => {
      self.select_file = function () {
        $('#profilephoto').trigger('click')
      }
      $('#profilephoto').on('change', () => {
        const file = document.querySelector('#profilephoto').files[0]
        const form = new FormData()
        form.append('profile_img', file)
        const reader = new FileReader()
        reader.onload = function (e) {
          $('.profile_img').attr('src', reader.result)
        }

        $.ajax({
          url: `${RESTurl}/${id}/upload`,
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + userToken
          },
          data: form,
          contentType: false,
          processData: false,
          method: 'POST',
          success: function ({ status }) {
            if (status == true) {
              reader.readAsDataURL(file)
              self.applicationMessages.push({
                severity: 'confirmation',
                summary: 'Avatar Updated',
                autoTimeout: parseInt('0')
              })
            }
          },
          error: function (error) {
            self.applicationMessages.push({
              severity: 'error',
              summary: 'Failed to Update',
              detail: 'An error occurred while updating your avatar. Try Again',
              autoTimeout: parseInt('0')
            })
          }
        })
      })
    }
  }

  return new ProfileViewModel()
}

)
