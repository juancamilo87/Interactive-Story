var current_chapter = 1;
var chapters_count = 0;
var db;
var chapters = [];
var applicationStorageDirectory;

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
	$('#stories').empty(); 
    db.transaction(populateStories, errorJsonCB, successStories);
}

function populateStories(tx) {
	 tx.executeSql("SELECT * FROM stories", [], function(tx, results) {
         if(results.rows.length > 0) {
        	 
        	 //alert( results.rows.length );
        	 
        	 $('#stories').empty(); 
        	 //temp_html+= '<ul data-role="listview" data-inset="true">';
        	 for( var i=0; i<results.rows.length; i++ ) {

        		 var temp_html = "";

        		 temp_html+= '<li><a href="#story" id="load" onclick="loadChapterByStoryId(';
        		 temp_html+= results.rows.item(i).story_id;
        		 temp_html+= ",'"+results.rows.item(i).name+"'"+'); return true;">';
        		 temp_html+= results.rows.item(i).name;
        		 temp_html+= '</a></li>';

        		 $('#stories').append(temp_html); 
        		 
        	 }
        	 //temp_html+= '</ul>';
      
        	 // var storyElement = document.getElementById('story_list');
        	 // storyElement.innerHTML = temp_html;
        	 
        	 
         } else {
        	 alert("no length");
         }
         
     });
	
}

function loadChapterByStoryId(storyId, name) {
	$('#chapters').empty(); 
	db.transaction( function(tx){ populateChaptersByStoryId(tx, storyId, name) } , errorJsonCB, successChapters);
}

function populateChaptersByStoryId (tx, story_id, name) {
	tx.executeSql("SELECT * FROM chapters WHERE story_id='"+story_id+"'", [], function(tx, results) {
		
		//alert( "length is " + results.rows.length );
		
        if(results.rows.length > 0) {
        	
        	chapters_count = results.rows.length; 
       	 
       	 //alert( "chapter count is " + results.rows.length );
       	 
       	 var storyElement = document.getElementById('story_title');
       	 
       	 storyElement.innerHTML = "<b>"+name+"</b>";
       	 $('#chapters').empty(); 
       	 for( var i=0; i<results.rows.length; i++ ) {
       		 var temp_html = "";
       		 temp_html+= '<li><a href="#storycontent" onclick="loadChapterByChapterId(';
       		 temp_html+= results.rows.item(i).chapter_id;
       		 
       		 //saving the chapter id in an array for the next chapter functionality.
       		 
       		 chapters[i] = results.rows.item(i).chapter_id;
       		 
       		 temp_html+= ',';
       		 temp_html+= i;
       		 temp_html+= '); return true;">';
       		 temp_html+= results.rows.item(i).name;
       		 temp_html+= '</a></li>';
       		 
       		 $('#chapters').append(temp_html); 
       	 }
     
       	 // var storyElement = document.getElementById('chapter_list');
       	 // storyElement.innerHTML = temp_html;
       	 
       	 //alert( temp_html );
       	 
       	 
        } else {
       	 alert("no length");
        }
        
    });
}

function loadChapterByChapterId ( chapterId, chapter_number ) {
	window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, 
		function(directoryEntry){
			applicationStorageDirectory = directoryEntry;
			console.log("resolved directoryEntry for image, audio and video");
			db.transaction( function(tx){ getChapterContentByChapterId(tx, chapterId, chapter_number) } , errorJsonCB, successChapter);
		}, 
		function(error){
			console.log('error in directory entry');
			console.log('Error: '+ error.message);
		});
}

function getChapterContentByChapterId(tx, chapter_id, chapter_number) {
	
	console.log("chapters: " +chapters);
	
	tx.executeSql("SELECT * FROM chapters WHERE chapter_id='"+chapter_id+"'", [], function(tx, results) {
		console.log("get chapter");
		var interactionId = results.rows.item(0).interaction_id;
        if(results.rows.length > 0) {
        	console.log("chapter exists");
   	 		
					
					// window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
					//    	function(fileSystem){
					//alert("started");
					//var directoryEntry = fileSystem.root;
					//var filePath = directoryEntry.toURL() + "Download/Skinny_Love.mp3";
					var filePath = applicationStorageDirectory.toURL()+"Documents/";
					filePath = filePath + "stories/" + results.rows.item(0).story_id + "/";
					filePath = filePath + results.rows.item(0).number + "/";

					var imagePath = filePath + "image/";
					var audioPath = filePath + "audio/";
					var videoPath = filePath + "video/";
	       	 
			        
			        
			        var temp_html = "";
					var next_chapter = chapters[chapter_number+1];
			  	 
			  	 	//Insert chapter Title

			  	 	temp_html+= '<p style="text-align:center; font-size:200%; color:#FF6600" class="serif"><b>'+results.rows.item(0).name+'</b></p>';

			  	 	if(results.rows.item(0).image_path != null)
			  	 	{
			  	 		console.log("insert image");
			  	 		//Insert image
				  	 	temp_html+= '<p style="text-align:center;">';
						temp_html+= '<img src="';
						temp_html+= imagePath + results.rows.item(0).image_path;
						temp_html+= '" width="200" height="200" data-rel="external"/>';
						temp_html+= '</p>';	
			  	 	}
					

					//Insert main text
					temp_html+= '</br>';
					temp_html+= '<p style="text-transform: none; font-size:115%;'
					temp_html+= 'text-align: justify; text-justify: inter-word;"><b>';
					temp_html+= results.rows.item(0).body;
					temp_html+= '</b></p>';
					
					if(results.rows.item(0).audio_path != null)
					{
						console.log("insert audio");
						// Insert audio
						temp_html+= '<p style="text-align:center;">';
						temp_html+= '<audio controls>';
						temp_html+= '<source src="';
						temp_html+= audioPath + results.rows.item(0).audio_path;
						temp_html+= '" type="audio/mp3">';
	  					temp_html+= '</audio>';
						temp_html+= '</p>';
					}

					if(results.rows.item(0).video_path != null)
					{
						console.log("insert video");
						//Insert video
						temp_html += '<p style="text-align:center;">';
						temp_html += '<button type="button" onclick="startVideo(';
						temp_html += "'"+encodeURIComponent(videoPath) + "','" + results.rows.item(0).video_path + "'";
						temp_html += ')"';
						temp_html += '>Play Video';
						temp_html += '</button>';
						// temp_html+= '<video width="320" height="240" controls>';
						// temp_html+= '<source src="';
						// temp_html+= videoPath + results.rows.item(0).video_path;
						// temp_html+= '" type="video/mp4">';
	  					// temp_html+= '</video>';
						temp_html+= '</p>';
					}

					if(interactionId != null)
					{
						tx.executeSql("SELECT * FROM interactions WHERE interaction_id="+interactionId,[],
			        	function(tx, res){
				        	console.log("inseraction sql inside");
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
				        	
							tx.executeSql("SELECT * FROM "+table+" WHERE "+ table+"_id = "+interaction_inner_id,[],
								function(tx, res){
									//alert( "interaction id in the loop is" + results.rows.item(i).interaction_id );
					 				console.log("inside specific interaction");
					      		
					      		
					      			//alert( interactionId );
					       	
					       			var interaction_temp = "";
					       	 		
					       			if(interaction_type == 1)
					       			{
										//NFC
							       		console.log("Filling nfc interaction");
							       		var instructions = res.rows.item(0).instructions;
							       		interaction_temp += '<div><strong>Instructions</strong></div>';
							       		interaction_temp += '<div style="text-transform: none;">'+instructions+'</div>';
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
							        	console.log("Filling qr interaction");
							       		var instructions = res.rows.item(0).instructions;
							       		interaction_temp += '<div><strong>Instructions</strong></div>';
							       		interaction_temp += '<div style="text-transform: none;">'+instructions+'</div>';
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
							        	console.log("Filling gps interaction");
							       		var instructions = res.rows.item(0).instructions;
							       		interaction_temp += '<div><strong>Instructions</strong></div>';
							       		interaction_temp += '<div style="text-transform: none;">'+instructions+'</div>';
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
							       		console.log("Filling spell check interaction");
							       		var instructions = res.rows.item(0).instructions;
							       		var phrase = res.rows.item(0).phrase;
							       		interaction_temp += '<div><strong>Instructions</strong></div>';
							       		interaction_temp += '<div style="text-transform: none;">'+instructions+'</div>';
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
							       		console.log("Filling quiz interaction");
							       		var question = res.rows.item(0).question;
							       		var answers = [];
							       		answers.push(res.rows.item(0).correct_answer);
							       		answers.push(res.rows.item(0).answer_1);
							       		answers.push(res.rows.item(0).answer_2);
							       		answers.push(res.rows.item(0).answer_3);


							       		interaction_temp += '<div><strong>Question</strong></div>';
							       		interaction_temp += '<div style="text-transform: none;">'+question+'</div>';
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
							       // 		console.log("Adding next chapter button");
							     		// temp_html+= '<a href="#" data-role="button" onclick="load_next_chapter(';
							     		// temp_html+= next_chapter;
								      //  	temp_html+= ',';
								      //  	temp_html+= chapter_number+1;
								      //  	temp_html+= '); return true;"> Load Next Chapter';
								      //  	temp_html+= '</a>';
										console.log("Adding next chapter button");
										temp_html+= '<button type="button" onclick="load_next_chapter(';
										temp_html+= next_chapter;
										temp_html+= ',';
										temp_html+= chapter_number+1;
										temp_html+= ')">Next Chapter';
										temp_html+= '</button>';
							     	 }
							       	
							       	
							       	var storyElement = document.getElementById('chapter_content');
							       	storyElement.innerHTML = temp_html;
							       	//storyElement.listview('refresh');


								},
								function(fileError)
								{
									//console.log("Error: " + fileError.error.code);
									//alert(fileError.message);
									console.log("Error code for resolving path");
									console.log("Error code for resolving path: " + fileError.code);
									//alert(fileError);

							}, function(error){
				        	console.log('error getting interaction');
				        	console.log('Error: '+ error.message);
				        	});
							
				        }, function(error){
				        	console.log('error getting interaction');
				        	console.log('Error: '+ error.message);
				        });
					}
					else
					{
						if( chapter_number < chapters_count-1 ) {
							// console.log("Adding next chapter button");
				   //   		temp_html+= '<a href="#" data-role="button" onclick="load_next_chapter(';
				   //   		temp_html+= next_chapter;
					  //      	temp_html+= ',';
					  //      	temp_html+= chapter_number+1;
					  //      	temp_html+= '); return true;"> Load Next Chapter';
					  //      	temp_html+= '</a>';

							console.log("Adding next chapter button");
							temp_html+= '<button type="button" onclick="load_next_chapter(';
							temp_html+= next_chapter;
							temp_html+= ',';
							temp_html+= chapter_number+1;
							temp_html+= ')">Next Chapter';
							temp_html+= '</button>';
				     	 }
				       	
				       	 
				       	var storyElement = document.getElementById('chapter_content');
				       	storyElement.innerHTML = temp_html;
				       	//storyElement.listview('refresh');
					}
			        
		}
        else
        {
        	console.log("Chapter doesn't exist");
			alert("no length");
        }
        
    }, function(error){
    	console.log('error getting interaction');
    	console.log('Error: '+ error.message);
    });
}

function successStories() 
{
    $('#stories').listview('refresh');
    console.log('success Stories');
}
function successChapters() 
{
	$('#chapters').listview('refresh');
    console.log('success Chapters');
}
function successChapter() 
{
	$('#chapter_content').trigger('create');
    console.log('success chapter');
}
function successJsonCB() 
{
    console.log('success');
}

function errorJsonCB(err)
{
	console.log("Error");
    console.log("Error populating from JSON: " + err.message);
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

function startVideo(path, file_name)
{
	//TODO finish
	
	path = decodeURIComponent(path);
	//console.log(decodeURIComponent(path));
	//console.log('start resolving address');
	window.resolveLocalFileSystemURL(path+file_name, function(fileEntry)
		{
			//console.log('file entry resolved');
			window.resolveLocalFileSystemURL(cordova.file.externalCacheDirectory, 
			    function(directoryEntry){
			    	//console.log('directory entry resolved');

			    	
				    // copy the file to a new directory and rename it
				    fileEntry.copyTo(directoryEntry, file_name, function(fileEntry){
				    	console.log("start Video");
						console.log(fileEntry.toURL());
						cordova.plugins.bridge.open(fileEntry.toURL());
				    }, function(error){});

				    
				},
				function(fileError)
				{
				
				console.log("Error code for resolving path: " + fileError.code);
				//alert(fileError);
				});



			
		}
		, function(error)
		{
			console.log("Error code for resolving path: " + error.message);
		});
	
}