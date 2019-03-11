/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */
 
$("#login_form").submit(function(event) {
	event.preventDefault(); 						
	var url = $(this).attr("action"); 			
	var requestMethod = $(this).attr("method"); 	
	var formData = $(this).serialize(); 			

	$.ajax({
		url: url,
		type: requestMethod,
		data: formData,
		dataType: 'json',
		success: function(response) {
			//alert('GOOD: ' + JSON.stringify(response));
			window.location = '/homePage';
		},
		error: function(response) {
			//alert('BAD: ' + JSON.stringify(response));
			$("#msg_container").html(response.responseJSON.msg).show();
		}
	});
});