var theMessage;
var mimeType;
var story;

function startNFCInteraction(story_id, message)
{
    theMessage = message;
    story = story_id;
    mimeType = "text/is";
    nfc.addMimeTypeListener(mimeType, onNFC,onNFCSuccess,onNFCFailure);
    //nfc.addNdefListener(onNFC, onNFCSuccess, onNFCFailure);
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
    }*/
    //Read nfc message and compare
    console.log(JSON.stringify(nfcEvent.tag));
    var payload_story = nfcEvent.tag.ndefMessage[0].payload;
    //If from mimetype without substring
    var text_story = nfc.bytesToString(payload_story);
    var payload_message = nfcEvent.tag.ndefMessage[1].payload;
    var text_code = nfc.bytesToString(payload_message).substring(3);
    console.log(text_code);
    console.log(theMessage);

    if(text_story != story)
    {
        alert("Incorrect story");
    }
    else if(text_code != theMessage)
    {
        alert("Incorrect tag");
    }
    else
    {
        alert("Correct tag");
        nfc.removeMimeTypeListener(mimeType, onNFC);
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
    alert("Failed to add NDEF listener");
}

function onWriteSuccess(result)
{
    console.log("NFC tag written");
}

function onWriteFailure(reason)
{
    alert("Failed writing NFC tag");
}
