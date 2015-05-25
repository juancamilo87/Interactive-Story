var content;

function choose_file() {

    fileChooser.open(function(uri) {
    //alert(uri);
    //alert(uri);
    // alert(uri.substring(0,4));
    if(uri.indexOf('file:/')==-1)
    {
        content = 1;
        // var index = uri.indexOf('emulated/0/');
        // var part_path = uri.substring(index+11);
    //alert(part_path);
    //alert(uri.name);
    //alert(uri.path);
    

        // var path = 'cdvfile://localhost/sdcard/'+part_path;//<file-system-name>/<path-to-file>' 
    
    }
    else
    {
        content = 0;
        // var path = uri;
        
    }
    var path = uri;
    //var path = uri;
    //alert(path);
    //          Examples: 'cdvfile://localhost/sdcard/path/to/global/file'
    //                    'cdvfile://localhost/cache/onlyVisibleToTheApp.txt'
    // @param cbSuccess: {function} a callback method that receives a DirectoryEntry object.
    // @param cbSuccess: {Function} a callback method that receives a FileError object.

    window.resolveLocalFileSystemURI(path, cbSuccess, cbFail);


     
     
    });
    
    return true;
}

function cbSuccess(fileEntry)
{
    //alert('Success');
    //alert(fileEntry.toURL());
    //alert(fileEntry.toInternalURL());

    

    if(content == 0){
        function win(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("read success");
            console.log(evt.target.result);
            var myJson = JSON.parse(evt.target.result);
            populate_db_from_json(myJson);
            //alert(myJson.name);
        };
        reader.readAsText(file);
        };

        var fail = function(evt) {
            console.log(error.code);
        };
        fileEntry.file(win, fail);
    }
    else
    {
        content = 0;
        window.resolveLocalFileSystemURI(fileEntry.toURL(), cbSuccess, cbFail);
    }
    



}

function cbFail(FileError)
{
    alert('Fail');
}