'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var cors = require('cors')

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cors());

app.use('/playlists', require('./routes/playlists'));


app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});
