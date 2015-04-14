

document.querySelector("#start_playback1").addEventListener("touchend", startPlayback, false);
document.querySelector("#start_playback2").addEventListener("touchend", startPlayback2, false);	

function startPlayback()
{
    display_text_feedback('Great job! Continue reading!! :)');
}
function startPlayback2()
{
    display_text_feedback('Oh, try again!!');
}