

// document.querySelector("#start_playback1").addEventListener("touchend", startPlayback, false);
// document.querySelector("#start_playback2").addEventListener("touchend", startPlayback2, false);	

function startPlayback()
{
    // console.log('start method');
	// console.log(cordova.file.applicationStorageDirectory);
	// window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, 
	// 	function(directoryEntry){
	// // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
 // //    	function(fileSystem){
	// 		//alert("started");
	// 		//var directoryEntry = fileSystem.root;
	// 		//var filePath = directoryEntry.toURL() + "Download/Skinny_Love.mp3";
	// 		var filePath = directoryEntry.toURL()+"Documents/";
	// 		filePath = filePath + "stories/" + '1' + "/" + '2' + "/interaction/" +"feedback_right/"+ '61.mp3';
	// 		console.log('Complete file path: ' + filePath);
 //    		console.log('before playback');
 //    		play_audio(encodeURI(filePath));
 //    		console.log('after playback');


	// },
	// function(fileError)
	// {
	// 	//console.log("Error: " + fileError.error.code);
	// 	//alert(fileError.message);
	// 	alert("Error code for resolving path: " + fileError.code);
	// 	//alert(fileError);
	// });
	give_feedback(10, 1);
}
function startPlayback2()
{
    display_text_feedback('Oh, try again!!');
}