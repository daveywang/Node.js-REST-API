/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */
const path = require('path');

exports.status = {
	ok					: {code: 200, msg: 'OK.'},
	created				: {code: 201, msg: 'The resource was created.'},
	accepted 			: {code: 202, msg: 'The request was accepted.'},
	redirect			: {code: 301, msg: 'Redirect.'},
	badRequest			: {code: 400, msg: 'Bad request.'},
	unauthorized		: {code: 401, msg: 'The authorization failed.'},
	forbidden			: {code: 403, msg: 'Access is denied.'},
	notFound			: {code: 404, msg: 'The resource is not found.'},
	methodNotAllowed	: {code: 405, msg: 'The meodth is not allowed.'},
	notAcceptable		: {code: 406, msg: 'The request is not acceptable.'},
	requestTimeout		: {code: 408, msg: 'The request is timeout.'},
	internalServerError : {code: 500, msg: 'Internal server error.'}
}

exports.msgType = {
	info   : 'INFO',
	error  : 'ERROR',
	warning: 'WARNING'
};

exports.dbSchema = `CREATE TABLE IF NOT EXISTS users (
					id integer NOT NULL PRIMARY KEY,
					user_name text NOT NULL UNIQUE,
					password text NOT NULL,
					email text NOT NULL UNIQUE,
					first_name text,
					last_name text,
					token text);
		 
					CREATE TABLE IF NOT EXISTS books (
					id integer NOT NULL PRIMARY KEY,
					author_id integer NOT NULL,
					title text NOT NULL,
					description text,
					publish_date date,
					FOREIGN KEY (author_id) REFERENCES Users(id));
					`
exports.users_sql = `INSERT INTO users(user_name, password, email, first_name, last_name, token) values 
					('daveywang', 'fe01ce2a7fbac8fafaed7c982a04e229', 'daveywang@live.com', 'Davey', 'Wang', null),
					('liweiwang', 'fe01ce2a7fbac8fafaed7c982a04e229', 'lwwang@live.com', 'Liwei', 'Wang', null)
					`
exports.books_sql = `INSERT INTO books(author_id, title, description, publish_date) values 
					(1, 'Node.js User Guide', 'The book describes how to use Node.js and some tips for new users', '02/01/2018'),
					(1, 'Java User Guide', 'The book describes how to use Java and some tips for new users', '03/01/2018'),
					(1, 'Python User Guide', 'The book describes how to use Python and some tips for new users', '04/01/2018'),
					(1, 'JavaScript User Guide', 'The book describes how to use JavaScript and some tips for new users', '05/01/2018'),
					(2, 'Node.js User Guide', 'The book describes how to use Node.js and some tips for new users', '02/01/2018'),
					(2, 'Java User Guide', 'The book describes how to use Java and some tips for new users', '03/01/2018'),
					(2, 'Python User Guide', 'The book describes how to use Python and some tips for new users', '04/01/2018'),
					(2, 'JavaScript User Guide', 'The book describes how to use JavaScript and some tips for new users', '05/01/2018')
					`					
exports.dataSource = 'sqlite';					
exports.port = 8081;
exports.sessionTimeout = 20 * 60 * 1000; // 20 minutes
exports.dataFolder = path.dirname(require.main.filename) + path.sep + 'user-files';
exports.htmlFolder = path.dirname(require.main.filename) + path.sep + 'web' +  path.sep + 'html';
exports.fileSizeLimitation = 1024 * 1024 * 1024; //1G file is allowded
