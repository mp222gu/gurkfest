'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('app', [
  'ui.router',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
])
// Register services
app.service('dataService', ['$http', DataService]);
app.service('budgetFactory', [BudgetFactory]);
app.service('employeeFactory', [EmployeeFactory]);
app.service('sorterService', [SorterService]);

app.config(['$stateProvider','$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
    .state('userlist', {
      url: '/user/list', 
      templateUrl : 'partials/user/list.html'
    })
    .state('edituser' , {
      url: '/user/edit/:id',
      templateUrl : 'partials/user/edit.html'
    })
    .state('login' , {
      url: '/login',
      templateUrl : 'partials/user/login.html'
    })
    .state('newuser', {
      url: '/user/new',
      templateUrl : 'partials/user/new.html'
    })
    .state('budget', {
      url: '/budget/:id',
      //abstract:true,
      templateUrl: "partials/budget/detail.html"
    })
   
   /* .state('budget.edit', {
      url: '',
      views: {
        'edit': {
          templateUrl: 'partials/budget/editModal.html'
        }
      }
    })*/
    /*.state('budget.newRecord', {
      url: '',
      views: {
        'newRecord': {
          templateUrl: 'partials/budget/newRecordModal.html'
        }
      }
    })*/
    .state('budgets' ,{
      url: '/Budgets',
      abstract:true, 
      templateUrl : 'partials/budget/list.html',
      
    })
    .state('budgets.newBudget', {
      url: '',
      views: {
         'newBudget': {
         templateUrl : 'partials/budget/create.html'
       }
      }
     
    })
    
  }])

app.run(function ($rootScope, $location, AuthenticationService) {
  // enumerate routes that don't need authentication
  var routesThatDontRequireAuth = ['/login'];
  // check if current location matches route  
  var routeClean = function (route) {
    return _.find(routesThatDontRequireAuth,
      function (noAuthRoute) {
        return (route === noAuthRoute);
      });
  };

  $rootScope.$on('$stateChangeStart', function (event, next, current) {

    // if route requires auth and user is not logged in
    if (!routeClean($location.url())) {

      var promise = AuthenticationService.getLoginStatus().then(function(resolved){
        console.log(resolved)}
        , function(rejected){
          console.log(rejected);
          $location.path('/login');
        })
        
         
      }
      // redirect back to login
      
    
    else
      $location.path('/login');
  });
})
// Broadcaster 
app.factory('eventBroadcast', function($rootScope) {
   // eventBroadcaster is the object created by the factory method.
   var eventBroadcaster = {};

   // The message is a string or object to carry data with the event.
   eventBroadcaster.message = '';

   // The event name is a string used to define event types.
   eventBroadcaster.eventName = '';

   // This method is called from within a controller to define an event and attach data to the eventBroadcaster object.
   eventBroadcaster.broadcast = function(evName, msg) {
      this.message = msg;
      this.eventName = evName;
      this.broadcastItem();
   };
   // This method broadcasts an event with the specified name.
   eventBroadcaster.broadcastItem = function() {
      $rootScope.$broadcast(this.eventName);
   };
   return eventBroadcaster;
});
