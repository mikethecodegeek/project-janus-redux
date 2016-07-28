'use strict';

var app = angular.module('musicApp');

app.controller('musicresultsCtrl', function ($scope, Spotify, Mood) {
    if (Mood.getMood()) {
        var moods = Mood.getMood();
        moods = moods.scores;

        var arr = Object.keys(moods).map(function (key) {
            return moods[key];
        });

        var max = Math.max.apply(null, arr);

        for (var prop in moods) {
            if (moods.hasOwnProperty(prop)) {
                if (moods[prop] === max) {
                    var mood = prop;
                }
            }
        }
    } else {
        var mood = 'neutral';
    }

    $scope.currentMood = mood;

    var option = Mood.getOption();
    var username = Mood.getUsername();

    if (option === 'random') {
        Spotify.search(mood, 'playlist').then(res => {
            var rand = Math.floor(Math.random() * res.playlists.items.length);

            var uri = res.playlists.items[rand].uri;
            var uriArr = uri.split(':');
            var userId = uriArr[2];
            var playlistId = res.playlists.items[rand].id;

            return Spotify.getPlaylistTracks(userId, playlistId);
        }).then(res => {
            $scope.songs = res.items;
        });
    } else if (option === 'personal') {
        Spotify.getUserPlaylists(username).then(res => {
            var playlistId;

            for (var i = 0; i < res.items.length; i++) {
                if (res.items[i].name === mood) {
                    playlistId = res.items[i].id;
                }
            }

            return Spotify.getPlaylistTracks(username, playlistId);
        }).then(res => {
            $scope.songs = res.items;
        });
    }

    $scope.playSong = function (song) {
        var audio = new Audio(song);
        audio.play();
    };
});

app.controller('getphotoCtrl', function ($scope, $state, Mood) {
  $scope.photoTaken = false;
    $(document).ready(function () {
        $('#getMood').on('click', getEmotions);
    });

    $scope.take_snapshot = function () {
        Webcam.snap(function (data_uri) {
            document.getElementById('results').innerHTML = '<img id="base64image" src="' + data_uri + '"/>';
            $scope.SaveSnap();
            $scope.photoTaken = true;
        });
    };

    function ShowCam() {
        Webcam.set({
            width: 320,
            height: 240,
            image_format: 'jpeg',
            jpeg_quality: 100
        });

        Webcam.attach('#my_camera');
    }

    $scope.SaveSnap = function () {
        document.getElementById("loading").innerHTML = "Saving, please wait...";
        var file = document.getElementById("base64image").src;
        var formdata = new FormData();
        formdata.append("base64image", file);
        console.log(formdata);
        var ajax = new XMLHttpRequest();
        ajax.addEventListener("load", function (event) {
            uploadcomplete(event);
        }, false);
        ajax.open("POST", "/facial-recognition/html/upload.php");
        ajax.send(formdata);
    };

    function uploadcomplete(event) {
        document.getElementById("loading").innerHTML = "";
        var image_return = event.target.responseText;
        var showup = document.getElementById("uploaded").src = 'http://bretthartman.net/facial-recognition/html/mypic.png';
    }

    function getEmotions() {
        var apiKey = "1dd1f4e23a5743139399788aa30a7153";
        var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";

        var file = '';

        CallAPI(file, apiUrl, apiKey);
    }

    function CallAPI(file, apiUrl, apiKey) {
        $.ajax({
            url: apiUrl,
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
            },
            type: "POST",
            data: "{\"url\": \"http://bretthartman.net/facial-recognition/html/mypic.png\"}"
        })
            .done(function (response) {
                $('#response').html(response);
                Mood.setMood(response[0]);
                Mood.setOption($scope.option);
                Mood.setUsername($scope.username);
                $state.go('musicresults');
            })
            .fail(function (error) {
                console.log(error.getAllResponseHeaders());
            });
    }
    window.onload = ShowCam();
});

app.controller('homeCtrl', function ($scope, $state) {
    var mymood1=[];

    $scope.getFacialExpressionScore = function () {
        console.log('getFacialExpressionScore');
        var apiKey = "1dd1f4e23a5743139399788aa30a7153";
        var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";
        console.log('image upload click!!!');
        var file = document.getElementById('filename').files[0];
        CallAPI(file, apiUrl, apiKey);
    };

    $scope.urlEmotion = function () {
       console.log('urlEmotion');
       var apiKey = "1dd1f4e23a5743139399788aa30a7153";
       var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";
       var imgUrl = ($('#img-url').val())
       $scope.currentImage=imgUrl;
       console.log($scope.currentImage);
       var callData = JSON.stringify({url: imgUrl});
       console.log(callData)
       //var file = document.getElementById('filename').files[0];
       $.ajax({
               url: apiUrl,
               beforeSend: function (xhrObj) {
                   xhrObj.setRequestHeader("Content-Type", "application/json");
                   xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
               },
               type: "POST",
               data: callData
           })
           .done(function (response) {
              displayMood(response)
           })
           .fail(function (error) {
               console.log(error.getAllResponseHeaders());
           });
           $scope.setScope = function (mymood1){
             $scope.$apply(function(){
               $scope.emotionsArr = mymood1;
             })
           }
   };

    function CallAPI(file, apiUrl, apiKey) {
        $.ajax({
            url: apiUrl,
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
            },
            type: "POST",
            data: file,
            processData: false
        })
            .done(function (response) {
              displayMood(response);
           })

            .fail(function (error) {
                console.log(error.getAllResponseHeaders());
            });
            $scope.setScope = function (mymood1){
              $scope.$apply(function(){
                $scope.emotionsArr = mymood1;
              })
            }
    }


  function displayMood(data){
    $('#response').html(response);
    // console.log(response[0]);
    var response = data;
    var moodData = response[0].scores;
    var moodArray = [];
    var arr = Object.keys(response[0].scores).map(function(key) {
    var thisScore = response[0].scores[key];
    thisScore = 1/Number(thisScore);
    thisScore = thisScore.toString().split('.');
    var len =thisScore[0].length;
    var finalScore = 10-len;
    moodArray.push([finalScore,key]);
    mymood1=moodArray;
    console.log(mymood1);
    $scope.setScope(mymood1);
    return response[key];
  });
  }
});
