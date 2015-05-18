var current_chapter = 1;
var db;
var current_story_id;


function reload_chapter(){
//Reload HTML with current_chapter variable querying database

//Retreive data from DB for chapter number current_chapter asnd story_id current_story_id

//Populate chapter_content


}

function next_chapter(){
// if(next_chapter_exists())
// {
// current_chapter++;
// reload_chapter();
// }
// else
// {
//  end_story();
// }
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

//alert( "chapter count is " + results.rows.length );

var temp_html = "";
for( var i=0; i<results.rows.length; i++ ) {
	temp_html+= '<ul data-role="listview" data-inset="true">';
	temp_html+= '<li><a href="#storycontent" onclick="loadChapterByChapterId(';
		temp_html+= results.rows.item(i).chapter_id;
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

function loadChapterByChapterId ( chapterId ) {
	db.transaction( function(tx){ getChapterContentByChapterId(tx, chapterId) } , errorJsonCB, successJsonCB);
}

function getChapterContentByChapterId(tx, chapter_id) {
	tx.executeSql("SELECT * FROM chapters WHERE chapter_id='"+chapter_id+"'", [], function(tx, results) {
		if(results.rows.length > 0) {

//alert( "chapter count is " + results.rows.length );

var interactionId = "";

var temp_html = "";
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
	interaction_temp += '<button type="button" onclick="check_word()"> Check';
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
	interaction_temp += '<button type="button" onclick="check_quiz(1)">Check answer';
	interaction_temp += '</button>';
} else if ( interactionId == '1' ) {

	interaction_temp += "<button id='nfcButton' type='button' onclick='startNFCInteraction(";
		interaction_temp += "1, 1, &#39;This is the code&#39;)'";
interaction_temp += '>Start NFC reading';
interaction_temp += '</button>';
interaction_temp += '<br/>';
interaction_temp += ' </div>';

} else if( interactionId == '2' ) {
//gps code will go 

//<a href="QRcode.html"> Click to scan </a>

interaction_temp += '<button id="qrBtn" style="background-image: url("/img/btn-back.gif");" onclick="startScan()"> Click to scan </button>';
interaction_temp += '<br/>';
interaction_temp += '<div id="qrResult">testing</div>';

} else if (interactionId == '3'){
	interaction_temp += "<button id='gpsButton' type='button' onclick='getLocation(";
		interaction_temp += interactionId;
		interaction_temp += ", ";
		interaction_temp += "51.5033630";
		interaction_temp += ", ";
		interaction_temp += "51.5033630";
		interaction_temp += ")'";
interaction_temp += '>your location';
interaction_temp += '</button>';
interaction_temp += '<br/>';
interaction_temp += ' </div>';
interaction_temp += ' <div id="locationDiv">';
interaction_temp += ' </div>';
}

temp_html+= interaction_temp;

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