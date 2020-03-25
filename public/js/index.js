$(document).ready(function () {
	// $('#submit').click(function(){
	// 	var name = $('#name').val();
	// 	var age = $('#age').val();
		var socket = io();
		console.log("connected")
		socket.on('msg', function(data){
			console.log(data.msg);
			$('#msg').html(data.msg)
		});
		// socket.on('click_count', function (data) { //4
		//       $('#counter').html(data.count)
		//  });
		

	// });
});