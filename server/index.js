const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const core = require(path.join(__dirname, 'prmodules/prModules.js'));

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

const message = require('./routes/api/message');
const attachment = require('./routes/api/attachment');

app.use('/api/message', message);
app.use('/api/attachment', attachment);

app.listen(5000, '127.0.0.1', () => console.log(`\nServer started by ${core.coreVars.userInfo.username} on localhost:5000...\nThis process must be ran as the www-data user or else permission errors will impede functionality.\n`));
