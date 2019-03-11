/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */

/*********************************************************************/
/* Format the output message in the console */
exports.printMsg = (msgType, msg) => {
	console.log("[%s] %s: %s", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), msgType, msg);
}