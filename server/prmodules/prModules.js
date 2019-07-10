const mongodb = require('mongodb');
const os = require('os');
const fs = require('fs');

//Variables
var userInfo = os.userInfo();

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

function createDir (path) {
        fs.mkdirSync(path);
        fs.chownSync(path,userInfo.uid,userInfo.gid);
        fs.chmodSync(path, 0o770);
        console.log(`Dir Created: ${path}`);
}

module.exports = {
	genRegular,
	getRandomNumber,
	loadCollection,
	createDir,
	userInfo
}
