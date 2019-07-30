const mongodb = require('mongodb');
const os = require('os');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const emoji = require('node-emoji');

//Variables
var coreVars = {
	"userInfo": getUserInfo(),
	"installedDir": path.join(__dirname, '../..'),
	"storeDir": path.join(__dirname, '../../message_storage'),
	"messageStoreDir": path.join(__dirname, '../../message_storage/messages'),
	"attachmentStoreDir": path.join(__dirname, '../../message_storage/attachments'),
	"dbStoreDir": path.join(__dirname, '../../db_storage'),
	"logStoreDir": path.join(__dirname, '../../log_storage'),
	"processorScript": path.join(__dirname, '../processor.js'),
	"emailViaTelnetScript": path.join(__dirname, '../../test_scripts/email-via-telnet.sh'),
	"dbServer": "localhost",
	"dbName": "postReceive",
	"dbMessageCollection": "messageData",
	"dbAttachmentCollection": "attachmentData",
	"instanceId": path.join(__dirname, '../../log_storage/pid/postReceiveInstance.id')
}

//Functions
//Get numeric id for the www-data user
function getUserInfo() {
	uid = parseInt(childProcess.execSync('id -u www-data').toString().replace(/\n$/, ''));
	gid = parseInt(childProcess.execSync('id -g www-data').toString().replace(/\n$/, ''));
        return {"uid": uid,"gid": gid};
}

//Generate a random alphanumeric string
function genRegular(x) {
        var regularchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";

        for (var i = 0; i < x; i++)
                text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
        return text;
}

//Generate a random number within defined range
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//Connection to MongoDB
async function loadCollection(server,dbName,collectionName) {
  const client = await mongodb.MongoClient.connect(
    'mongodb://' + server,
    {
      useNewUrlParser: true
    }
  );
  return client.db(dbName).collection(collectionName);
}

function changePerm (path) {
        fs.chown(path,coreVars.userInfo.uid,coreVars.userInfo.gid, (err) => {
		if(err) throw err;
	});
        fs.chmod(path, 0o770, (err) => {
		if(err) throw err;
	});
}

function createDir (path) {
        fs.mkdir(path, (err) => {
		if(err) throw err;
	});
	changePerm (path);
        console.log(`Dir Created: ${path}`);
}

//Used to check if the app is started as the correct user (www-data) due to permissions requirements.
function incorrectUser (user,host,port) {
	if (process.env.USER != 'www-data') {
		console.log(`\nCurrent User: ${emoji.emojify(`:x::scream: ${user} :scream::x:`)}`);
		console.log('This process must be ran as the www-data user or else permission errors will impede functionality.\n');
		process.exit(0);
	} else {
		var startMessage = console.log(`\nServer started by ${user} on ${host}:${port} in ${process.env.NODE_ENV} mode`);
		//Sets a new process environment variable that the app will use to run the start script.
		process.env['CORRECT_USER'] = true;
	}
}

module.exports = {
	genRegular,
	getRandomNumber,
	loadCollection,
	createDir,
	changePerm,
	incorrectUser,
	coreVars
}
