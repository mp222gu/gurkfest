var async = require('async');

var items = [100, 30, 40];

function asyncCall(secs){

	var t = setTimeout(function(){
		console.log("waited " + secs + " ");
	}, secs);
}

async.each(items, 
	function(item, callback){

	asyncCall(item);
	callback();
	}, function(err){
	console.log("All done");
})