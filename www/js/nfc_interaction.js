var theMessage;
var mimeType;
var id;
var result;

var nfcButton;

function startNFCInteraction(interaction_id)
{
    result = 0;
    id = interaction_id
    db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM interactions WHERE interaction_id='"+interaction_id+"'", [], function(tx, res){
            var new_id = res.rows.item(0).nfc_id;
                table = 'nfc';

            if(new_id != null)
            {
                tx.executeSql('SELECT * FROM '+table+" WHERE "+ table+"_id='"+new_id+"'", [], function(tx, res){
                   
                    theMessage = res.rows.item(0).info;

                    mimeType = "text/is";
                    nfc.addMimeTypeListener(mimeType, onNFC,onNFCSuccess,onNFCFailure);
                    //nfc.addNdefListener(onNFC, onNFCSuccess, onNFCFailure);


                    nfcButton = document.getElementById('nfcButton');
                    nfcButton.innerHTML = "Reading..."
                    nfcButton.onclick = function(){};






                });
            }   
        });

    }, errorCB);  
    
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
        //alert("Incorrect tag, try again...");
        nfc.removeMimeTypeListener(mimeType, onNFC);
        nfcButton.innerHTML = "Start NFC reading";
        nfcButton.onclick = function(){
            startNFCInteraction(id);
        };

        give_feedback(id, result);
        //tempFailure();
    }
    else
    {
        //alert("Congratulations! Correct tag!");
        nfc.removeMimeTypeListener(mimeType, onNFC);
        nfcButton.innerHTML = "Start NFC reading";
        nfcButton.onclick = function(){
            startNFCInteraction(id);
        };
        result = 1;
        //next_chapter();
        give_feedback(id, result);
        //tempSuccess();
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