'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});