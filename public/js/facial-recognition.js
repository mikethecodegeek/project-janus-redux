

$(document).ready(init);

function init() {
  console.log('hello')
var apiKey = "1dd1f4e23a5743139399788aa30a7153";

       var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";

       $('#imageUploadButton').on('click',function () {
         console.log('image upload click!!!');
             var file = document.getElementById('filename').files[0];
           //console.log(file)
           //var file = 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Barack_Obama.jpg (147KB)
           //localStorage.setItem('image',file)
           CallAPI(file,apiUrl,apiKey)
       });

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
                   $('#response').html(response);
                   console.log(response[0])
               })
               .fail(function (error) {
                   console.log(error.getAllResponseHeaders());
               });
       }
     }
