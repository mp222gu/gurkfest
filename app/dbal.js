var mongoose = require('mongoose');
var moment = require('moment');
var db = mongoose.createConnection('localhost', 'budgetDb');

db.on('error', console.error);
var User = {};
db.once('open', function() {
  var userSchema = new mongoose.Schema({
    username : String,
    password: String,
  })
 
  User = db.model('User', userSchema);
  var budgetSchema = new mongoose.Schema({
    name : String,
    created: String,
    lastUpdated: String, 
    finalized: Boolean,
    startMonth: String
  })

var now = moment().format('YY-MM-DD HH:mm:ss');
 Budget = db.model('Budget', budgetSchema)
 
 var budgetItemSchema = new mongoose.Schema({
  name:String,
  created:String,
  lastUpdated: String,
  budget:String,
  type: String,
  amount:Number,
  records : Array,
 })
 BudgetItem = db.model('BudgetItem',budgetItemSchema);
 
/* var recordSchema = new mongoose.Schema({
  item: String,
  amount: Number, 
  description: String, 
  created: String, 
  lastUpdated: String, 
 })
 Record = db.model('Record', recordSchema);*/
 
});
module.exports.db = db;
module.exports.User = User;