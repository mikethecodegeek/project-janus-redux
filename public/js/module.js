'use strict';

var app = angular.module('musicApp', ['ui.router', 'spotify']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/html/home.html',
        controller: 'homeCtrl'
    }).state('musicresults', {
        url: '/musicresults',
        templateUrl: '/html/musicresults.html',
        controller: 'musicresultsCtrl'
    }).state('getphoto', {
        url: '/getphoto',
        templateUrl: '/html/getphoto.html',
        controller: 'getphotoCtrl'
    });

    $urlRouterProvider.otherwise('/');
});

app.config(function(SpotifyProvider) {
    SpotifyProvider.setClientId('b52dc91988324fd697d1f2db77378d46');

    $.ajax({
        url: 'https://spotify-token.herokuapp.com',
        method: 'GET',
        success: function(data) {
            SpotifyProvider.setAuthToken(data);
        },
        error: function(err) {
            console.error(err);
        }
    });
});
