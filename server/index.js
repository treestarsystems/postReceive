const express = require('express');
const app = express();

const message = require('./routes/api/message');
const attachment = require('./routes/api/attachment');

app.use('/api/message', message);
app.use('/api/attachment', attachment);

app.listen(5000, '127.0.0.1', () => console.log('Server started on localhost:5000...'));
