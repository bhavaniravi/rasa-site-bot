var data=[];
instruction = document.getElementById('QI').innerHTML,
csrf = document.getElementsByName("csrfmiddlewaretoken")[0].value,
userid = document.getElementById("userid").value,
userphoto = document.getElementById("userphoto").value,
username = document.getElementById("username").value,
qtype="welcome",
qindex=0,
topic="welcome",
genralQindex=0;
document.getElementById('QI').innerHTML="<div class='slide' style='right:0px;opacity: 1;'>"+instruction+"</div>";

function toggleview() {
   if(document.getElementById("minimize").className.indexOf("minus") > -1){
    document.getElementById("minimize").className="icon typicons-plus";
    document.getElementById("conversation").style.display="none";
   }
   else{
    document.getElementById("minimize").className="icon typicons-minus";
    document.getElementById("conversation").style.display="inline";
   }
 }
function submit(){
	document.getElementById("modal-body").innerHTML = "";
	submission_id = null;
	$.post("/submit",
        {
        	id:userid,
            csrfmiddlewaretoken:csrf,
            qindex:qindex,
            skill:document.getElementById("compiler").innerHTML,
            code:editor.getValue(),
            submission_id:submission_id
        },
       function(jsondata, status){
			result = jsondata["status"];
			submission_id = jsondata["submission_id"];
			console.log(result)
			img_content = "";
			switch(result){
				case "successful":
					document.getElementById("next").setAttribute("value","Next");
					img_content = "<img id=\"detail-icon-img\" src=\"https://cdn1.iconfinder.com/data/icons/silk2/tick.png\" alt=\"active, check, green, mark, ok, right, tick, validate icon\" style=\"max-width: 12px; max-height: 12px;\">";
					break;
				case "running":
					img_content = "<img style=\"max-width: 12px; max-height: 12px;\" src=\"static/images/hourglass.svg\">"
					break;
				case "code_error":
					img_content = "<img alt=\"alert, attention, erreur, error, exclamation icon\" class=\"tiled-icon\" style=\"max-width: 12px; max-height: 12px;\" src=\"https://cdn1.iconfinder.com/data/icons/silk2/exclamation.png\">"
					break;
				case "wrong":
					img_content = "<img alt=\"cross, denied, red icon\" class=\"tiled-icon\" style=\"max-width: 12px; max-height: 12px;\" src=\"https://cdn1.iconfinder.com/data/icons/silk2/cross.png\">"
					break;
			}
			var id = "case"+(i+1);
			var content_div = document.createElement("div");
			var p_tag = document.getElementById(id);
			inner_content = "<span class=\"status\">"+img_content+"</span>"+
							"<span class=\"case-name\">  Test Case #"+(i+1)+"</span>";
			if(p_tag == null){
			content = "<p id=\""+id+"\"class=\"testcase\">"+inner_content +"</p>";
			content_div.innerHTML = content;
			}
			else{
				p_tag.innerHTML = inner_content;
			}
			document.getElementById("modal-body").appendChild(content_div);
			document.getElementById("modal-body").hidden = false;
		});
}


function run(){
	    $.post("/run",
            {
            	id:userid,
                csrfmiddlewaretoken:csrf,
                qindex:qindex,
                skill:document.getElementById("compiler").innerHTML,
                code:editor.getValue(),
                input:document.getElementById("custominput").value
            },
            function(jsondata, status){
  				 	result = jsondata["result"];
  				 	createTabs(result);
                }
            );
    
}

function createTabs(result){
	tabs = document.getElementById("output");
	tabs.innerHTML = "";
	tabText = '';
	
	var content = "";
	if(result[0]["error"]!=""){
		content += "<div id=\"error\"><p>Error: </p><p class=\"test-text error-text\">"+result[0]["error"]+"</p></div>";
	}
	content +=   "<div id=\"input\"><p>Input: </p><p class=\"test-text input-text\">"+result[0]["input"]+"</p></div>"+
				 "<div id=\"output\"><p>output: </p><p class=\"test-text output-text\">"+result[0]["output"]+"</p></div>";
	content += "<div id=\"status\"><p>Status: </p><p class=\"test-text status-text\">"+result[0]["status"]+"</p></div>";
	casename = 'test-'+(1);
	tabname = 'test-tab-'+(1);
	tabText += '<li><a href=\"#\" id=\"'+tabname+'\" class=\"tablinks\" onclick=\"openTab(event,'+"'"+casename+"'"+')\">'+casename+'</a></li>';
	var tab_content = document.createElement("div");
	tab_content.setAttribute("class","tabcontent");
	tab_content.setAttribute("id",casename);
	tab_content.innerHTML += content;
	tabs.appendChild(tab_content);
	
	var tab_list= document.createElement("ul");
	tab_list.setAttribute("class","tabs clearfix");
	tab_list.innerHTML = tabText;
	tabs.insertBefore(tab_list, tabs.firstChild);
	document.getElementById("test-tab-1").click();
}

function openTab(evt,tabName) {
	evt.preventDefault()
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function botSays(text){
        var d = new Date();
        $("#chatbox").append(" <li class='ibo'><div class='avatar-icon'><img src='static/images/ibo.jpg'></div><div class='messages'><p>"+
        text+"</p><time class=\"timeago\" datetime=\""+d.toISOString()+"\">Now</time></div></li>"); 
        $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
}

function sayToBot(text){
    $.post("/chat",
            {
                csrfmiddlewaretoken:csrf,
                id:userid,
                text:text,
                Qtype:qtype,
                qindex:qindex,
                topic:topic
            },
            function(jsondata, status){
                if(jsondata["status"]=="successful"){
                    qtype = jsondata["qtype"];
                    response=jsondata["response"];
                    topic=jsondata["topic"];
                    qindex=jsondata["qindex"];
                    if(response){botSays(response);}
                    if(jsondata["action"]=="MCQ"){getMCQ();}
                    if(jsondata["action"]=="SKIP"){shownext();}
                    if(jsondata["action"]=="QUIT"){testCompleted();}
                }
            });
    $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
}
$("#say").keypress(function(e) {
    if(e.which == 13) {
        $("#saybtn").click();
    }
});
$("#saybtn").click(function ()
    {
        val= document.getElementById("say").value;
        var d = new Date();
        document.getElementById("say").value="";
        $("#chatbox").append(" <li class='me'><div class='avatar-icon'><img src='"+userphoto+"'></div><div class='messages'><p>"+
        val+"</p><time class=\"timeago\" datetime=\""+d.toISOString()+"\">Now</time></div></li>");
        sayToBot(val);
    });
jQuery(document).ready(function() {
  setInterval(function(){ jQuery("time.timeago").timeago(); }, 20000);
});
$('input[type=checkbox]').removeAttr('checked');
    // $("#owninput").change(function() {
    //         var ischecked= $(this).is(':checked');
    //         if(ischecked)
    //           document.getElementById("custominputfileds").style.display="inline";
    //         else
    //           document.getElementById("custominputfileds").style.display="inline";
    // });
var editor = ace.edit("editor");
var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
// create a simple selection status indicator
var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
editor.setTheme("ace/theme/dreamweaver");
editor.session.setMode("ace/mode/text");
editor.setAutoScrollEditorIntoView(true);
editor.setOption("maxLines", 30);
editor.setOption("minLines", 30);

function setreadonly(readonly){
    editor.setReadOnly(readonly);
    $(".submit").prop('disabled', readonly);
    if(readonly){
        editor.setValue("Here goes your code...", -1);
    }
    else{
        editor.setValue("", -1)
    }
}
setreadonly(true);
function setLang(lang){
    languageInterpreter = lang.split(" ")[0].replace("#","sharp").toLowerCase()
    if(languageInterpreter=="vb"){
        languageInterpreter="vbscript";
    }
    editor.session.setMode("ace/mode/"+languageInterpreter);
    setreadonly(false);
    document.getElementById("compiler").innerHTML=lang;
    document.getElementById("minimize").className="icon typicons-plus";
    document.getElementById("conversation").style.display="none";
}
function unsetLang(){
    editor.session.setMode("ace/mode/text");
    setreadonly(true);
    document.getElementById("compiler").innerHTML="Disabled";
    document.getElementById("minimize").className="icon typicons-minus";
    document.getElementById("conversation").style.display="inline";
}
function doSkip()
    {
    	alert("SKIP");
        sayToBot("SKIP");
        document.getElementById("modal-body").innerHTML = "";
        document.getElementById("modal-backdrop").hidden = true;
    }
 function shownext()
    {
        showProgrammingQ(++pq_index);
        document.getElementById("modal-body").innerHTML = "";
        document.getElementById("modal-backdrop").hidden = true;
    }

    
//---Function to create divs to animate
function createDiv(data) {

  //---Disable button

  //---Access to the slide div
  var slide = $("#QI .slide");

  //---If slide exists
  if (slide.length > 0) {

    //---Dissapear the slide to the left
    slide.animate({

      "opacity": 0,
      "right": "100%"

    }, function() {

      //---Delete slide
      $(this).remove();

      //---Create new slide
      var slide = create(data);

      //---Appear slide from the right
      appearSlide(slide);

    });

    //---If the slide no exists
  } else {

    //---Create slide
    var slide = create(data);

    //---Appear slide from the right
    appearSlide(slide);

  }

}

//---Create slide function
function create(data) {

  var slide = $("<div/>");
  slide.addClass("slide");  
  slide.text("\n");
  //var mcq = $(data);
  slide.append(data);
  $("#QI").append(slide);
  return slide;

}

//---Appear slide from the right function
function appearSlide(slide) {

  slide.animate({

    "opacity": 1,
    "right": "0"

  },1200, function() {
    
  });

}
function genrate(data,index){
    result = "<span>"+data["question"]+"<br/><ol class='choice'>";
    data["choice"].forEach(function(item,index){
            result +="<li><label><input value='v"+item[0]+"' name='Choice' type='";
            result +=(data["multiple"]?"checkbox":"radio")+"'><div class='MCanswer'>";
            result +=item[1]+"</div></label></li>";
        });
    result += "</ol><input type='button' class='submit' id='SubmitMCQ' value='submit' onclick='SubmitMCQ("+(index+1)+")'></span>";
    return result;
}
function testCompleted(){
		unsetLang();
    	setreadonly(true);
        topic = "Test completed";
        qindex = genralQindex;
        createDiv(instruction);
        sayToBot("Test Completed");        
        document.getElementById("minimize").className="icon typicons-minus";
        document.getElementById("conversation").style.display="inline";   
}
function showProgrammingQ(index){
    if (index<data.length){
        createDiv(data[index]["question"]);
        lang = data[index]["lang"];
        qindex = data[index]["id"];
        setLang(lang);
        setreadonly(false);
    }
    else {
    	testCompleted();
    	}
}
var pq_index = -1;
function getProgramingQ(){
    $.post("/genrate/questions/Programming",{csrfmiddlewaretoken:csrf,id:userid}, 
    	function(jsondata, status){
            data=jsondata;
            showProgrammingQ(0);
            pq_index = 0
    });
}
function SubmitMCQ(index){
    if(index){
        answers = $("input:checked[name=Choice]").get().map(function(item,index){return item.value.substr(1);}).join();
        $.post("/MCQSubmit",{csrfmiddlewaretoken:csrf,id:userid,answers:answers}, function(jsondata, status){
        });
    }
    if (index<data.length){
        mcq=genrate(data[index],index);
        createDiv(mcq);
    }
    else { 
        topic = "ProgrammingQ";
        genralQindex = qindex;
        getProgramingQ();
    }
}

function getMCQ(){ 
    $.post("/genrate/questions/MCQ",{csrfmiddlewaretoken:csrf,id:userid}, function(jsondata, status){
            data=jsondata;
            SubmitMCQ(0);
    });
    document.getElementById("minimize").className="icon typicons-plus";
    document.getElementById("conversation").style.display="none";
}
