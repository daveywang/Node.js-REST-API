/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const express = require('express');
const tokenController = require('./token-controller.js');
const router = express.Router();

/*********************************************************************/
/* GET operation for the resource /token/email/password */
/* Only Support path parameters */
router.get('/:email/:password', tokenController.getToken);
router.get('/', tokenController.getToken);

module.exports = router;