'use strict';

app.service('Mood', function() {
    this.setMood = function(mood) {
        this.photoMood = mood;
    };

    this.getMood = function() {
        return this.photoMood;
    };

    this.setOption = function(option) {
        this.musicOption = option;
    };

    this.getOption = function() {
        return this.musicOption;
    };

    this.setUsername = function(username) {
        this.spotifyUsername = username;
    };

    this.getUsername = function() {
        return this.spotifyUsername;
    };
});