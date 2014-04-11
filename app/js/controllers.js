'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
 .controller('EditUserCtrl', function($scope, $stateParams){
  $scope.user= {}
  $scope.user.id = $stateParams.id;
})
.controller('LoginCtrl', function($scope, $http, $location){
  $scope.user = {}
  $scope.login = function(){
    $http.post('ajax/login',  {username:$scope.user.username, password:$scope.user.password})
    .success(function (data){
      
     
      $location.path("/user/" + $scope.user.username)
       
    })
  }
})
.controller('UserListCtrl', function($scope, $http){
  $scope.users = []

  var result = $http.get('ajax/getusers')
  result.success(function(data){
    $scope.users = data
  })

})
.controller('NewUserCtrl', function($scope, $http){
  $scope.user = {}

  $scope.save = function(){
    $http.post('ajax/save', {username : $scope.user.username, password:$scope.user.password});
  }

})
.controller('UserHomeCtrl', function($scope, $http, $stateParams, $location){
  
  $http.get('ajax/getuser', {params:{username: $stateParams.username}})
  .success(function(data){
    $scope.user = data;
  })
  //$scope.budgets = [{name: "budget1"}, {name:'budget2'}]
  $scope.createBudget = function(){
    $location.path('budget/create');
  }
})
.controller('MenuCtrl', function($scope, $http, $location, AuthenticationService){

  (function(){AuthenticationService.getLoginStatus().then(function(granted){
   $scope.isLoggedIn = true;
  }, function(rejected){
    $scope.isLoggedIn = false;
  });
  })();
   
      
  
  $scope.logout = function(){
    $http.get('ajax/logout')
    .success(function(response){
      $location.path('/login');
    })
  }
})
.controller('BudgetCtrl', function($http, $scope,$location, dataService, eventBroadcast, sorterService) {

  function getBudgets(){
   dataService.loadData($http, '/ajax/getAll', {entity:"Budget"},  function(response) {
      $scope.budgets = response.records;
      sorterService.sort($scope.budgets, "created", "DESC")

    });
  }
  getBudgets();
   $scope.add = function() {
      console.log("test");
      $('#newBudgetModal').modal();
      eventBroadcast.broadcast('createBudget');
   };
   $scope.edit = function(id) {

      $('#newBudgetModal').modal();
      eventBroadcast.broadcast('editBudget', {id: id});
      ;
   };
    $scope.$on('refreshBudgetList', function(){
       getBudgets();
   });
   $scope.delete = function(id){
    dataService.saveRecord($http, '/ajax/remove', { entity: "Budget", id:id}, function(response){
       eventBroadcast.broadcast('refreshBudgetList');
    });  
   }
   $scope.showBudget = function(id){
      $location.path("/budget/" + id)
   }

})
.controller('NewBudgetCtrl', function($http, $scope, dataService, eventBroadcast, budgetFactory) {
   $scope.budget = {};
   var saveFunc = function() {
   };
  $scope.templates = ["Lyxfällan", "Klassiskt"];
   $scope.$on('editBudget', function() {
      $scope.action = "Edit";
      var id = eventBroadcast.message.id;
      dataService.loadData($http, '/ajax/getOne', {entity:"Budget", id: id}, function(response) {
         $scope.budget = budgetFactory.create(response.records);
         $scope.save = function() {
            dataService.saveRecord($http, '/ajax/save', {entity:"Budget", id: id, name: $scope.budget.name}, function(response) {
             $('#newBudgetModal').modal('toggle'); 
             eventBroadcast.broadcast('refreshBudgetList');
            });
         };
      });
   });
   $scope.$on('createBudget', function() {
      $scope.action = "Create";
      $scope.budget = {};
      $scope.save = function() {
         dataService.saveRecord($http, '/ajax/create', { 
          entity:"Budget"
        , name: $scope.budget.name
        ,  finalized : false
        , records: [],
      }
      , function(response) {
          $('#newBudgetModal').modal('toggle');
         eventBroadcast.broadcast('refreshBudgetList');
          
         });
      };
   });
})
.controller('BudgetDetailCtrl', function($scope, $http, $stateParams, dataService, eventBroadcast, sorterService){

  $scope.months = ["January", "February", "March", "April", "May", "June", "July", ];
  $scope.currentMonth = moment().format("MMMM");
  function getBudget(){
    dataService.loadData($http, '/ajax/getOne' , {entity:"Budget", _id:$stateParams.id}, function(response){
      $scope.budget = response.records;
    });
  }
  getBudget();
  function getBudgetItems(){
    dataService.loadData($http, '/ajax/findBy' , {entity:"BudgetItem", budget:$stateParams.id}, function(response){
      $scope.incomes = _.filter(response.records, function(item){
        return (item.type === "Income");
      });
       $scope.expenses = _.filter(response.records, function(item){
        return (item.type === "Expense");
      });
      $scope.balance = _.reduce(response.records, function(memo, num){ return (num.type === "Income") ? memo + num.amount  : memo - num.amount; }, 0);
    });
  }

  getBudgetItems();
  
    $scope.design = function(){
      $('#editModal').modal();

      eventBroadcast.broadcast('editBudget', {id:$stateParams.id});
    };
  
  $scope.$on('refreshBudget', function(){
      getBudgetItems();
   });
  $scope.addRecord = function(id){
    eventBroadcast.broadcast('addRecord', {item: id})
    $('#newRecordModal').modal();
  }
  $scope.finalize = function(){
    $scope.budget.finalized = true;
    $scope.budget.entity = "Budget";
     dataService.saveRecord($http, '/ajax/save', $scope.budget, function(response) {

     });
  }
})

.controller('BudgetDesignCtrl', function($scope, $http, eventBroadcast, dataService){
  $scope.$on('editBudget', function() {
      
      var id = eventBroadcast.message.id;
      $scope.$on('refreshBudget', function(){
       dataService.loadData($http, '/ajax/findBy', {entity:"BudgetItem", budget:id}, function(response) {
         $scope.budgetItems = response.records;
        });
      });
      dataService.loadData($http, 'ajax/findBy', {entity:"BudgetItem", budget:id}, function(response){
        $scope.budgetItems = response.records;
        console.log($scope.budgetItems)
        $scope.types = [{name:'Expense'}, {name:'Income'} ];
        $scope.add = function(){
          var budget = { budget: id, budgetItems:[$scope.newItem]};
           dataService.saveRecord($http, '/ajax/saveBudgetItems', budget, function(response) {
              console.log(response);
              eventBroadcast.broadcast('refreshBudget');
              $scope.newItem = {}
           });
          
         
        }
        $scope.save = function() {
         
           var budget = { budget: id, budgetItems:$scope.budgetItems};
           dataService.saveRecord($http, '/ajax/saveBudgetItems', budget, function(response) {
            $('#editModal').modal('toggle');
           eventBroadcast.broadcast('refreshBudget');
           console.log(response)
          });
        };
        $scope.delete = function(id){
          dataService.saveRecord($http, 'ajax/remove', {entity:"BudgetItem", id:id}, function(repsonse){
            console.log(response);
           eventBroadcast.broadcast('refreshBudget');

          })
        }
      });
   });
})
.controller('NewRecordCtrl', function($scope, $http, dataService, eventBroadcast){

  $scope.$on('addRecord', function(){
    var itemId = eventBroadcast.message.item;
    var item = {};
    dataService.loadData($http, 'ajax/getOne', {entity:"BudgetItem", id:itemId}, function(response){
      item = response.records;
      $scope.record = {};
      $scope.save = function(){
        item.records.push($scope.record);
        item.entity = "BudgetItem";
        dataService.saveRecord($http
          , 'ajax/save'

          , item
          , function(response){
          $('#newRecordModal').modal('toggle');
      })
    }
    })
    
  })
})



