define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojdatetimepicker'],
function(oj, ko, $)
{
    function viewModel()
    {
      var self = this;
      var dateOptions = {formatType: 'date', dateFormat: 'medium'};
      var dateConverterFactory = oj.Validation.converterFactory("datetime");
      self.dateConverter = dateConverterFactory.createConverter(dateOptions);        
        
      var salaryOptions = {
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol"
      };
      var salaryConverterFactory = 
            oj.Validation.converterFactory("number");
      self.salaryConverter = 
            salaryConverterFactory.createConverter(salaryOptions);        
        
      self.collection = new oj.Collection(null, {
        model: new oj.Model.extend({idAttribute: 'EMPLOYEE_ID'}),
        url: 'cookbook/commonModel/crud/CRUDGrid/employeeData.json'
      });        
        
      self.dataSource = new oj.CollectionDataGridDataSource(
        self.collection, {
        rowHeader: 'EMPLOYEE_ID', 
        columns:['FIRST_NAME', 'LAST_NAME', 'HIRE_DATE', 'SALARY']
      });        

      var nextKey = 121;        

      //build a new model from the observables in the form
      self.buildModel = function() {
        return {
          'EMPLOYEE_ID': self.inputEmployeeID(),
          'FIRST_NAME': self.inputFirstName(),
          'LAST_NAME': self.inputLastName(),
          'HIRE_DATE': self.inputHireDate(),
          'SALARY': self.inputSalary()
        };
      };
        
      //used to update the fields based on the selected row
      self.updateFields = function(model) {      
        self.inputEmployeeID(model.get('EMPLOYEE_ID'));
        self.inputFirstName(model.get('FIRST_NAME'));
        self.inputLastName(model.get('LAST_NAME'));
        self.inputHireDate(model.get('HIRE_DATE'));
        self.inputSalary(model.get('SALARY'));
      };

      //add the model to the collection at index 0
      self.add = function() {
        if (self.inputEmployeeID(nextKey) < nextKey) {
          self.inputEmployeeID(nextKey);            
        }
        var model = self.buildModel();
        nextKey += 1;
        self.inputEmployeeID(nextKey);
        self.collection.add(model, {at:0});
      };

      // update the model in the collection
      self.update = function() {
        if (self.modelToUpdate) {
          self.modelToUpdate.set(self.buildModel());
        }
      };

      //remove the selected model from the collection
      self.remove = function() {
        self.collection.remove(self.modelToUpdate);
      };

      //reset the fields to their original values
      self.resetFields = function() {       
        self.inputEmployeeID(nextKey);
        self.inputFirstName('Jane');
        self.inputLastName('Doe');
        self.inputHireDate(oj.IntlConverterUtils.dateToLocalIso(new Date()));
        self.inputSalary(15000);
      };  

      //intialize the observable values in the forms
      self.inputEmployeeID = ko.observable(nextKey);
      self.inputFirstName = ko.observable('Jane');
      self.inputLastName = ko.observable('Doe');
      self.inputHireDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
      self.inputSalary = ko.observable(15000);

      self.getCellClassName = function(cellContext) {
        var key = cellContext['keys']['column'];
        if (key === 'SALARY') { 
          return 'oj-helper-justify-content-right';
        }
        return 'oj-helper-justify-content-flex-start';                          
      }

      document.getElementById('datagrid').addEventListener('selectionChanged', function(event) {
        //on selection change update fields with the selected model
        var selection = event.detail['value'][0];
        if (selection != null) {
          var rowKey = selection['startKey']['row'];
          self.modelToUpdate = self.collection.get(rowKey);
          self.updateFields(self.modelToUpdate);
        }
      });        
    };

    return new viewModel();
});
