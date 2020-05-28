define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  './api',
  'ojs/ojbootstrap',
  'ojs/ojarraydataprovider',
  'ojs/ojpagingdataproviderview',
  'ojs/ojpagingcontrol',
  'ojs/ojlistview',
  'ojs/ojinputtext',
  'ojs/ojbutton',
  'ojs/ojdialog',
  'ojs/ojlabel',
  'ojs/ojmodel',
  'ojs/ojknockout',
  'ojs/ojvalidation-datetime',
  'ojs/ojformlayout',
  'ojs/ojvalidation-base',
  'ojs/ojtable',
  'ojs/ojmessages',
  'ojs/ojtimezonedata'
], function (
  oj,
  ko,
  $,
  api,
  Bootstrap,
  ArrayDataProvider,
  PagingDataProviderView
) {
  function InternTaskModel () {
    var self = this

    self.viewSubmission = ko.observable(false)
    self.submitted = ko.observable(false)
    self.is_graded = ko.observable(false)
    self.deadlinePassed = ko.observable(false)
    self.dataProvider = ko.observable()
    self.submissionDataProvider = ko.observable()
    self.onProbation = ko.observable(false)

    var userToken = localStorage.getItem('user_token')
    var user = localStorage.getItem('user')
    user = JSON.parse(user)
    self.user_id = ko.observable(user.id)
    self.taskSubmit = ko.observable({})
    self.task_id = ko.observable('')

    // Task view observables
    self.submitted_link = ko.observable('')
    self.submitted_comment = ko.observable('')
    self.submission_link = ko.observable('')
    self.task_comment = ko.observable('')
    self.is_active = ko.observable('')
    self.track = ko.observable('')
    self.grade_score = ko.observable('')

    self.applicationMessages = ko.observableArray([])

    var submissionURL = `${api}/api/submit`
    var gradeURL = `${api}/api/user`
    var tasksURL = `${api}/api/task`

    self.taskSelected = ko.observable({})

    self.taskSelectedChanged = function (event) {
      if (event.detail.value.length != 0) {
        const { data } = self.taskSelected()
        if (data == null) {

        } else {
          self.task_id(self.taskSelected().data.id)
          self.deadlinePassed(
            self.deadlineCheck(self.taskSelected().data.deadline)
          )
          self.fetchGrade()
          fetchSubmission()
          self.viewSubmission(true)
        }
      }
    }

    self.toTasks = () => {
      self.viewSubmission(false)
      self.submitted(false)
      self.is_graded(false)
      self.deadlinePassed(false)
      self.refreshList()
    }

    // refresh list
    self.refreshList = () => {
      fetchTrack(user.id)
    }

    self.deadlineCheck = date => {
      var deadline = new Date(date).toISOString()
      var currentDate = new Date(Date.now()).toISOString()
      return deadline < currentDate
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

      return formatDateTime.format(
        new Date(year, month, day, hours, minutes, seconds).toISOString()
      )
      // return formatDateTime.format(new Date(date).toISOString());
    }
    // table date converter
    self.formatDate = date => {
      var formatDate = oj.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME
      ).createConverter({
        formatType: 'date',
        pattern: 'dd/MM/yy'
      })

      return formatDate.format(new Date(date).toISOString())
    }

    self.submitTask = async () => {
      const user_id = self.user_id()
      const submission_link = self.taskSubmit().submission_link
      const comment = self.taskSubmit().task_comment
      const task_id = self.task_id()
      const is_submitted = 1

      if (
        (submission_link == undefined || submission_link == '') &&
        comment == ''
      ) {
        self.applicationMessages.push({
          severity: 'warning',
          summary: 'Request not sent',
          detail: 'Please include a submission link and a comment',
          autoTimeout: parseInt('0')
        })
        return
      }

      if (submission_link == '') {
        self.applicationMessages.push({
          severity: 'warning',
          summary: 'Request not sent',
          detail: 'Please include a submission link',
          autoTimeout: parseInt('0')
        })
        return
      }

      if (comment == undefined || comment == '') {
        self.applicationMessages.push({
          severity: 'warning',
          summary: 'Request not sent',
          detail: 'Please leave a comment',
          autoTimeout: parseInt('0')
        })
        return
      }

      // task submission validation
      const feedback = document.getElementById('submission_feedback')
      if (
        submission_link.match(
          new RegExp(
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
          )
        )
      ) {
        feedback.style.color = 'green'
        feedback.innerHTML = 'Valid URL'
      } else {
        feedback.style.color = 'red'
        feedback.innerHTML = 'Invalid URL, please check!'
        return
      }
      if (!submission_link.startsWith('https://')) {
        feedback.style.color = 'red'
        feedback.innerHTML =
          'Your submission link needs to start with https://'
        return
      }

      try {
        const response = await fetch(`${submissionURL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
          },
          body: JSON.stringify({
            user_id,
            task_id,
            submission_link,
            comment,
            is_submitted
          })
        })

        self.applicationMessages.push({
          severity: 'confirmation',
          summary: 'Task submitted',
          detail: 'You have successfully submitted',
          autoTimeout: parseInt('0')
        })
        document.getElementById('taskURL').value = ''
        document.getElementById('taskComment').value = ''
        self.fetchGrade()
        self.submitted(true)
        self.taskSubmit({})
      } catch (err) {
        console.log(err)
        self.applicationMessages.push({
          severity: 'error',
          summary: 'Error submitting task',
          detail: 'Error submitting task. Please try again.',
          autoTimeout: parseInt('0')
        })
      }
    }

    self.fetchTrack = async id => {
      try {
        const response = await fetch(`http://test.hng.tech/api/track/${id}`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        })
        const { data } = await response.json()
        return data
      } catch (err) {
        console.log(err)
      }
    }

    self.fetchTasks = async () => {
      try {
        const tasks_tracks = await Promise.all([
          fetch(`${api}/api/user/task/`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }),
          fetch("http://test.hng.tech/api/track/all", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }),
        ]);

        const tasks = await tasks_tracks[0].json()
        const tracks = await tasks_tracks[1].json()

        const taskResponse = tasks.data.flat()
        const trackResponse = tracks && tracks.data && tracks.data.data
        for (let i = 0; i < taskResponse.length; i++) {
          for (let j = 0; j < trackResponse.length; j++) {
            if (taskResponse[i].track_id == trackResponse[j].id) {
              taskResponse[i].track_name = trackResponse[j].track_name
            }
          }
        }
        self.dataProvider(
          new PagingDataProviderView(
            new ArrayDataProvider(taskResponse, {
              keys: taskResponse.map(function (value) {
                value.deadline = self.formatDateTime(value.deadline)
                return value.title
              })
            })
          )
        )
      } catch (err) {
        console.log(err)
      }
    }

    function fetchTrack (id) {
      $.ajax({
        type: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json'
        },

        url: `${api}/api/user-profile/${id}`,
        success: async function (response) {
          // let id = response.data.tracks[0].id;
          // const tasksLoop = async _ => {
          //     const tasksPromise = response.data.tracks.map(
          //       async (track, id) => await self.fetchTasks(track.id)
          //     );
          //     const taskResolution = await Promise.all(
          //       tasksPromise
          //     );
          //     return taskResolution;
          // }
          // const tasks = await tasksLoop();
          self.fetchTasks()
        }
      })
    }

    function fetchSubmission () {
      const task_id = self.task_id()
      $.ajax({
        url: `${tasksURL}/${task_id}/intern_submissions`,
        headers: {
          Authorization: 'Bearer ' + userToken,
          Accept: 'application/json'
        },
        method: 'GET',

        success: ({ status, data }) => {
          if (status == true) {
            if (data.comment === null) {
              data.comment = 'No comment'
            }
            self.submissionDataProvider(
              new PagingDataProviderView(
                new ArrayDataProvider(data, { keyAttribute: 'user_id' })
              )
            )
          }
        }
      })
    }

    self.fetchGrade = async () => {
      const user_id = self.user_id()
      const task_id = self.task_id()
      try {
        const response = await fetch(`${gradeURL}/${user_id}/task/${task_id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${userToken}`
          }
        })
        const { data, status } = await response.json()

        if (status == true && data != null && data[0] != undefined) {
          if (data[0].is_submitted == 1) {
            self.submitted(true)
            self.submitted_link(`${data[0].submission_link}`)
            self.submitted_comment(`${data[0].comment}`)
            if (data[0].is_graded == 1) {
              self.is_graded(true)
              self.grade_score(`${data[0].grade_score}`)
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchTrack(user.id)

    function fetchIfProbated () {
      $.ajax({
        url: `${api}/api/probation/status/${user.id}`,
        headers: {
          Authorization: 'Bearer ' + userToken,
          Accept: 'application/json'
        },
        method: 'GET',
        success: ({ status, data }) => {
          if (status == 'success') {
            if (data.probator !== undefined) {
              self.onProbation(data.status)
            } else {
              self.onProbation(false)
            }
          }
        }
      })
    }
    fetchIfProbated()

    // listen for changes
    const pm = ko.dataFor(document.querySelector('#user'))
    pm.selectedItem.subscribe(function () {
      if (pm.selectedItem() == 'Tasks') {
        // fetchIfProbated();
        fetchTrack(user.id)
      }
    })
  }

  return new InternTaskModel()
})
