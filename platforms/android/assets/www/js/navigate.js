var current_chapter = 1;

function reload_chapter(){
//Reload HTML with current_chapter variable querying database
	
}

function next_chapter(){
	current_chapter++;
	reload_chapter();
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