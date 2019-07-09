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
			prProcessedrMessage.from = parsed.headers.get('from').value[0];
		}
		if (parsed.headers.has('to')) {
			prProcessedrMessage.to = parsed.headers.get('to').value[0];
		}
		if (parsed.headers.has('cc')) {
			prProcessedrMessage.cc = parsed.headers.get('cc').value[0];
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
			prProcessedrMessage.replyto = parsed.headers.get('reply-to').value[0];
		}
		if (parsed.references) {
			prProcessedrMessage.references = parsed.references;
		}
		prProcessedrMessage.html = parsed.html;
		prProcessedrMessage.text = parsed.text;
		prProcessedrMessage.textashtml = parsed.textAsHtml;
		/* I need the following from the attachments
			filename
			contentType
			contentDisposition
			checksum
			size
			headers
				content-type
				content-transfer-encoding
					encoding types: "BASE64" / "QUOTED-PRINTABLE" / "8BIT" / "7BIT" / "BINARY" / x-token
				content-disposition
				content-id
			content
			contentId
			cid
			related
		*/
		prProcessedrMessage.attachments = parsed.attachments;
//		console.log(prProcessedrMessage);
		console.log(prProcessedrMessage.html);

//USE for later-console.log(prProcessedrMessage.attachments[0].headers.get('content-disposition'));
		fs.unlink(filePath, function (err) {
			if (err) throw err;
			// if no error, file has been deleted successfully
			console.log('\nFile deleted!');
		});
	});
}

module.exports = router;
