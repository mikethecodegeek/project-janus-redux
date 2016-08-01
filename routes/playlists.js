'use strict';

var express = require('express');
var router = express.Router();

var Playlist = require('../models/playlist');

router.get('/', function(req, res){
  Playlist.get(function(err, playlists){
    if(err){
      return res.status(400).send(err);
    }
    res.send(playlists);
  });
}); //end get

router.get('/:mood', function(req, res){
  Playlist.get(function(err, playlists){
    if (err){
      return res.status(400).send(err);
    }
    var mood=req.params.mood;
    var playlist = playlists.find(function(playlistObj){
      return playlistObj.mood === mood;
    });
  });
}); //end get to mood

module.exports = router;
