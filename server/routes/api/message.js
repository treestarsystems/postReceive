const express = require('express');
const router = express.Router();
const loadCollection = require('../../prmodules/prModules').loadCollection;
const simpleParser = require('mailparser').simpleParser;
const bodyParser = require('body-parser');

let now = new Date();

// Get Message Data
router.get('/', async (req, res) => {
  console.log(`success ${now}`);
  console.log(req);
//  let parsed = await simpleParser(req);
//  res.status(200).send('DONE');
});

router.use(bodyParser.json());
//Add Single Message
router.post('/', async (req, res) => {
  console.log(`success ${now}`);
  console.log(req.body);
  res.status(200).send('DONE');
});

module.exports = router;
