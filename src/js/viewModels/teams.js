define(['knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojinputtext', 
      'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojlabel', 'ojs/ojvalidationgroup'],
  function(ko, Bootstrap, ArrayDataProvider)
  {   
    function TeamsViewModel()
    {
      var self = this
       var teamsArray = [
          {TeamName: 'Mavin', TeamLead: 'Tunde ednut \n @hermit', Member: 270},
          {TeamName: 'Heist', TeamLead: 'Toni stack \n @tonistack', Member: 352},
          {TeamName: 'Synergy', TeamLead: 'Wale bakare \n @placeholder', Member: 231},
          {TeamName: 'Jupiter', TeamLead: 'Jon Jude \n @judejay', Member: 312},
          {TeamName: 'Dauntless', TeamLead: 'Austin okoro \n @austyno', Member: 340},
          {TeamName: 'Jupiter', TeamLead: 'Jon Jude \n @judejay', Member: 200},
          {TeamName: 'Dauntless', TeamLead: 'Austin okoro \n @austyno', Member: 270},
      ]
    
      self.teamsObservableArray = ko.observableArray(teamsArray);
      self.dataprovider = new ArrayDataProvider(self.teamsObservableArray, {keyAttributes: '@index'});
      self.groupValid = ko.observable();
      
      //add to the observableArray
      self.addRow = function()
      {
          if (self.groupValid() == "invalidShown") {
              return;
          }
          var teams = {
                       'TeamName': self.inputTeamName(),
                       'TeamLead': self.inputTeamLead(),
                       'Member': self.inputMember(),
                    };
                    
          self.teamsObservableArray.push(teams);
      }.bind(self);
      
      //used to update the fields based on the selected row
     self.updateRow = function()
      {   
          if (self.groupValid() == "invalidShown") {
              return;
          }
          var element = document.getElementById('table');
          var currentRow = element.currentRow;
          
          if (currentRow != null)
          {
             self.teamsObservableArray.splice(currentRow['rowIndex'], 1, {
                           'TeamName': self.inputTeamName(),
                           'TeamLead': self.inputTeamLead(),
                           'Member': self.inputMember(),
                        });
                        
          }
      }.bind(self);
      
      //used to remove the selected row
      self.removeRow = function()
      {
          var element = document.getElementById('table');
          var currentRow = element.currentRow;
  
          if (currentRow != null)
          {
              self.teamsObservableArray.splice(currentRow['rowIndex'], 1);
          }
      }.bind(this);
      
      //intialize the observable values in the forms
      self.inputTeamName = ko.observable();
      self.inputTeamLead = ko.observable();
      self.inputMember = ko.observable();  

      
      {
        var data = event.detail;
        if (event.type == 'currentRowChanged' && data['value'] != null)
        {
          var rowIndex = data['value']['rowIndex'];
          var teams = self.teamsObservableArray()[rowIndex];
          if (teams != null) {
            self.inputTeamName(teams['TeamName']);
            self.inputTeamLead(teams['TeamLead']);
            self.inputMember(teams['Member']);
          }
         
        }
      }bind(self);
    }
    return new TeamsViewModel;
    
    /*Bootstrap.whenDocumentReady().then(
      function()
      {
        ko.applyBindings(vm, document.getElementById('tableDemo'));
        var table = document.getElementById('table');
        table.addEventListener('currentRowChanged', vm.currentRowListener);
      }

    );*/
    
  });