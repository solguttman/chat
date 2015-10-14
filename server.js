var express = require('express'),
	mongo = require('mongodb').MongoClient,
	port = 3000;


var app = express();

app.use(express.static(__dirname + '/public'));

var client = require('socket.io').listen(app.listen(port)).sockets;

mongo.connect('mongodb://localhost/chat', function(err, db){
	if(err) throw err;
	
	client.on('connection',function(socket){
		// Wait for input
		var col = db.collection('messages');
		
		socket.on('input',function(data){
			var name = data.name,
				message = data.message,
				whitespacePattern = /^\s*$/;
			
			if(whitespacePattern.test(name) || whitespacePattern.test(message)){
				console.log('invalid');
			}else{
				col.insert({
					name:name,
					message:message
				},function(err){
					console.log('inserted');
				});
			}
		});
	});
	
});

//app.listen(3000);
