/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const path = require('path');
const fs = require('fs');
const util = require('util');
const express = require('express');
const formidable = require('formidable');
const constants = require('../constants/constants.js');
const utils = require('../utils/utils.js');
const appFilter = require('../filter/app-filter.js');
const status = constants.status;
const msgType = constants.msgType;
const dataFolder = constants.dataFolder;
const fileSizeLimitation = constants.fileSizeLimitation;
const router = express.Router();
const printMsg = utils.printMsg;

/*********************************************************************/
/* Application Filter - all requests for this route from client will be handle first by this function */
/* Check client's available token, then decide if the client is allowed to access the resources */
router.use(appFilter.filter);

/*********************************************************************/
/* POST operation to upload /upload */
router.post('/', (req, res) => {
	let form = new formidable.IncomingForm();
	form.uploadDir = dataFolder;
	form.maxFileSize = fileSizeLimitation;
	
	/* before download, check if the file exist */
	form.onPart = (part) => {
		let fileFullName = dataFolder + path.sep + part.filename;
		if (fs.existsSync(fileFullName)) {
			res.status(status.notAcceptable.code).json({msg: status.notAcceptable.msg + ' - ' + 'The file is already exist.'}).end();
			printMsg(msgType.info, util.format('The file %s is already exist.', fileFullName));
			return;
		}
		
		form.handlePart(part);
	}

	form.parse(req)
	.on('fileBegin', (name, file) => {
		printMsg(msgType.info, 'The file uploading is begin...');
	})
	.on('progress', (bytesReceived, bytesExpected) => {
		//console.log(bytesReceived + '/' + bytesExpected);
	})
	.on('file', (name, file) => {
		res.status(status.ok.code).json({msg: status.ok.msg + ' - ' + 'The file was uploaded to the server'}).end();
		fs.renameSync(file.path, dataFolder + path.sep + file.name);
		printMsg(msgType.info, util.format('The file %s was uploaded to the server %s.', file.name, dataFolder));
	})
	.on('end', () => {
		printMsg(msgType.info, 'The file uploading process is completed.');
	})
	.on('aborted', () => {
		res.status(status.badRequest.code).json({msg: status.badRequest.msg}).end();
		printMsg(msgType.info, 'The file uploading is aborted.');
	})
	.on('error', (err) => {
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		printMsg(msgType.info, err.toString());
	});
});


module.exports = router;


