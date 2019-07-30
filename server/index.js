const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const core = require(path.join(__dirname, 'prmodules/prModules.js'));
const  daemon = require(path.join(__dirname, 'daemon.js'));
const emoji = require('node-emoji');

//Ensure the correct permissions are applied to the scripts
core.changePerm(core.coreVars.installedDir);
core.changePerm(core.coreVars.processorScript);
core.changePerm(core.coreVars.emailViaTelnetScript);

//Create Storage Directories if they do not exist. These should be mounted to a large storage pool for all the attachments.
if (!fs.existsSync(core.coreVars.storeDir)){
	core.createDir (core.coreVars.storeDir);
}
if  (!fs.existsSync(core.coreVars.messageStoreDir)){
	core.createDir (core.coreVars.messageStoreDir);
}
if  (!fs.existsSync(core.coreVars.attachmentStoreDir)){
	core.createDir (core.coreVars.attachmentStoreDir);
}
if  (!fs.existsSync(core.coreVars.dbStoreDir)){
	core.createDir (core.coreVars.dbStoreDir);
}

const message = require('./routes/api/message');
const attachment = require('./routes/api/attachment');

app.use('/api/message', message);
app.use('/api/attachment', attachment);

//Check if app is run in dev or prod mode.
core.incorrectUser(process.env.USER,process.env.HOST,process.env.PORT);

if (process.env.CORRECT_USER) {
	app.listen(process.env.PORT, process.env.HOST, () => {
		console.log(`${emoji.emojify(':heavy_check_mark:.....:100:')}`);
		//Write daemon data as a json object to a file so it can be called later.
		daemon.instanceInfo(process.env.pm_id,process.env.name,process.env.NODE_APP_INSTANCE,process.env.NODE_ENV);
	});
}
