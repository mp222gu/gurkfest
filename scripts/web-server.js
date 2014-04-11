

 
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var _ = require("underscore");
var http = require('http');
var path = require('path');
var db = require('../app/dbal').db;
var moment = require('moment');
var app = express();
var async = require('async');

// all environments
app.set('port', process.env.PORT || 3000);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
  store: new MongoStore({
    db: 'budgetDb',
    host: 'localhost',
    port: 27017,
    auto_reconnect:true,
    clear_interval: 10
  })
}));
app.disable('view cache');
app.use(require('less-middleware')({ src: path.join(__dirname, 'app') }));
app.use(express.static(path.join(__dirname, '../app/js')), {maxAge: 10});
app.use(express.static(path.join(__dirname, '../app')));
app.use(app.router);



if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/ajax/login', function(req, res){
  
  db.model('User').findOne({username: req.body.username}, function (err, user) {

    if (err) { console.log(err) };
    if (!user) { res.write("no user") }
    else {
    console.log("try to login " + user);
      if(user.password === req.body.password){
        console.log("login ok ")
       req.session.user = user;
    console.log(req.session.user);
      res.write(JSON.stringify(user))
     }
     else
      console.log("login failed " + user.password + " " + req.body.password)
    }
    res.end();
  });
})
app.get('/ajax/logout', function(req, res){
  
  req.session.user = null;
  res.write("logged out");
  res.end();
})

app.get('/ajax/isloggedin', function(req, res){
  
  if(req.session.user){
    var body = 'logged in';
    res.writeHead('200', {
    'Content-Length': body.length,
    'Content-Type': 'text/plain' });
    res.write(body);
    res.end();

  }
  else{
    var body = 'not logged in';
    res.writeHead('401', {
    'Content-Length': body.length,
    'Content-Type': 'text/plain' });
    res.write(body);
    res.end();

  }
})
var genericApi = require('../app/genericApi');
app.get('/ajax/getAll', genericApi.getAll);
app.get('/ajax/getOne', genericApi.getOne);
app.get('/ajax/findBy', genericApi.findBy);
app.post('/ajax/save', genericApi.save);
app.post('/ajax/create', genericApi.create);
app.post('/ajax/remove', genericApi.remove)
app.post('/ajax/saveBudgetItems', function(req, res){

  var budget = req.body.budget;
  var savedItems = "";
  var items = req.body.budgetItems;
  var now = moment().format('YY-MM-DD HH:mm:ss');
  async.each(items,
     function(item, callback){
      var budgetModel = db.model("BudgetItem");
      
      if(!item._id){
        budgetItem = new budgetModel();
        budgetItem.name = item.name;
        budgetItem.created = now;
        budgetItem.lastUpdated = now;
        budgetItem.type = item.type;
        budgetItem.amount = item.amount;
        budgetItem.budget = budget;
           budgetItem.save(function(err, budgetItem){
           // savedItems += " " + item.name;
            callback();
          });
          
      }
      else{
       
          db.model("BudgetItem").update({_id:item._id}, {name :item.name, type:item.type, amount:item.amount},{multi:true}, function(err){
            console.log(item);
            
            callback();
             
          })
      }
  }, function(){
    
    res.end();
  })
   
})
app.get('*', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
    res.sendfile(path.resolve('../app/index.html')); // load the single view file (angular will handle the page changes on the front-end)
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server pslistening on port ' + app.get('port'));
});

