#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const core = require(path.join(__dirname, 'prmodules/prModules.js'));
const simpleParser = require('mailparser').simpleParser;
const axios = require('axios');
const readline = require('readline');

//axios connection variables
var prProtocol = 'http';
var prServer = 'localhost';
var prServerPort = 5000;
var prEndpoint = 'api/message';

var prMessage = {};
prMessage.timestamp = Date.now();
prMessage.prId = core.genRegular(20);
prMessage.filename = `message-${prMessage.timestamp}-${prMessage.prId}.eml`;
prMessage.prFullFilePath = `${core.coreVars.messageStoreDir}\/${prMessage.filename}`;

function readStdIn () {
	const rl = readline.createInterface({
		input: process.stdin,
		//This will output whatever hits the script to stdout. For testing/debug purposes only
	//	output: process.stdout
	});

	//Using a write stream because it handles resources better when dealing with large data sets/emails.
	var writeStream = fs.createWriteStream(prMessage.prFullFilePath);
	rl.on('line', (line) => {
		/*
		This was a bit tough to get right. I wanted something that would trigger when things were done writing 
		ALL LINES to the disk. Found a post that said to use the .end as a callback and that was it.
		POST: https://stackoverflow.com/a/27770204
		*/
		writeStream.write(line + '\r\n', {encoding:'utf8', mode: 0o770, flag: 'w'}, () => { writeStream.end(); });
	});
	//When finished writing to file ship the data over to API endpoint via axios
	writeStream.on('finish', () => {
		axios.post(`${prProtocol}://${prServer}:${prServerPort}/${prEndpoint}`, prMessage)
			.then(function (response) {
	      			console.log(response.data);
	        	})
	        	.catch(function (error) {
	              		console.log(error);
	        	});
	});
}

//Execute code
readStdIn ();
