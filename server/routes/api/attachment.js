const express = require('express');
const router = express.Router();
const loadCollection = require('../../prmodules/prModules').loadCollection;
const fs = require('fs');

// Get Message Data
router.get('/', async (req, res) => {
  res.status(201).send();
});

//Add Single Message
router.post('/', async (req, res) => {
  res.status(201).send();
});

module.exports = router;
