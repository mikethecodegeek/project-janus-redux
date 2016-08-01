'use strict';

var fs=require('fs');
var path = require('path');
var filePath = path.join(__dirname, '../data/playlists.json');

var Playlist = {};

Playlist.get = function(cb){
  fs.readFile(filePath, function(err, data){
    if (err){
      return cb(err);
    }
    var playlists = JSON.parse(data);
    cb(null, playlists);
  });
};


module.exports = Playlist;
