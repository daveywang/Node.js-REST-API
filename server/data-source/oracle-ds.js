/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

/* packages needed for this program
	1. npm install oracledb
*/

const oracledb = require('oracledb');
const utils = require('../utils/utils.js');
const constants = require('../constants/constants.js');
const msgType = constants.msgType;
oracledb.autoCommit = true;

const dataSource = {
	'TEST': {
		'tns' 	  : '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=db.demo.dwang.com)(PORT=1521))(CONNECT_DATA=(SID=TEST)))',
		'userName': 'dwang',
		'password': 'DRyauAnMm85fdT',
	},
	'PROD': {
		'tns' 	  : '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=db.demo.dwang.com)(PORT=1521))(CONNECT_DATA=(SID=PROD)))', 
		'userName': 'dwang',
		'password': 'DRyauAnMm85fdT'
	}
}
const defaultServer = 'TEST';
const dbconfig = {
	connectString	 : dataSource[defaultServer].tns,
	user			 : dataSource[defaultServer].userName,
	password		 : dataSource[defaultServer].password,
	poolMax       	 : 10,
	poolMin       	 : 5,
	poolIncrement 	 : 1,
	poolPingInterval : 5,
	poolTimeout		 : 5,
	queueTimeout	 : 0
};

/*********************************************************************/
/* Return Promise connection object*/
exports.getConnection = () => {
	return oracledb.getConnection(dbconfig);
}

/*********************************************************************/
/* Execute the query, a callback function for processing the result must be provided */
/* Using Promise to execute code synchronousely */
exports.executeQuery = (query, processResult) => {
	let promise = exports.getConnection();
	promise.then(
		conn => {
			return conn.execute(query);
		}
	).then(
		result => {
			processResult(result);
			return promise;
		}
	).then(
		conn => {
			conn.close();
		}
	).catch(
		(error) => {
			utils.printMsg(msgType.error, error.toString());
		}
	);

}

/*********************************************************************/
/* Execute the query, and return Promise dataset object */
/* Using async and await to execute code synchronousely */
exports.executeQuery = async (query) => {
	try {
		let conn = await exports.getConnection();
		let data = await conn.execute(query);
		await conn.close();
		return data;
	}
	catch (err) {
		throw err;
	}
}

/*********************************************************************/
/* 
const query = `select * from mdrxa_users where hospital_code='DHFL'`
processResult = (result) => {
	for (let i = 0; i < result.rows.length; i++) {
		var rowStr = '';
		for (let j = 0; j < result.metaData.length; j++) {
			rowStr += result.metaData[j].name + '=' + result.rows[i][j] + ', ';
		}
		
		console.log(rowStr.slice(0, -2));
	}
} 

exports.executeQuery(query, processResult);
*/

/* 
const query = `select * from mdrxa_users where hospital_code='DHFL'`
showResult = async () => {
	try {
		data = await exports.executeQuery(query);
		await console.log(data);
	}
	catch (err) {
		console.log("[%s] %s: %s", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), 'ERROR', err.toString());
	}
}

showResult();
*/