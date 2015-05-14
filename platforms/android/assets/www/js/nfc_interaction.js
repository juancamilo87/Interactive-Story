var theMessage;
var mimeType;
var story;
var id;
var result;

var nfcButton;

function startNFCInteraction(interaction_id, story_id, message)
{
    result = 0;
    id = interaction_id;
    theMessage = message;
    story = story_id;
    mimeType = "text/is";
    nfc.addMimeTypeListener(mimeType, onNFC,onNFCSuccess,onNFCFailure);
    //nfc.addNdefListener(onNFC, onNFCSuccess, onNFCFailure);


    nfcButton = document.getElementById('nfcButton');
    nfcButton.innerHTML = "Reading..."
    nfcButton.onclick = function(){};
}

function onNFC(nfcEvent)
{
    /*
    if(nfcEvent.type == 'ndef')
    {
        console.log('writing');
        //,nfc.stringToBytes(theMessage)
        var mimeRecord = ndef.mimeMediaRecord(mimeType, story);
        var message = [
        mimeRecord,
        ndef.textRecord(theMessage)
        ];
        nfc.write(message, onWriteSuccess, onWriteFailure);
    }
    */
    //Read nfc message and compare
    console.log(JSON.stringify(nfcEvent.tag));
    var payload_story = nfcEvent.tag.ndefMessage[0].payload;
    //If from mimetype without substring
    var text_story = nfc.bytesToString(payload_story);
    var payload_message = nfcEvent.tag.ndefMessage[1].payload;
    var text_code = nfc.bytesToString(payload_message).substring(3);
    //console.log(text_code);
    //console.log(theMessage);

    /*if(text_story != story)
    {
        alert("Incorrect story");
        give_feedback(id, result);
    }
    else */
        
    if(text_code != theMessage)
    {
        /*alert("Incorrect tag");
        give_feedback(id, result); */
        tempFailure();
    }
    else
    {
        /*result = 1;
        next_chapter();
        give_feedback(id, result);
        nfc.removeMimeTypeListener(mimeType, onNFC);*/
        tempSuccess();
    }
    
    



    //var tag = ndefEvent.tag;
    /*if(){

        alert(JSON.stringify(nfcEvent.tag));
        nfc.removeMimeTypeListener(mimeType, onNFC,onNFCSuccess,onNFCFailure);
    }
    else(alert(JSON.stringify(nfcEvent.tag)))
    {
        
    }*/

    
    
}

function onNFCSuccess(result)
{
    console.log("Listening for NFC Messages");
}

function onNFCFailure(reason)
{
    alert("Failed to add Mymetype listener");
}

function onWriteSuccess(result)
{
    console.log("NFC tag written");
}

function onWriteFailure(reason)
{
    alert("Failed writing NFC tag");
}


function tempSuccess(){
    alert("Congratulations! Correct tag!");
    nfc.removeMimeTypeListener(mimeType, onNFC);
    nfcButton.innerHTML = "Start NFC reading";
    nfcButton.onclick = function(){
        startNFCInteraction(1,1, "This is the code");
    };
}

function tempFailure(){
    alert("Incorrect tag, try again...");
    nfc.removeMimeTypeListener(mimeType, onNFC);
    nfcButton.innerHTML = "Start NFC reading";
    nfcButton.onclick = function(){
        startNFCInteraction(1,1, "This is the code");
    };
}