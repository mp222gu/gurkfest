var db = require('./dbal').db;
var _ = require('underscore');
var moment = require('moment');

function getAll(req, res){
  if(req.session.user){
    var entity = req.query.entity;
    db.model(entity).find(function(err, objects){
      
      var response = {records : objects};
      res.write(JSON.stringify(response));
      res.end();
    })
  }
  else{
    var body = 'not logged in';
    res.writeHead('401', {
    'Content-Length': body.length,
    'Content-Type': 'text/plain' });
    res.write(body);
    res.end();

  }
}
function getOne(req, res){
  if(req.session.user){
    var entity = req.query.entity;
    db.model(entity).findOne({_id: req.query._id}, function(err, obj){
      
      var response = {records : obj};
      res.write(JSON.stringify(response));
      res.end();
    })
  }
  else{
    var body = 'not logged in';
    res.writeHead('401', {
    'Content-Length': body.length,
    'Content-Type': 'text/plain' });
    res.write(body);
    res.end();

  }
}
function findBy(req, res){

  if(req.session.user){
    var entity = req.query.entity;
    delete req.query.entity;
   
    db.model(entity).find(req.query, function(err, obj){
     
      var response = {records : obj};
      res.write(JSON.stringify(response));
      res.end();
    })
  }
  else{
    var body = 'not logged in';
    res.writeHead('401', {
    'Content-Length': body.length,
    'Content-Type': 'text/plain' });
    res.write(body);
    res.end();

  }
}
function save(req, res){
  if(req.session.user){
    
    var entity = req.body.entity;
    var id = req.body._id;
    delete req.body.entity;
    console.log(id)
    var args = req.body;
    
    if(id){
      
      delete req.body.id;
      db.model(entity).findOne({_id: id}, function(err, obj){
        
        _.map(args, function(value, key){
          
          obj[key] = value;
        });
        obj.lastUpdated = moment().format('YY-MM-DD HH:mm:ss');
        console.log(obj);
        obj.save();
        res.end();
      })
    }
    else{
      var model = db.model(entity);
      var instance = new model();
      _.map(args, function(value, key){
          
          instance[key] = value;
        });
      instance.lastUpdated = moment().format('YY-MM-DD HH:mm:ss');
      console.log(instance);
      instance.save();
      res.end();
    }
      
   
  }
  else{
    var body = 'not logged in';
    res.writeHead('401', {
    'Content-Length': body.length,
    'Content-Type': 'text/plain' });
    res.write(body);
    res.end();

  }
}

function create(req, res){
  var entity = req.body.entity;
  delete req.body.entity;
  var obj = db.model(entity);
  var instance = new obj();
  var args = req.body;
  _.map(args,function(value, key){
    instance[key] = value;
  });
  instance.created = moment().format('YY-MM-DD HH:mm:ss');
  instance.save();
  res.end();
}

function remove(req, res){
  var entity = req.body.entity;
  var id = req.body.id;
  console.log(entity + id)
  db.model(entity).findOne({_id:id}, function(err, obj){
        obj.remove();
        res.end();
     })
}

module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.save = save;
module.exports.remove = remove;
module.exports.create =  create;
module.exports.findBy = findBy;
