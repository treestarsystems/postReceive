#!/usr/bin/env node

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const core = require(path.join(__dirname, 'prmodules/prModules.js'));
const childProcess = require('child_process');
var argv = require('minimist')(process.argv.slice(2));

async function readFile (file) {
	const contents = await fs.readFile(file);
	return contents.toString();
}

async function instanceInfo (id,name,instance,environment) {
	var pm2Info = {};
	pm2Info.id = id;
	pm2Info.name = name;
	pm2Info.pid = await readFile(`${core.coreVars.logStoreDir}/pid/postReceive_id-${id}.pid`);
	//I believe this is the same as the id but I will keep it since it is another env variable.
	pm2Info.instance = instance;
	pm2Info.environment = environment;

	let data = JSON.stringify(pm2Info, null, 2);

	fs.writeFile(`${core.coreVars.logStoreDir}/pid/postReceiveKill.json`, data, (err) => {
		if (err) throw err;
	});
}


if (argv.k) {
	let contents = JSON.parse(fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/postReceiveKill.json`));
	childProcess.execSync(`pm2 stop ${contents.id}`);
}
if (argv.d) {
	let contents = JSON.parse(fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/postReceiveKill.json`));
	childProcess.execSync(`pm2 delete ${contents.id}`);
}
if (argv.r) {
	let contents = JSON.parse(fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/postReceiveKill.json`));
	childProcess.execSync(`pm2 restart ${contents.id}`);
}

module.exports = {
	instanceInfo,
}
