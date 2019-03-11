/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */
 
/* packages needed for this application
	1.  npm install express
	2.  npm install express-session
	3.  npm install uuid
	4.  npm install crypto-js
	5.  npm install util
	7.  npm install mime-types
	8.  npm install oracledb
	9.  npm install formidable 
	10. npm install jsonwebtoken 
	11. npm install bcryptjs 
	12. npm install sqlite3
	13. npm install ws
*/
const constants = require('./server/constants/constants.js');
const utils = require('./server/utils/utils.js');
const books = require('./server/books/books.js');
const token = require('./server/register/token.js');
const upload = require('./server/upload/upload.js');
const download = require('./server/download/download.js');
const homePage = require('./server/home/home-page.js');
const express = require('express');
const session = require('express-session');
const webSocketServer = require('ws').Server;
const util = require('util');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();
const port = constants.port;
const msgType = constants.msgType;
const htmlFolder = constants.htmlFolder;

requestHandler = (req, res) => {
	req.session.token = null;
	res.sendFile(htmlFolder + path.sep + "login.html" );
}

app.use(session({
	genid: (req) => {
		return uuid();
	},
	secret: '281ee130-3f7f-416f-929f-21550d12f31f',
	resave: false,
	saveUninitialized: true,
}));

app.use(express.static(__dirname + '/web'));

/* mount path */
app.use('/books', books);
app.use('/token', token);
app.use('/upload', upload);
app.use('/download', download);
app.use('/homePage', homePage);

app.get('/', requestHandler);
app.get('/logout', requestHandler);

/*********************************************************************/
utils.printMsg(msgType.info, 'The server is starting...');

/* Start the restful API server */
const server = app.listen(port, () => {
   let host = server.address().address;
   let port = server.address().port;
   utils.printMsg(msgType.info, util.format('Application server is listening at http://%s:%s', host, port));
});

/* web socket path is http://domain-name:8081/webSocket */
const wsServer = new webSocketServer({server: server, path: '/webSocket'});

wsServer.on('connection', (ws) => {
	utils.printMsg(msgType.info, 'Connected: ' + JSON.stringify(ws));
	
	ws.on('message', (message) => {
		utils.printMsg(msgType.info, 'Message: ' + JSON.stringify(message));
		
		/* broadcast message */
		wsServer.clients.forEach((client) => {
			client.send(message);
		});
	});	
	
	ws.on('error', (err) => {
		utils.printMsg(msgType.info, JSON.stringify(err));
	});	

	ws.on('close', (msg) => {
		utils.printMsg(msgType.info, JSON.stringify(msg));
	});	
});
