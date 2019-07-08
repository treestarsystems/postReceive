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
	rl.on('line', (line) => {
		writeFile (line + '\r\n');
	});
}

/*
function readStdIn () {
	fs.readFile('/dev/stdin', 'utf8', (err, data) => {
		if (err) throw err;
		writeFile (data);
	});
}
*/

function writeFile (input) {
	fs.writeFileSync(prMessage.prFullFilePath, input, {encoding:'utf8', mode: "770", flag: 'a'}, (err) => {
		if (err) throw err;
		fs.readFileSync(prMessage.prFullFilePath, 'utf8', (err, data) => {
			if (err) throw err;
		});
	});
}

async function submitMessage () {
	await readStdIn ();
	axios.post('http://localhost:5000/api/message', prMessage)
		.then(function (response) {
	      		console.log(response.data);
	        })
	        .catch(function (error) {
	              console.log(error);
	        });
}

submitMessage();

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

