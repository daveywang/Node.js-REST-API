/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const oracledb = require('../data-source/oracle-ds.js');
const sqlitedb = require('../data-source/sqlite-ds.js');
const utils = require('../utils/utils.js');
const constants = require('../constants/constants.js');
const msgType = constants.msgType;
const status = constants.status;
const dataSource = constants.dataSource;

exports.filter = async (req, res, next) => {
	utils.printMsg(msgType.info, 'Request method: ' + JSON.stringify(req.method));
	utils.printMsg(msgType.info, 'Request headers: ' + JSON.stringify(req.headers));
	utils.printMsg(msgType.info, 'SessionID=' + req.sessionID + ', session=' + JSON.stringify(req.session));

	var token = req.session.token;
	let isAjaxRequest = (req.headers['x-requested-with'] === 'XMLHttpRequest');
	
	if (token == null) {
		let msg = {msg: 'No token found, access is denied!', path: req.url, from: req.connection.remoteAddress};
		utils.printMsg(msgType.error, JSON.stringify(msg));
		
		/* if it is Ajax request, perform redirect at client side, otherwise, performa redirect operation at server side */
		if (isAjaxRequest) return res.status(status.forbidden.code).json(msg).end();
		else			   return res.redirect('/');
	}
	
	let verified = await verifyToken(token);		
	if (!verified) {
		let msg = {msg: 'The token is not verified, access is denied!', path: req.url, from: req.connection.remoteAddress};
		utils.printMsg(msgType.error, JSON.stringify(msg));
		
		/* if it is Ajax request, perform redirect at client side, otherwise, performa redirect operation at server side */
		if (isAjaxRequest) return res.status(status.forbidden.code).json(msg).end();
		else 			   return res.redirect('/');
	}

	next(); 
}

/*********************************************************************/
/* Verify the token that client provide in the session */
verifyToken_oracle = async (token) => {
	var verified = false;
	let query = `select user_id from mdrxa_users where user_id = ${token.uid} and token = '${token.token}'`;
		
	try {	
		let result = await oracledb.executeQuery(query);
		if (result.rows.length != 0) verified = true;		
	}
	catch (err) {
		let msg = {error: err.message};
		printMsg(msgType.error, JSON.stringify(msg));
	}
	finally {
		return verified;
	}		
}

/*********************************************************************/
/* Verify the token that client provide in the session */
verifyToken_sqlite = async (token) => {
	var verified = false;
	let query = `select id from users where id = ${token.uid} and token = '${token.token}'`;
		
	try {	
		let result = await sqlitedb.executeQuery(query);
		if (result.length != 0) verified = true;		
	}
	catch (err) {
		let msg = {error: err.message};
		printMsg(msgType.error, JSON.stringify(msg));
	}
	finally {
		return verified;
	}		
}

/* Based on the dataSource to determine which function to be used */
if (dataSource == 'oracle') verifyToken = verifyToken_oracle;
else 						verifyToken = verifyToken_sqlite;