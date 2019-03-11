/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

/* packages needed for this program
	1. npm install sqlite3
*/

const sqlite = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const util = require('util');
const utils = require('../utils/utils.js');
const constants = require('../constants/constants.js');
const msgType = constants.msgType;
const databaseFolder = __dirname + path.sep + '..' + path.sep + 'database';
const databaseName = databaseFolder + path.sep + 'rest_demo.db';
const dbSchema = constants.dbSchema;
const users_sql = constants.users_sql;
const books_sql = constants.books_sql;


/*********************************************************************/
/* initilizae the sqlite database if the database doesn't exist and insert data to the tables */
exports.initDatabase = () => {
	if (!fs.existsSync(databaseName)) {
		let db = new sqlite.Database(databaseName, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
			if (err) utils.printMsg(msgType.error, err.toString());
			else utils.printMsg(msgType.info, util.format('Connected to the database %s.', databaseName));
		});
		
		db.serialize(() => {
			db.exec(dbSchema, (err) => {
				if (err) utils.printMsg(msgType.error, err.toString());
				else utils.printMsg(msgType.info, 'The tables were created.');
			});
			
			db.exec(users_sql, (err) => {
				if (err) utils.printMsg(msgType.error, err.toString());
				else utils.printMsg(msgType.info, 'The data were inserted into the users table.');
			});
			
			db.exec(books_sql, (err) => {
				if (err) utils.printMsg(msgType.error, err.toString());
				else utils.printMsg(msgType.info, 'The data were inserted into the books table.');
			});
		});	

		db.close((err) => {
			if (err) utils.printMsg(msgType.error, err.toString());
			else utils.printMsg(msgType.info, 'Closed the database connection.');
		});
	}
}

/*********************************************************************/
/* Execute the query, a callback function for processing the result must be provided */
exports.executeQuery = (query, processResult) => {
	let db = new sqlite.Database(databaseName, sqlite.OPEN_READWRITE, (err) => {
		if (err) {
			utils.printMsg(msgType.error, err.toString());
			return;
		}	
	});
	
	db.all(query, (err, result) => {
		if (err) utils.printMsg(msgType.error, err.toString());
		else {
			processResult(result);
		}	
	});	
	
	db.close((err) => {
		if (err) utils.printMsg(msgType.error, err.toString());
		else utils.printMsg(msgType.info, 'Closed the database connection.');
	});
}

/*********************************************************************/
/* Execute the query, and return Promise dataset object */
/* Using promise instead of using callback function */
exports.executeQuery = async (query) => {
	return new Promise((resolve, reject) => {
		let db = new sqlite.Database(databaseName, sqlite.OPEN_READWRITE, (err) => {
			if (err) utils.printMsg(msgType.error, err.toString());
		});
		
		db.all(query, (err, result) => {
			if (err) reject(err);
			else 	 resolve(result);
		});

		db.close((err) => {
			if (err) utils.printMsg(msgType.error, err.toString());
		});	
	});
}


/*********************************************************************/
/* initialize the demo sqlite database */
exports.initDatabase();


/*********************************************************************/
/*
const query = `select * from users where user_name='dwang'`
processResult = (result) => {
	console.log(result);
} 

exports.executeQuery(query, processResult);
*/

/*
const query = `update users set token='123456789' where user_name='dwang'`
//const query = `select * from users where user_name='dwangww'`
showResult = async (query) => {
	try {
		let data = await exports.executeQuery(query);
		if (data.length != 0) console.log(data);
		else console.log('No data found!');
	}
	catch (err) {
		console.log(err);
	}
}

showResult(query);
*/