const express = require('express');
const router = express.Router();
const loadCollection = require('../../prmodules/prModules').loadCollection;
const simpleParser = require('mailparser').simpleParser;

// Get Message Data
router.get('/', async (req, res) => {
  console.log("success");
  res.status(200).send();
});

//Add Single Message
router.post('/', async (req, res) => {
  simpleParser(source, options, (err, parsed) => {});
  res.status(201).send();
});

module.exports = router;
