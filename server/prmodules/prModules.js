const mongodb = require('mongodb');
const os = require('os');
const fs = require('fs');
const path = require('path');

//Variables
var coreVars = {
	"userInfo": os.userInfo(),
	"storeDir": path.join(__dirname, '../../message_storage'),
	"messageStoreDir": path.join(__dirname, '../../message_storage/messages'),
	"attachmentStoreDir": path.join(__dirname, '../../message_storage/attachments')
}

//Functions
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

module.exports = {
	genRegular,
	getRandomNumber,
	loadCollection,
	createDir,
	changePerm,
	coreVars
}
