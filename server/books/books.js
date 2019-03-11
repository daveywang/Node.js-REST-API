/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

const express = require('express');
const appFilter = require('../filter/app-filter.js');
const booksController = require('./books-controller.js');
const router = express.Router();

/*********************************************************************/
/* Application Filter - all requests for this route from client will be handle first by this function */
/* Check client's available token, then decide if the client is allowed to access the resources */
router.use(appFilter.filter);

/*********************************************************************/
/* GET operation for the resource /books */
/* Uses async and await to synchronize the executions */
/* Support and Handle query string parameters */
/*
   Usage: 
    http://localhost:8081/books
	http://localhost:8081/books?bookTitle=Node.js User Guide
	http://localhost:8081/books?userName=dwang
	http://localhost:8081/books?userName=dwang&bookTitle=Node.js User Guide
*/
router.get('/', booksController.books_get_handler);

/*********************************************************************/
/* PUT operation for the resource /books */
router.put('/', booksController.books_put_handler);

/*********************************************************************/
/* POST operation for the resource /books */
router.post('/', booksController.books_post_handler);

/*********************************************************************/
/* DELETE operation for the resource /books */
router.delete('/', booksController.books_delete_handler);


module.exports = router;


