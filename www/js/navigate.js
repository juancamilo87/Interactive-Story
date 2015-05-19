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
	       	 
	        var interactionId = results.rows.item(0).interaction_id;
	        
	        var temp_html = "";
			var next_chapter = chapters[chapter_number+1];
	  	 
			temp_html+= '<p>';
			temp_html+= results.rows.item(0).body;
			temp_html+= '</p>';
			temp_html+= '<p>';
			temp_html+= '<img src="';
			temp_html+= results.rows.item(0).image_path;
			temp_html+= '" width="200" height="200" data-rel="external"/>';
			temp_html+= '</p>';

	        tx.executeSql("SELECT * FROM interactions WHERE interaction_id="+interactionId,[],function(tx, res){
	        	var interaction_type = res.rows.item(0).interaction_type;
	        	var interaction_inner_id;
	        	var table;
	        	if(interaction_type == 1)
				{
					interaction_inner_id = res.rows.item(0).nfc_id;
					table = 'nfc';
				}
				else if(interaction_type == 2)
				{
					interaction_inner_id = res.rows.item(0).qr_id;
					table = 'qr';
				}
				else if(interaction_type == 3)
				{
					interaction_inner_id = res.rows.item(0).gps_id;
					table = 'gps';
				}
				else if(interaction_type == 4)
				{
					interaction_inner_id = res.rows.item(0).spell_id;
					table = 'spell';
				}
				else if(interaction_type == 5)
				{
					interaction_inner_id = res.rows.item(0).quiz_id;
					table = 'quiz';
				}
	        	
				tx.executeSql("SELECT * FROM "+table+" WHERE "+ table+"_id = "+interaction_inner_id,[],function(tx, res){
					//alert( "interaction id in the loop is" + results.rows.item(i).interaction_id );
	 
	      		
	      		
	      			alert( interactionId );
	       	
	       			var interaction_temp = "";
	       	 		
	       			if(interaction_type == 1)
	       			{
						//NFC
			       		
			       		var instructions = res.rows.item(0).instructions;
			       		interaction_temp += '<div><strong>Instructions</strong></div>';
			       		interaction_temp += '<div>'+instructions+'</div>';
			       		interaction_temp += '<br/>';
						interaction_temp += "<button id='nfcButton' type='button' onclick='startNFCInteraction(";
						interaction_temp += interactionId;
						interaction_temp += ")'";
						interaction_temp += '>Start NFC reading';
						interaction_temp += '</button>';
						interaction_temp += '<br/>';
						interaction_temp += ' </div>';
					}
					else if(interaction_type == 2)
					{
						//QR
			        	
			       		var instructions = res.rows.item(0).instructions;
			       		interaction_temp += '<div><strong>Instructions</strong></div>';
			       		interaction_temp += '<div>'+instructions+'</div>';
			       		interaction_temp += '<br/>';
			        	interaction_temp += '<button id="qrBtn" style="background-image: url("/img/btn-back.gif");" onclick="startScan(';
			        	interaction_temp += interactionId;
			        	interaction_temp += ')"> Click to scan </button>';
			        	interaction_temp += '<br/>';
			        	interaction_temp += '<div id="qrResult">testing</div>';
					}
					else if(interaction_type == 3)
					{
						//GPS
			        	
			       		var instructions = res.rows.item(0).instructions;
			       		interaction_temp += '<div><strong>Instructions</strong></div>';
			       		interaction_temp += '<div>'+instructions+'</div>';
			       		interaction_temp += '<br/>';
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
					else if(interaction_type == 4)
					{
						//Spell_check
			       		
			       		var instructions = res.rows.item(0).instructions;
			       		var phrase = res.rows.item(0).phrase;
			       		interaction_temp += '<div><strong>Instructions</strong></div>';
			       		interaction_temp += '<div>'+instructions+'</div>';
			       		interaction_temp += '<br/>';
			       		interaction_temp += '<div>'+ phrase+'</div>';
			       		interaction_temp += '<br/>';
			       		interaction_temp += '<input id="typed_word" type="text"/>';
			       		interaction_temp += '<button type="button" onclick="check_word(';
			       		interaction_temp += interactionId;
			       		interaction_temp += ')"> Check';
			       		interaction_temp += '</button>';
			       		interaction_temp += '<br/>';
			       		interaction_temp += '<div id="result">';
			       		interaction_temp += ' </div>';
					}
					else if(interaction_type == 5)
					{
						//Quiz
			       		
			       		var question = res.rows.item(0).question;
			       		var answers = [];
			       		answers.push(res.rows.item(0).correct_answer);
			       		answers.push(res.rows.item(0).answer_1);
			       		answers.push(res.rows.item(0).answer_2);
			       		answers.push(res.rows.item(0).answer_3);


			       		interaction_temp += '<div><strong>Question</strong></div>';
			       		interaction_temp += '<div>'+question+'</div>';
			       		interaction_temp += '<br/>';
			       		interaction_temp += '<form id="question_form">';
			       		
			       		for(var i = 0; i<4; i++)
			       		{
			       			var index = Math.floor((Math.random() * (4-i)));
			       			if(i == 0)
			       			{
			       				interaction_temp += '<input type="radio" name="question1" value="'+answers[index]+'" checked>'+answers[index];
			       			}
			       			else
			       			{
			       				interaction_temp += '<input type="radio" name="question1" value="'+answers[index]+'">'+answers[index];		
			       			}
			       			answers.splice(index,1);
			       			
			       		}
			       		
			       		interaction_temp += '</form>';
			       		interaction_temp += '<br/>';
			       		interaction_temp += '<br/>';
			       		interaction_temp += '<button type="button" onclick="check_quiz(';
			       		interaction_temp += interactionId;
			       		interaction_temp += ')">Check answer';
			       		interaction_temp += '</button>';
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
			       	 
			       	 
			        

				});
				
	        });
		}
        else
        {
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
	var file_name;
	var chapter_number;
	var story_id;
	var feedback_text;
	db = window.sqlitePlugin.openDatabase({name: "stories.db"});
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM interactions WHERE interaction_id='"+interaction_id+"'", [], function(tx, res){
			var interaction_type = res.rows.item(0).interaction_type;
			var id;
			var table;
			if(interaction_type == 1)
			{
				id = res.rows.item(0).nfc_id;
				table = 'nfc';
			}
			else if(interaction_type == 2)
			{
				id = res.rows.item(0).qr_id;
				table = 'qr';
			}
			else if(interaction_type == 3)
			{
				id = res.rows.item(0).gps_id;
				table = 'gps';
			}
			else if(interaction_type == 4)
			{
				id = res.rows.item(0).spell_id;
				table = 'spell';
			}
			else if(interaction_type == 5)
			{
				id = res.rows.item(0).quiz_id;
				table = 'quiz';
			}

			if(id != null)
			{
				tx.executeSql('SELECT * FROM '+table+" WHERE "+ table+"_id='"+id+"'", [], function(tx, res){
					if(result == 1)
					{
						file_name = res.rows.item(0).audiopath_right;
						feedback_text = res.rows.item(0).feedback_right;
					}
					else if(result ==0)
					{
						file_name = res.rows.item(0).audiopath_wrong;
						feedback_text = res.rows.item(0).feedback_wrong;
					}

					if(file_name != null || feedback_text != null)
					{
						tx.executeSql("SELECT * FROM chapters WHERE interaction_id="+ interaction_id, [], function(tx, res){
							chapter_number = res.rows.item(0).number;
							story_id = res.rows.item(0).story_id;

							if(file_name != null)
							{
								play_audio_feedback(story_id, chapter_number, result, file_name);
							}

							if(feedback_text != null)
							{
								display_text_feedback(feedback_text);
							}
						});
					}
				});
			}			    
		});
	}, errorCB);  
}

//feedback is the text to be displayed
function display_text_feedback(feedback)
{
	$.mobile.changePage( $("#feedback-dialog"), { role: "dialog", transition: "pop"} );	

	$("#feedback_content").text(feedback);

}

function play_audio_feedback(story_id, chapter_number, interaction_result, file_name)
{
	window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, 
		function(directoryEntry){
// window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
//    	function(fileSystem){
//alert("started");
//var directoryEntry = fileSystem.root;
//var filePath = directoryEntry.toURL() + "Download/Skinny_Love.mp3";
var filePath = directoryEntry.toURL()+"Documents/";
filePath = filePath + "stories/" + story_id + "/" + chapter_number + "/interaction/";
if(interaction_result == 1)
{
	filePath = filePath + "feedback_right/"+ file_name;
}
else if(interaction_result == 0)
{
	filePath = filePath + "feedback_wrong/"+ file_name;
}
// console.log('Complete file path: ' + filePath);
//  		console.log('before playback');
console.log("Final audio path: " + filePath);
play_audio(encodeURI(filePath));
//play_audio(encodeURI("file://sdcard/Download/Skinny_Love.mp3"));
// console.log('after playback');


},
function(fileError)
{
//console.log("Error: " + fileError.error.code);
//alert(fileError.message);
alert("Error code for resolving path: " + fileError.code);
//alert(fileError);
});
}

function play_audio(audio_path)
{
	console.log("start audio function");
	var media = new Media(audio_path, 
		function()
		{
			console.log("audio played");
			media.release();
		},
		function(err)
		{
			console.log("audio error");
			console.log("error code: "+err.code);
			console.log("error message: "+err.message);
			media.release();
		}, 
		function(status)
		{
			if(status == Media.MEDIA_STARTING)
			{
				console.log("audio started");
			}
			else if(status == Media.MEDIA_STOPPED)
			{
				console.log("audio stopped");
			}
			else
			{
				console.log("another status: "+status);	
			}
		});
	media.play();
}

function errorCB(error)
{
	console.log("Error querying DB");
}