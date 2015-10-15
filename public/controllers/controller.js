var app = angular.module('app',[]);
var socket;
app.controller('ChatCtrl',['$scope',function($scope){
	var defaultStatus = 'Idl';
	$scope.status = defaultStatus;
	$scope.messages = '';
	$scope.chatName = '';
	$scope.chatMsg = '';
	
	try{
		socket = io.connect('http://104.236.10.215:3000/');
	}catch(e){

	}
	
	if(socket !== undefined){
		
		socket.on('status',function(data){
			var status = typeof data === 'object' ? data.message : data;
			$scope.status = status;
			
			if(status !== defaultStatus){
				var delay = setTimeout(function(){
					$scope.status = defaultStatus;
					clearInterval(delay);
					$scope.$apply();
				},3000);
			}

			if(data.clear === true){
				$scope.chatMsg = '';
			}
			
			$scope.$apply();
		});

		socket.on('output',function(data){
			if(data.length){
				if($scope.messages.length){
					$scope.messages.push(data[0]);
				}else{
					$scope.messages = data;
				}
				$scope.$apply();
			}
		}); 
		
	}
	
}]);

app.directive('sendMsg',[function(){
	
	return {
		link : function(scope, element, attrs){
			if(socket !== undefined){
				element.on('keydown',function(e){
			
					if(e.which === 13 && e.shiftKey === false){
						socket.emit('input',{
							name:scope.chatName,
							message:scope.chatMsg
						});
					}

				});
			}
		}
	};
	
}]);