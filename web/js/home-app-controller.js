/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

app.controller('restDemoAppController', function($scope, Utils) {
	$scope.operations = ['GET', 'PUT', 'POST', 'DELETE'];
	$scope.selectedOperation = $scope.operations[0];
	initFileList();
	Utils.booksFormSubmitEventBinding();

	$scope.uploadFile = () => {
		$.when(Utils.uploadFile()).done((response) => {
			initFileList()
		});
	}
	
	$scope.checkFile = () => {
		$.when(Utils.checkFile($scope.selectedFileName)).done((response) => {
			if (response.msg == 'OK.') $('#download_form').submit();
		});
	}

	function initFileList() {
		$scope.fileList = ['Please select a file'];
		$scope.selectedFileName = $scope.fileList[0];
		Utils.getFileList().then((data) => {
			data = data.sort((a, b) => {return a.localeCompare(b)});
			$scope.fileList = $scope.fileList.concat(data);
		});
	} 	
});

