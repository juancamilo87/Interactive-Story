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

}

function play_audio_feedback(audio_path)
{

}