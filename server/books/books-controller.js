/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const utils = require('../utils/utils.js');
const constants = require('../constants/constants.js');
const sqlitedb = require('../data-source/sqlite-ds.js');
const msgType = constants.msgType;
const status = constants.status;
const printMsg = utils.printMsg;

exports.books_get_handler = async (req, res) => {
	printMsg(msgType.info, 'Start getting author books... Request query string: ' + JSON.stringify(req.query));

	var authorName = null;
	var bookTitle = null;
	
	try {
		/* ingnore case sensitive for the keys in the query string */
		for (const key in req.query) {
			if (key.toLowerCase() == 'authorName'.toLowerCase()) authorName = req.query[key].toLowerCase();
			else if (key.toLowerCase() == 'bookTitle'.toLowerCase()) bookTitle = req.query[key].toLowerCase();
		}
		
		/* if the no authorName or bookTitle in the query, then return */
		if (Object.keys(req.query).length != 0 && authorName == null && bookTitle == null) {
			res.status(status.notAcceptable.code).json({msg: status.notAcceptable.msg}).end();
			printMsg(msgType.info, 'authorName or bookTitle is not in the query parameters!');
			return;
		}	
		
		/* build query */
		var query = `select u.user_name, u.email, u.first_name, u.last_name, b.title, b.description, b.publish_date from users as u left join books as b on u.id = b.author_id where 1=1 `;
		if (authorName != null && authorName != '') query += `and lower(u.user_name) = '${authorName}' `;
		if (bookTitle != null && bookTitle != '') query += `and lower(b.title) = '${bookTitle}' `;
			
		let result = await sqlitedb.executeQuery(query);
		if(result.length != 0) res.status(status.ok.code).json(result).end();
		else res.status(status.notFound.code).json({msg: status.notFound.msg}).end();
	}
	catch (err) {
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		printMsg(msgType.error, err.toString());
	}
}

exports.books_put_handler = async (req, res) => {
	printMsg(msgType.info, 'Update the book... Request query string: ' + JSON.stringify(req.query));
	
	try {
		//more to do here 
		res.status(status.ok.code).json({msg: status.ok.msg + ' - The book was updated.'}).end();
	}
	catch (err) {
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		printMsg(msgType.error, err.toString());
	}
}

exports.books_post_handler = async (req, res) => {
	printMsg(msgType.info, 'Create the book... Request query string: ' + JSON.stringify(req.query));
	
	try {
		//more to do here 
		res.status(status.ok.code).json({msg: status.ok.msg + ' - The book was created.'}).end();
	}
	catch (err) {
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		printMsg(msgType.error, err.toString());
	}
}

exports.books_delete_handler = async (req, res) => {
	printMsg(msgType.info, 'Delete the book... Request query string: ' + JSON.stringify(req.query));
	
	try {
		//more to do here 
		res.status(status.ok.code).json({msg: status.ok.msg + ' - The book was deleted.'}).end();
	}
	catch (err) {
		res.status(status.internalServerError.code).json({msg: status.internalServerError.msg}).end();
		printMsg(msgType.error, err.toString());
	}
}