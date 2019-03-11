/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const uuid = require('uuid/v4');
const crypto = require('crypto');
const utils = require('../utils/utils.js');
const constants = require('../constants/constants.js');
const oracledb = require('../data-source/oracle-ds.js');
const sqlitedb = require('../data-source/sqlite-ds.js');
const msgType = constants.msgType;
const status = constants.status;
const sessionTimeout = constants.sessionTimeout;
const dataSource = constants.dataSource;

login_status = (req, res, uid) => {
	return new Promise((resolve, reject) => {
		var isLogin = false;
		req.sessionStore.all((err, sessions) => {
			if (err) reject(err);
			else {
				for (var key in sessions) {
					var session = sessions[key];
					if (session.token != null && session.token.uid == uid) {
						isLogin = true;
						let msg = {msg: 'You [ID='+ uid + '] have already logged in!'};
						res.status(status.unauthorized.code).json(msg).end();
						utils.printMsg(msgType.info, JSON.stringify(msg));
						break;
					}
				}
			}	
			
			resolve(isLogin);	
		});
	});
}

getToken_oracle = async (req, res) => {
	var obj = null;
	let isAjaxRequest = (req.headers['x-requested-with'] === 'XMLHttpRequest');
	
	if (Object.keys(req.params).length != 0) obj = 'params';
	else if (Object.keys(req.query).length != 0) obj = 'query';
		
	try {
		if (obj == null) throw new Error('No parameters provided.');
			
		let md5Password = crypto.createHash('md5').update(req[obj].password).digest('hex');
		var query = `select user_id from mdrxa_users where lower(email) = lower('${req[obj].email}') and user_password = '${md5Password}'`;	
		var result = await oracledb.executeQuery(query);

		if (result.rows.length != 0) {
			let userID = result.rows[0][0];
			let uuidAsToken = uuid();
			let isLogin = await login_status(req, res, userID);
			if (isLogin) return;
			
			/* Save the token for the user in the table */
			query = `update mdrxa_users set token = '${uuidAsToken}' where user_id = ${userID}`;
			result = await oracledb.executeQuery(query);
			
			if (result.rowsAffected == 1) {
				let token = {uid: userID, token: uuidAsToken};
				req.session.token = token;
				req.session.cookie.expires = new Date(Date.now() + sessionTimeout);
				req.session.cookie.maxAge = sessionTimeout;

				/* if it is Ajax request, perform redirect at client side, otherwise, performa redirect operation at server side */
				if (isAjaxRequest) res.status(status.ok.code).json({token: token}).end();
				else 			   res.redirect('/homePage');
			}
			else {
				throw new Error('The token couldn\'t be saved.');
			}
		}
		else {
			req.session.token = null;
			let msg = {msg: 'User credentials are not correct, authentication failed!', path: req.url, from: req.connection.remoteAddress};
			utils.printMsg(msgType.error, JSON.stringify(msg));
			
			/* if it is Ajax request, perform redirect at client side, otherwise, performa redirect operation at server side */
			if (isAjaxRequest) res.status(status.unauthorized.code).json(msg).end();
			else 			   res.redirect('/');
		}
	}
	catch (err) {
		req.session.token = null;
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		utils.printMsg(msgType.error, err.toString());
	}
}

getToken_sqlite = async (req, res) => {
	var obj = null;
	let isAjaxRequest = (req.headers['x-requested-with'] === 'XMLHttpRequest');
	
	if (Object.keys(req.params).length != 0) obj = 'params';
	else if (Object.keys(req.query).length != 0) obj = 'query';
		
	try {
		if (obj == null) throw new Error('No parameters provided.');
			
		let md5Password = crypto.createHash('md5').update(req[obj].password).digest('hex');
		var query = `select id from users where lower(email) = lower('${req[obj].email}') and password = '${md5Password}'`;	
		var result = await sqlitedb.executeQuery(query);

		if (result.length != 0) {
			let userID = result[0].id;
			let uuidAsToken = uuid();		
			let isLogin = await login_status(req, res, userID);
			if (isLogin) return;
			
			/* Save the token for the user in the table */
			query = `update users set token = '${uuidAsToken}' where id = ${userID}`;
			result = await sqlitedb.executeQuery(query);
			
			let token = {uid: userID, token: uuidAsToken};
			req.session.token = token;
			req.session.cookie.expires = new Date(Date.now() + sessionTimeout);
			req.session.cookie.maxAge = sessionTimeout;

			/* if it is Ajax request, perform redirect at client side, otherwise, performa redirect operation at server side */
			if (isAjaxRequest) res.status(status.ok.code).json({token: token}).end();
			else 			   res.redirect('/homePage');		
		}
		else {
			req.session.token = null;
			let msg = {msg: 'User credentials are not correct, authentication failed!', path: req.url, from: req.connection.remoteAddress};
			utils.printMsg(msgType.error, JSON.stringify(msg));
			
			/* if it is Ajax request, perform redirect at client side, otherwise, performa redirect operation at server side */
			if (isAjaxRequest) res.status(status.unauthorized.code).json(msg).end();
			else 			   res.redirect('/');
		}
	}
	catch (err) {
		req.session.token = null;
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		utils.printMsg(msgType.error, err.toString());
	}
}

/* Based on the dataSource to export the function */
if (dataSource == 'oracle') exports.getToken = getToken_oracle;
else 						exports.getToken = getToken_sqlite;