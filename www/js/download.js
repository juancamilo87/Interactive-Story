
/*
source:
0 = From chapter
1 = From interaction

type if source = 0:
0 = video
1 = image
2 = audio

type if source = 1:
0 = feedback right
1 = feedback wrong

*/
function download_file(url, story_id, chapter_number, type, source)
{
  //alert(cordova.file.applicationStorageDirectory);
  window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, 
    function(directoryEntry){
  // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
  //   function(fileSystem){
  //     var directoryEntry = fileSystem.root;
      //alert("started");
      console.log('full path: '+ directoryEntry.toURL());
      var filePath = directoryEntry.toURL()+"Documents/";
      var fileName = url.substring(url.lastIndexOf('/')+1);

      if(source==0)
        {
          filePath = filePath + "stories/" + story_id + "/" + chapter_number + "/";
          if(type == 0)
          {
            filePath += "video/";
          }
          else if(type == 1)
          {
            filePath += "image/";
          }
          else if(type == 2)
          {
            filePath += "audio/";
          }
          filePath += fileName;
          
        }
        else
        {
          filePath = filePath + "stories/" + story_id + "/" + chapter_number + "/interaction/";
          if(type == 0)
          {
            filePath += "feedback_right/";
          }
          else if(type == 1)
          {
            filePath += "feedback_wrong/";
          }
          filePath += fileName;
        }
        
        
        console.log('filePath: ' + filePath);
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(url);
        
        fileTransfer.download(
          uri,
          filePath,
          function(entry) {
              console.log("download complete: " + entry.fullPath);
              console.log("download complete2: " + entry.toURL());
          },
          function(error) {
              console.log("download error source " + error.source);
              console.log("download error target " + error.target);
          },
          true
      );



  },
  function(fileError)
  {
    //console.log("Error: " + fileError.error.code);
    //alert(fileError.message);
    alert("Error code for resolving path: " + fileError.code);
    //alert(fileError);
  });

   //  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
   //   function(fileSystem){
   //     console.log('file System name: '+fileSystem.name);
   //     console.log('file System root name: '+fileSystem.root.name);
   //     var directoryEntry = fileSystem.root;
        
   //     //Create filePath
        
   //     var filePath;
   //     if(source==0)
   //     {
   //       filePath = directoryEntry.toURL() + "interactive_story/" + story_id + "/" + chapter_number + "/";
   //       if(type == 0)
   //       {
   //         filePath += "video/";
   //       }
   //       else if(type == 1)
   //       {
   //         filePath += "image/";
   //       }
   //       else if(type == 2)
   //       {
   //         filePath += "audio/";
   //       }
   //       filePath += fileName;
          
   //     }
   //     else
   //     {
   //       filePath = directoryEntry.toURL() + "interactive_story/" + story_id + "/" + chapter_number + "/interaction/";
   //       if(type == 0)
   //       {
   //         filePath += "feedback_right/";
   //       }
   //       else if(type == 1)
   //       {
   //         filePath += "feedback_wrong/";
   //       }
   //       filePath += fileName;
   //     }
        
        
   //     console.log('filePath: ' + filePath);
   //     var fileTransfer = new FileTransfer();
   //     var uri = encodeURI(url);
        
   //     fileTransfer.download(
      //     uri,
      //     filePath,
      //     function(entry) {
      //         console.log("download complete: " + entry.fullPath);
      //         console.log("download complete2: " + entry.toURL());
      //     },
      //     function(error) {
      //         console.log("download error source " + error.source);
      //         console.log("download error target " + error.target);
      //     },
      //     true
      // );

      




   //   }, 
   //   function(evt){
   //     console.log("error: " + evt.target.error.code);
   //   });
}