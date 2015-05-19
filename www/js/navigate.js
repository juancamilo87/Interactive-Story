var current_chapter = 1;
var chapters_count = 0;
var db;
var chapters = [];


function reload_chapter(){
//Reload HTML with current_chapter variable querying database
	
}

function load_next_chapter (chapter_id, chapter_number) {
	loadChapterByChapterId( chapter_id, chapter_number );
}

function next_chapter(){
	current_chapter++;
	reload_chapter();
}


function load_stories() {
	db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    db.transaction(populateStories, errorJsonCB, successJsonCB);
}

function populateStories(tx) {
	
	 tx.executeSql("SELECT * FROM stories", [], function(tx, results) {
         if(results.rows.length > 0) {
        	 
        	 //alert( results.rows.length );
        	 
        	 var temp_html = "";
        	 for( var i=0; i<results.rows.length; i++ ) {
        		 temp_html+= '<ul data-role="listview" data-inset="true">';
        		 temp_html+= '<li><a href="#story" id="load" onclick="loadChapterByStoryId(';
        		 temp_html+= results.rows.item(i).story_id;
        		 temp_html+= '); return true;">';
        		 temp_html+= results.rows.item(i).name;
        		 temp_html+= '</a></li>';
        		 temp_html+= '</ul>';
        	 }
      
        	 var storyElement = document.getElementById('story_list');
        	 storyElement.innerHTML = temp_html;
        	 
        	 
         } else {
        	 alert("no length");
         }
         
     });
	
}

function loadChapterByStoryId(storyId) {
	db.transaction( function(tx){ populateChaptersByStoryId(tx, storyId) } , errorJsonCB, successJsonCB);
}

function populateChaptersByStoryId (tx, story_id) {
	tx.executeSql("SELECT * FROM chapters WHERE story_id='"+story_id+"'", [], function(tx, results) {
		
		//alert( "length is " + results.rows.length );
		
        if(results.rows.length > 0) {
        	
        	chapters_count = results.rows.length; 
       	 
       	 //alert( "chapter count is " + results.rows.length );
       	 
       	 var temp_html = "";
       	 for( var i=0; i<results.rows.length; i++ ) {
       		 temp_html+= '<ul data-role="listview" data-inset="true">';
       		 temp_html+= '<li><a href="#storycontent" onclick="loadChapterByChapterId(';
       		 temp_html+= results.rows.item(i).chapter_id;
       		 
       		 //saving the chapter id in an array for the next chapter functionality.
       		 
       		 chapters[i] = results.rows.item(i).chapter_id;
       		 
       		 temp_html+= ',';
       		 temp_html+= i;
       		 temp_html+= '); return true;">';
       		 temp_html+= results.rows.item(i).name;
       		 temp_html+= '</a></li>';
       		 temp_html+= '</ul>';
       	 }
     
       	 var storyElement = document.getElementById('chapter_list');
       	 storyElement.innerHTML = temp_html;
       	 
       	 //alert( temp_html );
       	 
       	 
        } else {
       	 alert("no length");
        }
        
    });
}

function loadChapterByChapterId ( chapterId, chapter_number ) {
	db.transaction( function(tx){ getChapterContentByChapterId(tx, chapterId, chapter_number) } , errorJsonCB, successJsonCB);
}

function getChapterContentByChapterId(tx, chapter_id, chapter_number) {
	
	alert(chapters);
	
	tx.executeSql("SELECT * FROM chapters WHERE chapter_id='"+chapter_id+"'", [], function(tx, results) {
        if(results.rows.length > 0) {
       	 
       	 //alert( "chapter count is " + results.rows.length );
       	 
        var interactionId = "";
        	
       	 var temp_html = "";
       	 var next_chapter = chapters[chapter_number+1];
      	 
       	 for( var i=0; i<results.rows.length; i++ ) {
       		 temp_html+= '<p>';
       		 temp_html+= results.rows.item(i).body;
       		 temp_html+= '</p>';
       		 temp_html+= '<p>';
       		 temp_html+= '<img src="';
      		 temp_html+= results.rows.item(i).image_path;
      		 temp_html+= '" width="200" height="200" data-rel="external"/>';
      		 temp_html+= '</p>';
      		 
      		 //alert( "interaction id in the loop is" + results.rows.item(i).interaction_id );
      		 
      		interactionId+= results.rows.item(i).interaction_id;
      		
      		alert( interactionId );
      		
       	 }
       	
       	var interaction_temp = "";
       	 
       	if( interactionId == '4' ) {
       		
       		interaction_temp += '<input id="given_word" type="text" value="Hello"/>';
       		interaction_temp += '<input id="typed_word" type="text"/>';
       		interaction_temp += '<button type="button" onclick="check_word(';
       		interaction_temp += interactionId;
       		interaction_temp += ')"> Check';
       		interaction_temp += '</button>';
       		interaction_temp += '<br/>';
       		interaction_temp += '<div id="result">';
       		interaction_temp += ' </div>';
       		
       	} else if ( interactionId == '5' ) {
       		interaction_temp += '<br/><br/><br/><br/>';
       		interaction_temp += '<form id="question_form">';
       		interaction_temp += '<input type="radio" name="question1" value="1" checked>Answer1';
       		interaction_temp += '<input type="radio" name="question1" value="2">Answer2';
       		interaction_temp += '<input type="radio" name="question1" value="3">Answer3';
       		interaction_temp += '<input type="radio" name="question1" value="4">Answer4';
       		interaction_temp += '</form>';
       		interaction_temp += '<br/>';
       		interaction_temp += '<br/>';
       		interaction_temp += '<button type="button" onclick="check_quiz(';
       		interaction_temp += interactionId;
       		interaction_temp += ')">Check answer';
       		interaction_temp += '</button>';
       	} else if ( interactionId == '1' ) {

          interaction_temp += "<button id='nfcButton' type='button' onclick='startNFCInteraction(";
          interaction_temp += interactionId;
          interaction_temp += ")'";
          interaction_temp += '>Start NFC reading';
          interaction_temp += '</button>';
          interaction_temp += '<br/>';
          interaction_temp += ' </div>';

        } else if( interactionId == '2' ) {
        	//gps code will go 
        	
        	//<a href="QRcode.html"> Click to scan </a>
        	
        	interaction_temp += '<button id="qrBtn" style="background-image: url("/img/btn-back.gif");" onclick="startScan(';
        	interaction_temp += interactionId;
        	interaction_temp += ')"> Click to scan </button>';
        	interaction_temp += '<br/>';
        	interaction_temp += '<div id="qrResult">testing</div>';
            
        } else if (interactionId == '3'){
            interaction_temp += "<button id='gpsButton' type='button' onclick='getLocation(";
            interaction_temp += interactionId;
            interaction_temp += ")'";
            interaction_temp += '>your location';
            interaction_temp += '</button>';
            interaction_temp += '<br/>';
            interaction_temp += ' </div>';
            interaction_temp += ' <div id="locationDiv">';
            interaction_temp += ' </div>';
        }
       	
       	temp_html+= interaction_temp;
       	if( chapter_number < chapters_count-1 ) {
         	 
     		 temp_html+= '<button type="button" onclick="load_next_chapter(';
     		 temp_html+= next_chapter;
	       	 temp_html+= ',';
	       	 temp_html+= chapter_number+1;
	       	 temp_html+= ')"> Load Next Chapter';
	       	 temp_html+= '</button>';
     	 }
       	
       	
       	var storyElement = document.getElementById('chapter_content');
       	storyElement.innerHTML = temp_html;
       	 
       	 
        } else {
       	 alert("no length");
        }
        
    });
}


function successJsonCB() 
{
    alert('success');
}

function errorJsonCB(err)
{
    alert("Error populating from JSON: " + err.message);
}
/*
interaction_id to get either the text or the audio interaction
result = 1 when interaction was succesful
result = 0 when interaction wasn't succesful
*/
function give_feedback(interaction_id, result)
{
	//Query database to decide text = 2 if both, text =1 if text or 0 if audio and get either audio_path or feedback
	var text = 0;
	var text_data;
	//adjust audio_path for proper media playback on android
	//for now, if file is in www/img it should be "/android_asset/www/img/test1.mp3"
	var audio_path;
	if(text == 0)
	{
		play_audio_feedback(text_data);
	}
	else if(text == 1)
	{
		display_text_feedback(audio_path);
	}
	else
	{
		play_audio_feedback(text_data);
		display_text_feedback(audio_path);
	}



}

//feedback is the text to be displayed
function display_text_feedback(feedback)
{
	$.mobile.changePage( $("#feedback-dialog"), { role: "dialog", transition: "pop"} );	
	
	$("#feedback_content").text(feedback);
	
}

function play_audio_feedback(audio_path)
{
	console.log("start audio function");
	var media = new Media(audio_path, 
						function()
						{
							console.log("audio_feedback played");
							media.release();
						},
						function(err)
						{
							console.log("audio_feedback error");
							console.log("error code: "+err.code);
							console.log("error message: "+err.message);
							media.release();
						}, 
						function(status)
						{
							if(status == Media.MEDIA_STARTING)
							{
								console.log("audio_feedback started");
							}
							else if(status == Media.MEDIA_STOPPED)
							{
								console.log("audio_feedback stopped");
							}
							else
							{
								console.log("another status: "+status);	
							}
						});
	media.play();
}