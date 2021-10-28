///////////////////////////////////////////////////////
//
// File: util.js
// This function tries to get a Token for a Room
//
// Last Updated: 29-11-2018
// Reformat, Indentation, Inline Comments
//
/////////////////////////////////////////////////////
var counter = 0;
var room,roomData;
var localStream = null;

var random_num = parseInt((""+Math.random()).substring(2,7));

var questions = [
    {"question":"What is your name?"},
    {"question":"What is your age?"},
    {"question":"What is your city?"},
  
    {"question":"What is the number on screen : "+random_num},


];

let questionsLength=questions.length;


window.onload = function () {


    $("#joinRoom").on("click",function(){
        $("#joinRoom").attr("disabled", "disabled");
        $(".preloader").show();
        createRoom(function (result) {
         
        });
    });
    $("#close_sample").on("click",function(){
        
        $("#quest_container").show();
        $("#sample_text_container").hide();
        next_question(counter);
        $("#progress_bar").show();
        $("#temp").show();
        $("#restart").show();
        
        startTimer();
        
    });
    $("#take_snapshot").on("click",function () {
        $("#snapshot_text").html("Saving  Photo...");
        $("#take_snapshot").attr("disabled", "disabled");
        var filename = roomData.conf_num+"_snapshot.png";
        var data = localStream.getVideoFrameURL(["image/png"]);
        creatSnapShot({
            "data":data,
            "filename": filename
        },function(data){

            if(data.success == true)
            {
                $("#snapshot-container").hide();
                $("#snapshot-container-success-text").show().fadeOut(2000);
                setTimeout(function(){
                    $(".question_container").show().fadeIn(2000);
                },2000)


            }
        });
       
    })
    $("#next_question").on("click",function(){
        
        $("#next_question").hide();
        counter++;
        updateBar(counter);
        next_question(counter);
        
        startTimer();
    });
    $(".close_quest").on("click",function(){
        room.disconnect();
       $("#confo_container").hide();

       $(".joinRoom").hide();
       

    //    $('#tick_sign').show();
       $("#thanks_msg").show();
    //    $('#progress-change').show();
    //    document.querySelector('#progress-change').style.width=`${100}%`;
    // document.querySelector('#progress-change').innerHTML=`${100}%`;
    });

}

function updateBar(count){
    document.querySelector('#progress-change').style.width=`${Math.floor((count/questionsLength)*100)}%`;
    document.querySelector('#progress-change').innerHTML=`  ${Math.floor((count/questionsLength)*100)}%`;
}


var options = {
    player: {
        'height': '80%',
        'width': '80%',
        'minHeight': 'inherit',
        'minWidth': 'inherit'
    },
    resizer:false,
    toolbar: {
        displayMode: false,
        branding: {
            display: false
        }
    }
};
let reconnectInfo={'allow_reconnect':false,'number_of_attempts':3,'timeout_interval':15000};
var config = {
    audio: true,
    video: true,
    data: true,
    videoSize: [],
    maxVideoLayers: 1,
    attributes : {
        name:name
    }
};
var createRoom = function (callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response =  JSON.parse(this.responseText);
            if(response.error){
                $.toast({
                    heading: 'Error',
                    text: response.error,
                    showHideTransition: 'fade',
                    icon: 'error',
                    position: 'top-right',
                    showHideTransition: 'slide'
                });
            }
            else {
               var  token_json =  {
                    "name": "Q",
                    "role": "participant",
                    "roomId": response.room.room_id,
                    "user_ref": "Q",
                };
               setTimeout(function () {
                   EnxRtc.Logger.setLogLevel(4);
                    config.audio  = {deviceId : document.querySelector("#audio_device").value}
                    config.video  = {deviceId : document.querySelector("#camera_device").value}

                   createToken(token_json, function (response) {
                       var token = response;
                       // Join Room
                       localStream = EnxRtc.joinRoom(token, config, function (success, error) {
                           if (error && error != null) {

                           }

                           if (success && success != null) {
                               room = success.room;
                                // You need to save room.roomID in the database
                               roomData = success.roomData;
                               // You also need to save roomData.conf_num in the database against room id
                               for (var i = 0; i < success.streams.length; i++) {
                                   room.subscribe(success.streams[i]);
                               }
                               localStream.play("local_video_div",options);
                               $(".joinRoom").hide();
                               $("#joinRoom").removeAttr("disabled")
                               $("#confo_container").show();
                               // next_question(counter);
                               setTimeout(function () {
                                   $('.preloader').fadeOut();
                               }, 500);
                           }
                       },reconnectInfo);
                   })
               },2000);
                callback(true)
            }


        }
    };
    xhttp.open("POST", "/createRoom/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
};

var createToken = function (details, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response =  JSON.parse(this.responseText);
            if(response.error){
                $.toast({
                    heading: 'Error',
                    text: response.error,
                    showHideTransition: 'fade',
                    icon: 'error',
                    position: 'top-right',
                    showHideTransition: 'slide'
                });
            }
            else {
                callback(response.token);
            }
        }
    };
    xhttp.open("POST", "/createToken/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(details));
};

var creatSnapShot = function (details, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           callback({"success":true});
        }
    };
    xhttp.open("POST", "/createSnapShot/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(details));
};



function next_question(counter)
{
    if(counter >= questions.length)
    {
        $("#next_question").hide();
        $("#question").hide();
        $("#close_quest").show();
    }
    else if(counter == questions.length-1){
        $("#question").html(questions[counter].question);
        var jsonData = {
            "type": "public",
            "from": "Remit",
            "message": questions[counter].question,
            "timestamp": moment()._d.getTime()
        }
        localStream.sendData(jsonData);
        $("#next_question").hide();
        setTimeout(function(){
            $("#close_quest").show();
        },6000);

    }
    else
    {
        $("#question").html(questions[counter].question);
        var jsonData = {
            "type": "public",
            "from": "Remit",
            "message": questions[counter].question,
            "timestamp": moment()._d.getTime()
        }
        localStream.sendData(jsonData);
        setTimeout(function(){
            $("#next_question").show();
        },6000);
    }
}

function restartQuestions(){
    counter=0;
    $('#question').html(questions[counter].question);
    document.querySelector('#progress-change').style.width=`${Math.floor((counter/questionsLength)*100)}%`;
    document.querySelector('#progress-change').innerHTML=`${Math.floor((count/questionsLength)*100)}%`;
    $('#next_question').hide();
    setTimeout(function(){
        $('#next_question').show();
        startTimer();
    },6000);
    document.querySelector('#close').style.display='show';
    setTimeout(function(){
        document.querySelector('#next_question').show();
    },6000);
    
}






let toggle=0;

function restart1Questions(){
    if(counter!==questionsLength-1){
        $('#next_question').hide();
    setTimeout(function(){
        $("#next_question").show();
    },2000);
    }
    if(counter===questionsLength-1){
        $('#close').hide();
        setTimeout(function(){

            $('#next_question').show();
        },1000);   
       
    }
    document.querySelector('#close').style.opacity='0';
    setTimeout(function(){
        document.querySelector('#close').style.opacity='1';
    },questionsLength*6000);
    
    
    counter=0;
    $('#question').html(questions[counter].question);
    document.querySelector('#progress-change').style.width=`${Math.floor((counter/questionsLength)*100)}%`;
    document.querySelector('#progress-change').innerHTML=`${Math.floor((count/questionsLength)*100)}%`;
    
    // while(counter<questionsLength-1){
    //     if(document.querySelector('#next_question').clicked===true){
    //         counter++;
    //         $('#question').html(questions[counter].question);
    //         document.querySelector('#progress-change').style.width=`${Math.floor((counter/questionsLength)*100)}%`;
    //         document.querySelector('#progress-change').innerHTML=`  ${Math.floor((counter/questionsLength)*100)}%`;
    //     }
    // }
    // $('#question').html(questions[counter].question);
    // $('#close').show();
    
}
function startTimer(){
    
    var counter = 5;

    var interval = setInterval(function() {       
        // Display 'counter' wherever you want to display it.
        $('#timer').show();
        if (counter === -1) {               
                 clearInterval(interval); 
                 $('#timer').text('00:00');
                 $('#timer').hide();   
                              
            return;
        }else{
            $('#timer').text('00:0'+counter);         
        }
        counter--;
    }, 1000);
    
}

EnxRtc.getDevices(function (arg) {
    let camlist = '';
    let miclist = '';
    // var camera_desc = document.querySelector('.camera-desc .head');
    // var microphone_desc = document.querySelector('.microphone-desc .head');

    if (arg.result === 0) {
        arg.devices.cam.forEach(element => {
            var camId = element.deviceId.toString();
            camlist+=`<option value="${element.deviceId}">${element.label}</option>`;
            //camlist += `<input type="radio" id="${element.deviceId}" name="camera" value="${element.label}" onclick="switchcam(this)"> <label for="${element.deviceId}">${element.label}</label><br>`
        });

        arg.devices.mic.forEach(element => {
            var micId = element.deviceId.toString();
            miclist+=`<option value="${element.deviceId}" >${element.label}</option>`
           // miclist += `<input type="radio" id="${element.deviceId}" name="mic" value="${element.label}" onclick="switchmic(this)"> <label for="${element.deviceId}">${element.label}</label><br>`
        });
        document.querySelector('#audio_device').innerHTML=miclist;
        document.querySelector('#camera_device').innerHTML=camlist;
        // camera_desc.innerHTML = camlist;
        // microphone_desc.innerHTML = miclist;
    } else if (arg.result === 1145) {
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.error("Your media devices might be in use with some other application.");
        // $(".error_div").html(
        //     "Your media devices might be in use with some other application."
        // );
        // $(".error_div").show();
        return false;
    } else {
        $(".error_div").show();

        return false;
    }
});


function switchcam(_this){
    localStream.switchCamera(localStream, _this.id, function (Stream) {
        if (Stream && Stream.getID) {
            localStream = Stream; // LocalStream updated   
        }
        else if (Stream.message === 'success') {

        }
        else {
            // Failed to switch
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error("Couldn't get a stream");
        }
    });
}

function switchmicro(_this){
    localStream.switchMicrophone(localStream, _this.id, function (Stream) {
        if (Stream && Stream.getID) {
            localStream = Stream; // LocalStream updated   
        }
        else if (Stream.message === 'success') {

        }
        else {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error("Couldn't get a stream");
        }
    });
}


