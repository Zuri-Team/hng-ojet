define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'ojs/ojarraydataprovider',
  'ojs/ojcomponentcore',
  './api',
  'ojs/ojinputtext',
  'ojs/ojknockout',
  'ojs/ojselectcombobox',
  'ojs/ojoffcanvas',
  'ojs/ojbutton',
  'ojs/ojmodule',
  'ojs/ojcomposite',
  'ojs/ojavatar',
  'ojs/ojlabel',
  'ojs/ojdialog',
  'ojs/ojfilepicker',
  'ojs/ojformlayout',
  'ojs/ojbutton',
  'ojs/ojchart',
  'ojs/ojdialog'
], function (oj, ko, $, ArrayDataProvider, Components, api) {
  function AdminDashboardViewModel () {
    var self = this
    var router = oj.Router.rootInstance
    var userToken = localStorage.getItem('user_token')

    var user = localStorage.getItem('user')
    user = JSON.parse(user)

    if (user == null) {
      router.go('login')
    }

    if (user.role == 'intern') {
      router.go('user_dashboard')
    }

    self.selectedItem = ko.observable()
    self.isNotify = ko.observable(false)

    self.drawer = {
      displayMode: 'overlay',
      selector: '#sidebar',
      content: '#maincontent'
    }

    self.toggleDrawer = function () {
      self.isNotify(false)
      return oj.OffcanvasUtils.toggle(self.drawer)
    }

    self.tags = [
      { value: '.net', label: '.net' },
      { value: 'Accounting', label: 'Accounting' },
      { value: 'ADE', label: 'ADE' },
      { value: 'Adf', label: 'Adf' },
      { value: 'Adfc', label: 'Adfc' },
      { value: 'Adfm', label: 'Adfm' },
      { value: 'Android', label: 'Android' },
      { value: 'Aria', label: 'Aria' },
      { value: 'C', label: 'C' },
      { value: 'C#', label: 'C#' },
      { value: 'C++', label: 'C++' },
      { value: 'Chrome', label: 'Chrome' },
      { value: 'Cloud', label: 'Cloud' },
      { value: 'CSS3', label: 'CSS3' },
      { value: 'DBA', label: 'DBA' },
      { value: 'Eclipse', label: 'Eclipse' },
      { value: 'Firefox', label: 'Firefox' },
      { value: 'Git', label: 'Git' },
      { value: 'Hibernate', label: 'Hibernate' },
      { value: 'HTML', label: 'HTML' },
      { value: 'HTML5', label: 'HTML5' },
      { value: 'IE', label: 'IE' },
      { value: 'IOS', label: 'IOS' },
      { value: 'Java', label: 'Java' },
      { value: 'Javascript', label: 'Javascript' },
      { value: 'JDeveloper', label: 'JDeveloper' },
      { value: 'Jet', label: 'jet' },
      { value: 'JQuery', label: 'JQuery' },
      { value: 'JQueryUI', label: 'JQueryUI' },
      { value: 'JS', label: 'JS' },
      { value: 'Knockout', label: 'Knockout' },
      { value: 'MAF', label: 'MAF' },
      { value: 'Maven', label: 'Maven' },
      { value: 'MCS', label: 'MCS' },
      { value: 'MySql', label: 'MySql' },
      { value: 'Netbeans', label: 'Netbeans' },
      { value: 'Oracle', label: 'Oracle' },
      { value: 'Solaris', label: 'solaris' },
      { value: 'Spring', label: 'spring' },
      { value: 'Svn', label: 'Svn' },
      { value: 'UX', label: 'UX' },
      { value: 'xhtml', label: 'xhtml' },
      { value: 'XML', label: 'XML' }
    ]

    self.tagsDataProvider = new ArrayDataProvider(this.tags, {
      keyAttributes: 'value'
    })
    // self.searchTriggered = ko.observable();
    self.searchTerm = ko.observable()
    self.searchTimeStamp = ko.observable()

    self.search = function (event) {
      var eventTime = getCurrentTime()
      var trigger = event.type
      var term

      if (trigger === 'ojValueUpdated') {
        // search triggered from input field
        // getting the search term from the ojValueUpdated event
        term = event.detail.value
        trigger += ' event'
      } else {
        // search triggered from end slot
        // getting the value from the element to use as the search term.
        term = document.getElementById('search').value
        trigger = 'click on search button'
      }

      // self.searchTriggered("Search triggered by: " + trigger);
      self.searchTerm('Search term: ' + term)
      self.searchTimeStamp('Last search fired at: ' + eventTime)
    }

    function getCurrentTime () {
      var date = new Date()
      return (
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds() +
        '.' +
        date.getMilliseconds()
      )
    }

    this.keyword = ko.observableArray()

    self.fullname = ko.observable('Admin')
    self.track = ko.observable('Design')
    self.slack = ko.observable('@xyluz')
    self.fileNames = ko.observableArray([])

    self.notificationCount = ko.observable('')

    var notificationsURL = `${api}/api/notifications`

    self.selectListener = function (event) {
      var files = event.detail.files
      for (var i = 0; i < files.length; i++) {
        self.fileNames.push(files[i].name)
      }
    }

    self.name = ko.observable('')
    self.email = ko.observable('')
    self.bio = ko.observable('')
    self.url = ko.observable('')
    self.location = ko.observable('')
    self.displayName = ko.observable('@')

    // fetch unread notifications count
    self.fetchCount = async () => {
      try {
        const response = await fetch(`${notificationsURL}/notification_count`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        var data = await response.json()
        // console.log(data);

        if (data.data.notification_count > 0) { self.notificationCount(data.data.notification_count) }
      } catch (err) {
        console.log(err)
      }
    }

    self.sb_sm = ko.observable(false)
    self.searchbar_sm = function () {
      self.sb_sm(!self.sb_sm())
    }

    self.buttonClick = function (event) {
      self.clickedButton(event.currentTarget.id)
      return true
    }

    self.open = function (event) {
      document.getElementById('logoutModal').open()
    }
    self.logout = function () {
      localStorage.clear()
      router.go('login')
    }
    self.close = function (event) {
      document.getElementById('logoutModal').close()
    }

    // route to notifications
    // self.gotoNotifications = function() {
    //   router.go("notifications");
    // };

    self.connected = function () {
      // new
      let user = localStorage.getItem('user')
      user = JSON.parse(user)
      if (user == null) {
        router.go('login')
      } else {
        if (user.role == 'intern') {
          router.go('user_dashboard')
        }
        router.go('admin_dashboard')
      }

      self.fullname(`${user.firstname} ${user.lastname}`)

      Components.subtreeHidden(document.getElementById('summary-admin'))

      // notifications unread count
      self.fetchCount()

      // Go back to the dashboard

      self.dashboard = () => {
        self.isNotify(false)
      }

      //  Fetch all tracks
      self.fetchNotifications = async () => {
        try {
          const response = await fetch(`${notificationsURL}`, {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          })
          // const {
          //   data: { data }
          // } = await response.json();
          var data = await response.json()

          self.dataProvider(
            new PagingDataProviderView(
              new ArrayDataProvider(data.data, { keyAttributes: 'id' })
            )
          )
        } catch (err) {
          console.log(err)
        }
      }

      // notifications click

      self.toggleNotify = () => {
        self.isNotify(!self.isNotify())
      }

      // let shownotif = false;
      // $("#notifi").on("click", function() {
      //   let attr = $(this).attr("for");
      //   shownotif = !shownotif;
      //   self.isNotify(shownotif); // This ensures that we toggle the notification panel effectively;
      //   if (shownotif) {
      //     $("#maincontent_body > div").hide();
      //     $(`#maincontent_body > div[id='${attr}']`).show();
      //   } else {
      //     $("#maincontent_body > div").show();
      //     $(`#maincontent_body > div[id='${attr}']`).hide();
      //   }
      // });

      $('#sidebar li a').on('click', function () {
        const attr = $(this).attr('for')
        $('#maincontent_body > div').hide()
        $(`#maincontent_body > div[id='${attr}']`).show()
        oj.OffcanvasUtils.close(self.drawer)
      })
    }
    self.handleAttached = function () {
      let user = localStorage.getItem('user')
      user = JSON.parse(user)
      if (localStorage.getItem('user_token') == null) {
        router.go('login')
      }
      if (user.role == 'intern') {
        router.go('user_dashboard')
      }
      self.fetchCount()
      self.fetchNotifications()
    }
  }

  return new AdminDashboardViewModel()
})
