#!/usr/bin/env node

fs=require('fs');
const path = require('path');
const core = require(path.join(__dirname, 'prmodules/prModules.js'));
const simpleParser = require('mailparser').simpleParser;
const axios = require('axios');

var dirName = path.join(__dirname, '../message_storage');
var prMessage = {};
prMessage.timestamp = Date.now();
prMessage.prId = core.genRegular(20);
prMessage.filename = `message-${prMessage.timestamp}-${prMessage.prId}.eml`;
prMessage.prFullFilePath = `${dirName}\/${prMessage.filename}`;

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
//  output: process.stdout
});

function readStdIn () {
	var writeStream = fs.createWriteStream(prMessage.prFullFilePath);
	rl.on('line', (line) => {
		writeStream.write(line + '\r\n', {encoding:'utf8', mode: "770", flag: 'a'}, () => { writeStream.end(); });
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

//console.log(JSON.stringify(prMessage));
/*
    prMessage.to = parsed.headers.get('from').value;
    prMessage.to = parsed.headers.get('to').value;
if (parsed.headers.has('cc')) {
    prMessage.cc = parsed.headers.get('cc').value;
}
    prMessage.messagedate = parsed.headers.get('date');
    prMessage.messageid = parsed.headers.get('messageId');
    prMessage.inreplyto = parsed.headers.get('inReplyTo');
    prMessage.replyto = parsed.headers.get('reply-to').value;
    prMessage.references = parsed.headers.get('references');
    prMessage.html = parsed.headers.html;
    prMessage.text = parsed.headers.text;
    prMessage.textashtml = parsed.headers.get('textAsHtml');
*/

