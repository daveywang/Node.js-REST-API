/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const path = require('path');
const express = require('express');
const appFilter = require('../filter/app-filter.js');
const constants = require('../constants/constants.js');
const router = express.Router();
const htmlFolder = constants.htmlFolder;

/*********************************************************************/
/* Application Filter - all requests for this route from client will be handle first by this function */
/* Check client's available token, then decide if the client is allowed to access the resources */
router.use(appFilter.filter);

/*********************************************************************/
/* home.html page */
router.get('/', (req, res) => {
	res.sendFile(htmlFolder + path.sep + "home.html" );
});


module.exports = router;


