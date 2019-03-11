/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const express = require('express');
const downloadController = require('./download-controller.js');
const appFilter = require('../filter/app-filter.js');
const router = express.Router();

/*********************************************************************/
/* Application Filter - all requests for this route from client will be handle first by this function */
/* Check client's available token, then decide if the client is allowed to access the resources */
router.use(appFilter.filter);

/*********************************************************************/
/* GET operation for the resource /download/fileName to download a file */
router.get('/getFileList', downloadController.getFileList);
router.get('/checkFile', downloadController.checkFile);
router.get('/checkFile/:fileName', downloadController.checkFile);
router.get('/:fileName', downloadController.download);
router.get('/', downloadController.download);

module.exports = router;


