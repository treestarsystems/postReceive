const express = require('express');
const router = express.Router();
const core = require('../../prmodules/prModules');
const simpleParser = require('mailparser').simpleParser;
const bodyParser = require('body-parser');
const fs = require('fs');

// Get Message Data
router.get('/', async (req, res) => {
  console.log(req);
//  let parsed = await simpleParser(req);
  res.status(200).send('DONE');
});

//Add Single Message
router.use(bodyParser.json());
router.post('/', async (req, res) => {
	processMessage (req.body);
	res.status(200).send('DONE');
});


//Write attachment data to file.
function extractAttachment (content,path) {
	var writeStream = fs.createWriteStream(path);
	writeStream.write(content, {flag: 'w'}, (err) => {
		if(err) throw err;
		//My theory is that this works here becomes the file is not recieved in chunks
		//like it is when sent over the network.
		writeStream.end();
	});
	writeStream.on('finish', () => {
		core.changePerm(path);
	});
}

function processMessage (prObject) {
	prProcessedMessage = {};
	fs.readFile(prObject.prFullFilePath, async (err, data) => {
		if (err) throw err;
		let parsed = await simpleParser(data);
//		prProcessedMessage.fullMessage = data.toString();
		if (parsed.headers.has('subject')) {
			prProcessedMessage.subject = parsed.headers.get('subject');
		}
		if (parsed.headers.has('from')) {
			prProcessedMessage.from = parsed.headers.get('from').value;
		}
		if (parsed.headers.has('to')) {
			prProcessedMessage.to = parsed.headers.get('to').value;
		}
		if (parsed.headers.has('cc')) {
			prProcessedMessage.cc = parsed.headers.get('cc').value;
		}
		if (parsed.date) {
			//[DATE-ISO,DATE-HUMAN,DATE-EPOCH/MILLISECOND]
			prProcessedMessage.timestamps = [parsed.date,Date(parsed.date),new Date(parsed.date).getTime()];
		}
		if (parsed.messageId) {
			prProcessedMessage.messageid = parsed.messageId;
		}
		if (parsed.headers.has('inReplyTo')) {
			prProcessedMessage.inreplyto = parsed.inReplyTo;
		}
		if (parsed.headers.has('reply-to')) {
			prProcessedMessage.replyto = parsed.headers.get('reply-to').value;
		}
		if (parsed.references) {
			prProcessedMessage.references = parsed.references;
		}
		prProcessedMessage.html = parsed.html;
		prProcessedMessage.text = parsed.text;
		prProcessedMessage.textashtml = parsed.textAsHtml;
		prAttachmentCount = 0;
		prProcessedMessage.attachments = {};
		parsed.attachments.forEach(function(attachment) {
			attachmentName = (attachment.filename).replace(/ /g,"_").toLowerCase();
			attachmentPath = `${core.coreVars.attachmentStoreDir}\/message-${prObject.timestamp}-${prObject.prId}-${attachmentName}`
			prProcessedMessage.attachments["attachment-"+prAttachmentCount] = {
				"processingStatusCode":0,
				"filename":attachmentName,
				"contentType":attachment.contentType,
				"contentDisposition":attachment.contentDisposition,
				"checksum":attachment.checksum,
				"size":attachment.size,
				"encoding":attachment.headers.get('content-transfer-encoding'),
				"content":attachmentPath,
				"contentId":attachment.contentId,
				"cid":attachment.cid,
				"related":attachment.related
			}
			extractAttachment (attachment.content,attachmentPath);
			prAttachmentCount++;
		});
		const prSubmissionMessage = await core.loadCollection(core.coreVars.dbServer,core.coreVars.dbName,core.coreVars.dbMessageCollection)
		await prSubmissionMessage.insertOne(
			prProcessedMessage
		);
//		console.log(prProcessedMessage);
		fs.unlink(prObject.prFullFilePath, function (err) {
			if (err) throw err;
			// if no error, file has been deleted successfully
			console.log('\nFile deleted!');
		});
	});
}

module.exports = router;
