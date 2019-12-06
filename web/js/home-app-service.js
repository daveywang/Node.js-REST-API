/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */
 
app.service('Utils', function($http) {
	this.getFileList = () => {
		let response = $http({
			method: 'GET',
			url: '/download/getFileList'
		})
		.then((response) => {
			return response.data;
		});

		return response;	
	}
	
	this.uploadFile = () => {
		$('#data_container').hide();
		$('#msg_container').hide();
		
		let file = $('input[type=file]')[0].files[0];
		if (file == null) {
			$('#msg_container').html('Please select a file to upload!').show();
			return;
		}	

		$('#waitting').show();
		
		var formData = new FormData(); 
		formData.append('file', file); 
		
		return $.ajax({
			url: '/upload',
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(response) {
				//alert('GOOD: ' + JSON.stringify(response));
				$('#waitting').hide();
				$('#msg_container').hide();
				$('#data_container').html(JSON.stringify(response)).show();
			},
			error: function(response) {
				//alert('BAD: ' + JSON.stringify(response));
				/* if the access is denied, then redirct to login page */
				if (response.status == 401 || response.status == 403) window.location = '/';
				else {
					$('#data_container').hide();
					$('#waitting').hide();
					$('#msg_container').html(response.responseJSON.msg).show();
				}
			}
		});
	}
	
	this.checkFile = (fileName) => {
		$('#data_container').hide();
		$('#msg_container').hide();
		
		if (fileName == 'Please select a file') {
			$('#msg_container').html('Please put the file name!').show();
			return;
		}	
		
		return $.ajax({
			url: '/download/checkFile',
			type: 'GET',
			data: $('#download_form').serialize(),
			dataType: 'json',
			success: function(response) {
				//alert('GOOD: ' + JSON.stringify(response));
				$('#msg_container').hide();
			},
			error: function(response) {
				//alert('BAD: ' + JSON.stringify(response));
				/* if the access is denied, then redirct to login page */
				if (response.status == 401 || response.status == 403) window.location = '/';
				else {
					$('#data_container').hide();
					$('#msg_container').html(response.responseJSON.msg).show();
				}
			}
		});
	};
	
	this.booksFormSubmitEventBinding = ($scope) => {
		let form = $('#books_form');
		form.submit((event) => {
			event.preventDefault(); 						
			var url = form.attr('action'); 			
			var requestMethod = form.attr('method'); 	
			var formData = form.serialize(); 	

			/* Check the author name if it is empty for PUT, POST and DELETE operations */
			if (requestMethod != 'GET' && $('input[name=authorName]').val() == '') {
				$('#data_container').hide();
				$('#msg_container').html('Please put the author name!').show();
				return;
			}	

			$.ajax({
				url: url,
				type: requestMethod,
				data: formData,
				dataType: 'json',
				success: (response) => {
					$scope.data = response;
					//alert('GOOD: ' + JSON.stringify($scope.data));
					$('#msg_container').hide();
					//$('#data_container').html(JSON.stringify(response)).show();
					$('#data_container').show();
				},
				error: (response) => {
					//alert('BAD: ' + JSON.stringify(response));
					/* if the access is denied, then redirct to login page */
					if (response.status == 401 || response.status == 403) window.location = '/';
					else {
						$('#data_container').hide();
						$('#msg_container').html(response.responseJSON.msg).show();
					}
				}
			});
		});	
	}
});

