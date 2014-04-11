'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1')
.factory('AuthenticationService', function($http, $q){
  
    
    return {
    getLoginStatus: function(){
      var deferred = $q.defer();
      $http.get('/ajax/isloggedin')
      .success(function(){
        deferred.resolve('authorized');
        
      })
      .error(function(){
        deferred.reject('unauthorized');
        
      })
      return deferred.promise;
    },
    

  };

  return AuthenticationServiceInstance;
})
/**
 * Service class that provides ajax calls to collect data
 * 
 */
function DataService() {
}
/**
 * Method for collecting data for table
 * @param String url The url to the ajax method 
 * @param Array params the params included in post
 * @param function callback Function that handles the response
 * @returns Data in JSON format
 */
DataService.prototype.loadData = function($http, url, params, callback) {
   $http({
      url: url,
      method: 'GET',
      params: params,
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
   }).success(function(response) {
      callback(response);
   });
};

DataService.prototype.saveRecord = function($http, url, params, callback) {

   $http({
      url: url,
      method: "POST",
      data: params
   }).success(function(response) {

      callback(response);
   });
};
function BudgetFactory(){
}
BudgetFactory.prototype.create = function create(data){
   
   var budget = {};
   
   budget.name = data.name || "";
   
   budget.created = data.created || "";
   return budget;
};
function EmployeeFactory(){
}
EmployeeFactory.prototype.create = function create(data){
   
   var employee = {};
   employee.id = data.id || null;
   employee.first_name = data.first_name || "";
   employee.last_name = data.last_name || "";
   employee.record_last_updated = data.record_last_updated || "";
   employee.record_created = data.record_created || "";
   return employee;
};

function SorterService(){

}
SorterService.prototype.sort = function(collection, property, order){
  
    collection.sort(function(a, b){
      if(order === 'ASC'){
        if(a[property] > b[property]) return 1;
        if(a[property] < b[property]) return -1;
        return 0;
      }
      if(order === 'DESC'){
        if(a[property] > b[property]) return -1;
        if(a[property] < b[property]) return  1;
        return 0;
      }
    })
  
}

