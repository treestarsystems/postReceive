#!/usr/bin/env node

fs=require('fs');
const path = require('path');
const core = require(path.join(__dirname, 'prmodules/prModules.js'));
const simpleParser = require('mailparser').simpleParser;
const axios = require('axios');
const readline = require('readline');

var dirName = path.join(__dirname, '../message_storage');
var prMessage = {};
prMessage.timestamp = Date.now();
prMessage.prId = core.genRegular(20);
prMessage.filename = `message-${prMessage.timestamp}-${prMessage.prId}.eml`;
prMessage.prFullFilePath = `${dirName}\/${prMessage.filename}`;

function readStdIn () {
	const rl = readline.createInterface({
		input: process.stdin,
	//	output: process.stdout
	});

	var writeStream = fs.createWriteStream(prMessage.prFullFilePath);
	rl.on('line', (line) => {
		/*
		This was a bit tough to get right. I wanted something that would trigger when things were done writing 
		ALL LINES to the disk. Found a post that said to use the .end as a callback and that was it.
		POST: https://stackoverflow.com/a/27770204
		*/
		//I need to work on the permissions later.
		writeStream.write(line + '\r\n', {encoding:'utf8', mode: 0o770, flag: 'w'}, () => { writeStream.end(); });
	});
	writeStream.on('finish', () => {
		axios.post('http://localhost:5000/api/message', prMessage)
			.then(function (response) {
	      			console.log(response.data);
	        	})
	        	.catch(function (error) {
	              		console.log(error);
	        	});
	});
}

readStdIn ();
