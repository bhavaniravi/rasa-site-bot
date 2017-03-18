USER_ID = document.getElementById('uid').value;
KEYGEN = document.getElementById('keygen').value;

QUESTION_ID = 0;
SELECTED_PROBLEMS = [];
PLEASE_WAIT_MESSAGE = "Checking your code ...";


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});





(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };

        
        sendUserMessage = function (text, uid){
            $('.message_input').val('');
            $messages = $('.messages');         
            message = new Message({
                text: text,
                message_side: 'right'
            });
            message.draw();
            $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
            if (text.toLowerCase() == "skip"){
                input_data = {"message":text,
                              "uid":USER_ID,
                              "question_code":QUESTION_ID,
                              "selected_problems":SELECTED_PROBLEMS,
                              "KEYGEN":KEYGEN};
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    data: input_data,
                    url: "/api/user_message?format=json",
                    success: function(result){
                        if (result['type'] == "completed_test"){
                            var messages = result["bot_message"].split("\n");
                            for (var i=0;i<messages.length;i++){
                                if (messages[i].replace(" ","" != "")){
                                    message = new Message({
                                        text: messages[i],
                                        message_side: 'left'
                                    });
                                    message.draw();
                                    $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                                }
                            }
                        }
                        
                        else{
                            //QUESTION_ID = result[1];
                            QUESTION_ID = result['question_code'];
                            var messages = (result["bot_message"] + "<br>"+ result["programming_question"]).split("\n");
                            var programming_question = result["programming_question"];
                            var sample_code = result["sample_code"];
                            change_sample_code(sample_code);
                            var output_text = document.getElementById("output_text");
                            //output_text.innerHTML = result['output'];
                            //change_question(programming_question,sample_code);
                            for (var i=0;i<messages.length;i++){
                                if (messages[i].replace(" ","" != "")){
                                    message = new Message({
                                        text: messages[i],
                                        message_side: 'left'
                                    });
                                    message.draw();
                                    $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                                }
                            }
                        }
                    }
                });
            }
            
            else{
                input_data = {"message":text,
                              "uid":USER_ID,
                              "question_id":QUESTION_ID,};
                
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    data: input_data,
                    url: "/api/user_message?format=json",
                    success: function(result){
                        if (result.type == "bot_message"){
                            //QUESTION_ID = result[1];
                            var messages = result.text.split("\n");
                            
                            for (var i=0;i<messages.length;i++){
                                if (messages[i].replace(" ","" != "")){
                                    message = new Message({
                                        text: messages[i],
                                        message_side: 'left'
                                    });
                                    message.draw();
                                    $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                                }
                            }
                        }
                        
                        else if (result.type == "programming_question"){
                            QUESTION_ID = result.question_code;
                            var messages = (result.bot_message + result.programming_question).split("\n");
                            //var programming_question = result.programming_question;
                            SELECTED_PROBLEMS = result.selected_problems;
                            var sample_code = result.sample_code;
                            change_sample_code(sample_code);
                            //change_question(programming_question,sample_code);
                            
                            
                            for (var i=0;i<messages.length;i++){
                                if (messages[i].replace(" ","" != "")){
                                    message = new Message({
                                        text: messages[i],
                                        message_side: 'left'
                                    });
                                    message.draw();
                                    $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                                }
                            }
                        }
                    }
                });
            }
            return
        }
        
        
        $('.send_message').click(function (e) {
            return sendUserMessage(getMessageText());
        });
        
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendUserMessage(getMessageText());
            }
        });
//        sendMessage('Hello Philip! :)');
//        setTimeout(function () {
//            return sendMessage('Hi Sandy! How are you?');
//        }, 1000);
//        return setTimeout(function () {
//            return sendMessage('I\'m fine, thank you!');
//        }, 2000);
    });
}.call(this));



function change_sample_code(sample_code){
    var editor = ace.edit("editor");
    editor.setValue(sample_code);
}

// change the text in the question box
//function change_question(question, sample_code){
//    var editor = ace.edit("editor");
//    var question_box = document.getElementById("question_box");
//    question_box.innerHTML = question;
//    editor.setValue(sample_code);
//}



var Message;
Message = function (arg) {
    this.text = arg.text, this.message_side = arg.message_side;
    this.draw = function (_this) {
        return function () {
            var $message;
            $message = $($('.message_template').clone().html());
            $message.addClass(_this.message_side).find('.text').html(_this.text);
            $('.messages').append($message);
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
};






function submit_code(){
    message = new Message({
        text: "Checking your code ...",
        message_side: 'left'
    });
    message.draw();
    $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    var editor = ace.edit("editor");
    var source_code = editor.getValue();
    var language = 'python';

    input_data = {"source_code":source_code,
                  "uid":USER_ID,
                  "question_code":QUESTION_ID,
                  "selected_problems[]":SELECTED_PROBLEMS,
                  "KEYGEN":KEYGEN};
    
    var output_text = document.getElementById("output_text");
    output_text.innerHTML = "";

    $.ajax({
        type: "POST",
        dataType: 'json',
        data: input_data,
        url: "/api/code_submission",
        success: function(result){

            if (result['type'] == "successfully_executed"){
                QUESTION_ID = result['question_code'];
                var messages = (result["bot_message"] + "<br>" + result["programming_question"]).split("\n");
                var sample_code = result["sample_code"];
                change_sample_code(sample_code);
                for (var i=0;i<messages.length;i++){
                    if (messages[i].replace(" ","" != "")){
                        message = new Message({
                            text: messages[i],
                            message_side: 'left'
                        });
                        message.draw();
                        $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                    }
                }
            }
            
            else if (result['type'] == "completed_test"){
                var messages = result["bot_message"].split("\n");
                for (var i=0;i<messages.length;i++){
                    if (messages[i].replace(" ","" != "")){
                        message = new Message({
                            text: messages[i],
                            message_side: 'left'
                        });
                        message.draw();
                        $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                    }
                }
            }
            
            if (result['type'] == "wrong_answer"){
                var messages = result["bot_message"].split("\n");
                for (var i=0;i<messages.length;i++){
                    if (messages[i].replace(" ","" != "")){
                        message = new Message({
                            text: messages[i],
                            message_side: 'left'
                        });
                        message.draw();
                        $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
                    }
                }
            }
        }
    });
}


function execute_code(){
    message = new Message({
        text: "Running your code ...",
        message_side: 'left'
    });
    message.draw();
    $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    var editor = ace.edit("editor");
    var source_code = editor.getValue();
    var language = 'python';
    var program_input = document.getElementById("program_input").value;

    input_data = {"source_code":source_code,
                  "uid":USER_ID,
                  "program_input":program_input,};
    
    var output_text = document.getElementById("output_text");
    console.log(input_data);
    output_text.innerHTML = "";
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: input_data,
        url: "/api/code_execution",
        success: function(result){
            console.log(result);
            if (result['type'] == "successfully_executed"){
                var output = result['output'];
                output_text.innerHTML = output;
            }
            else if (result['type'] == "error_occured"){
                var output = result['output'];
                var error_message = result['error_message'];
                output_text.innerHTML = output + "<br>" + error_message;
            }
        }
    });
}