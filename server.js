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
		var col = db.collection('messages'),
			sendStatus = function(s){
				socket.emit('status',s);
			};
		
		col.find().limit(100).sort({_id:1}).toArray(function(err, res){
			if(err) throw err;
			socket.emit('output',res);
		});
		
		socket.on('input',function(data){
			var name = data.name,
				message = data.message,
				whitespacePattern = /^\s*$/;
			
			if(whitespacePattern.test(name) || whitespacePattern.test(message)){
				sendStatus('Name and message are requires');
			}else{
				col.insert({
					name:name,
					message:message
				},function(err){
					
					client.emit('output',[data]);
					
					sendStatus({
						message: "Message Sent",
						clear:true
					});
					
				});
			}
		});
	});
	
});

//app.listen(3000);
