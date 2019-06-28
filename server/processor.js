#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
const axios = require('axios');

axios.get('http://localhost:5000/api/message')
  .then(function (response) {
//    console.log(response);
    console.log(response.status);
    console.log(response.statusText);
    console.log('\n' + argv.message);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });


