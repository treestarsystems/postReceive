const express = require('express');
const router = express.Router();
const loadCollection = require('../../prmodules/prModules').loadCollection;
const simpleParser = require('mailparser').simpleParser;
const bodyParser = require('body-parser');
const fs = require('fs');

// Get Message Data
router.get('/', async (req, res) => {
  console.log(req);
//  let parsed = await simpleParser(req);
//  res.status(200).send('DONE');
});

//Add Single Message
router.use(bodyParser.json());
router.post('/', async (req, res) => {
	processMessage (req.body.prFullFilePath);
	res.status(200).send('DONE');
});

function processMessage (filePath) {
	prProcessedrMessage = {};
	fs.readFile(filePath, async (err, data) => {
		if (err) throw err;
		let parsed = await simpleParser(data);
		prProcessedrMessage.fullMessage = data.toString();
		if (parsed.headers.has('subject')) {
			prProcessedrMessage.subject = parsed.headers.get('subject');
		}
		if (parsed.headers.has('from')) {
			prProcessedrMessage.from = parsed.headers.get('from').value;
		}
		if (parsed.headers.has('to')) {
			prProcessedrMessage.to = parsed.headers.get('to').value;
		}
		if (parsed.headers.has('cc')) {
			prProcessedrMessage.cc = parsed.headers.get('cc').value;
		}
		if (parsed.date) {
			//[DATE-ISO,DATE-HUMAN,DATE-EPOCH/MILLISECOND]
			prProcessedrMessage.timestamps = [parsed.date,Date(parsed.date),new Date(parsed.date).getTime()];
		}
		if (parsed.messageId) {
			prProcessedrMessage.messageid = parsed.messageId;
		}
		if (parsed.headers.has('inReplyTo')) {
			prProcessedrMessage.inreplyto = parsed.inReplyTo;
		}
		if (parsed.headers.has('reply-to')) {
			prProcessedrMessage.replyto = parsed.headers.get('reply-to').value;
		}
		if (parsed.references) {
			prProcessedrMessage.references = parsed.references;
		}
		prProcessedrMessage.html = parsed.html;
		prProcessedrMessage.text = parsed.text;
		prProcessedrMessage.textashtml = parsed.textAsHtml;
		prAttachmentCount = 0;
		prProcessedrMessage.attachments = {};
		parsed.attachments.forEach(function(attachment) {
			prProcessedrMessage.attachments["attachment"+prAttachmentCount] = {
				"filename":attachment.filename,
				"contentType":attachment.contentType,
				"contentDisposition":attachment.contentDisposition,
				"checksum":attachment.checksum,
				"size":attachment.size,
				"encoding":attachment.headers.get('content-transfer-encoding'),
				"content":attachment.content,
				"contentId":attachment.contentId,
				"cid":attachment.cid,
				"related":attachment.related
			}
			prAttachmentCount++;
		});
//		prProcessedrMessage.attachments = parsed.attachments;
		console.log(prProcessedrMessage);
		fs.unlink(filePath, function (err) {
			if (err) throw err;
			// if no error, file has been deleted successfully
			console.log('\nFile deleted!');
		});
	});
}

module.exports = router;
