/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const path = require('path');
const mime = require('mime-types');
const fs = require('fs');
const util = require('util');
const constants = require('../constants/constants.js');
const utils = require('../utils/utils.js');
const status = constants.status;
const msgType = constants.msgType;
const dataFolder = constants.dataFolder;
const printMsg = utils.printMsg;

/*********************************************************************/
exports.download = (req, res) => {
	var obj = null;
	try {
		if (Object.keys(req.params).length != 0) obj = 'params';
		else if (Object.keys(req.query).length != 0) obj = 'query';
		
		printMsg(msgType.info, 'Start downloading the file... Request query string: ' + JSON.stringify(req[obj]));

		/* remove 'string:' in the varaiable fileName which was added by Angular */
		let fileName = req[obj].fileName.substring(7);
		let file = dataFolder + path.sep + fileName;
			
		if (fileName != null && fileName.trim() != '' && fs.existsSync(file)) { 
			let mimeType = mime.lookup(file);
			
			res.set('Content-disposition', 'attachment; filename=' + fileName);
			res.set('Content-type', mimeType);

			let filestream = fs.createReadStream(file);
			filestream.pipe(res)
			.on('error', (err) => {
				//res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
				printMsg(msgType.info, err.toString());
			})
			.on('finish', () => {
				printMsg(msgType.info, util.format('The file %s is downloaded successfully.', file));
			});
		}
		else {
			res.status(status.notFound.code).json({msg: status.notFound.msg}).end();
			printMsg(msgType.info, util.format('The file %s is not found.', file));
		}
	}
	catch (err) {
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		printMsg(msgType.error, err.toString());
	}
}

exports.checkFile = (req, res) => {
	var obj = null;
	try {
		if (Object.keys(req.params).length != 0) obj = 'params';
		else if (Object.keys(req.query).length != 0) obj = 'query';
		
		printMsg(msgType.info, 'Checking the file... Request query string: ' + JSON.stringify(req[obj]));

		/* remove 'string:' in the varaiable fileName which was added by Angular */
		var fileName = req[obj].fileName.substring(7);
		let file = dataFolder + path.sep + fileName;
			
		if (fileName != null && fileName.trim() != '' && fs.existsSync(file)) { 
			res.status(status.ok.code).json({msg: status.ok.msg}).end();
			printMsg(msgType.info, util.format('The file %s exists.', file));
		}
		else {
			let msg = util.format('The file %s is not found.', file);
			res.status(status.notFound.code).json({msg: msg}).end();
			printMsg(msgType.info, msg);
		}
	}
	catch (err) {
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		printMsg(msgType.error, err.toString());
	}	
}

exports.getFileList = (req, res) => {	
	printMsg(msgType.info, 'Getting the file list...');

	fs.readdir(dataFolder, (err, items) => {
		if (err) {
			res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
			printMsg(msgType.error, err.toString());
		}
		else {
			res.status(status.ok.code).json(items).end();
			printMsg(msgType.info, 'The file list has been sent out.');
		}
	});
}