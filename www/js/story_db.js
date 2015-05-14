version = '1.0';

////yifei added here
var story_log_json = null;
var interaction_log_json = null;
var current_story_json = null;
////

document.addEventListener("deviceready", onDeviceReady, false);
var db;
function onDeviceReady() {
    //startNFCInteraction("a story", "This is the code");
    db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    var firstrun = window.localStorage.getItem('runned'); 
    if ( firstrun == null ) {
        console.log('First Run: proceed to create DB');
        db.transaction(populateDB, errorCB, successCB);
    }
    else {
        db.transaction(function(tx){
            tx.executeSql('SELECT * FROM versions', [], successVersion);
        }, errorCB);        
    }
}

function successVersion(tx, res){
    var real_version = res.rows.item(0).version;
    if(real_version == version)
    {
        console.log('Version up to date. DB version: ' + real_version);
        // if(window.localStorage.getItem('runned')=='0')
        // {
        //     app.populateDb(db);
        // }
    }
    else
    {
        console.log('DB version outdated, DB will be re generated');
        db.transaction(dropDB, errordropCB, successdropCB);
        
    }
}

// create tables
function populateDB(tx) {
    console.log('populating');
    tx.executeSql('CREATE TABLE authors (author_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, lastname TEXT, email TEXT, website TEXT)');
    tx.executeSql('CREATE TABLE stories (story_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, author_id INTEGER NOT NULL, FOREIGN KEY(author_id) REFERENCES authors(author_id) ON DELETE CASCADE)');
    tx.executeSql('CREATE TABLE chapters (chapter_id INTEGER PRIMARY KEY AUTOINCREMENT, story_id INTEGER NOT NULL, number INTEGER NOT NULL, name TEXT NOT NULL, body TEXT, video_path TEXT, image_path TEXT, audio_path TEXT, interaction_id INTEGER, instructions TEXT, UNIQUE(story_id, number), FOREIGN KEY(story_id) REFERENCES stories(story_id) ON DELETE CASCADE, FOREIGN KEY(interaction_id) REFERENCES interactions(interaction_id) ON DELETE CASCADE)');
    tx.executeSql('CREATE TABLE interactions (interaction_id INTEGER PRIMARY KEY AUTOINCREMENT, interaction_type INTEGER NOT NULL, nfc_id INTEGER, qr_id INTEGER, gps_id INTEGER, spell_id INTEGER, quiz_id INTEGER, FOREIGN KEY(interaction_type) REFERENCES interaction_types(id) ON DELETE CASCADE, FOREIGN KEY(nfc_id) REFERENCES nfc(nfc_id) ON DELETE CASCADE, FOREIGN KEY(qr_id) REFERENCES qr(qr_id) ON DELETE CASCADE, FOREIGN KEY(gps_id) REFERENCES gps(gps_id) ON DELETE CASCADE, FOREIGN KEY(spell_id) REFERENCES spell(spell_id) ON DELETE CASCADE, FOREIGN KEY(quiz_id) REFERENCES quiz(quiz_id) ON DELETE CASCADE, CHECK((nfc_id is NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NOT NULL) OR (nfc_id is NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NOT NULL AND quiz_id is NULL) OR (nfc_id is NULL AND qr_id is NULL AND gps_id is NOT NULL AND spell_id is NULL AND quiz_id is NULL) OR (nfc_id is NULL AND qr_id is NOT NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NULL) OR (nfc_id is NOT NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NULL)))');
    tx.executeSql('CREATE TABLE interaction_types (id INTEGER PRIMARY KEY AUTOINCREMENT, synonym TEXT UNIQUE NOT NULL, table_name TEXT UNIQUE NOT NULL)');
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['NFC', 'nfc']);
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['QR', 'qr']);
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['GPS', 'gps']);
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['Spell Check', 'spell']);
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['Quiz', 'quiz']);
    tx.executeSql('CREATE TABLE nfc (nfc_id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT NOT NULL, instructions TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');
    tx.executeSql('CREATE TABLE qr (qr_id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT NOT NULL, instructions TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');
    tx.executeSql('CREATE TABLE gps (gps_id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL NOT NULL, longitude REAL NOT NULL, instructions TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');
    tx.executeSql('CREATE TABLE spell (spell_id INTEGER PRIMARY KEY AUTOINCREMENT, phrase TEXT NOT NULL, instructions TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');
    tx.executeSql('CREATE TABLE quiz (quiz_id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, correct_answer TEXT NOT NULL, answer_1 TEXT NOT NULL, answer_2 TEXT NOT NULL, answer_3 TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');             
    tx.executeSql('CREATE TABLE versions (version TEXT)');
    tx.executeSql('INSERT INTO versions (version) VALUES (?)', [version]);
    
    // ////Create tables related to logs(Yifei)
    // tx.executeSql('CREATE TABLE story_log (log_id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT, status INTEGER, chapter_id INTEGER, story_id INTEGER, timestamp TEXT)');
    // tx.executeSql('CREATE TABLE interaction_log (log_id INTEGER PRIMARY KEY AUTOINCREMENT, interaction_type TEXT, interaction_id INTEGER, interaction_status INTEGER, timestamp TEXT)');
    // ////
    // console.log('finished yifie');
}

// create tables
function dropDB(tx) {
    console.log('dropping');
    tx.executeSql('DROP TABLE IF EXISTS authors');
    tx.executeSql('DROP TABLE IF EXISTS stories');
    tx.executeSql('DROP TABLE IF EXISTS chapters');
    tx.executeSql('DROP TABLE IF EXISTS interactions');
    tx.executeSql('DROP TABLE IF EXISTS interaction_types');
    tx.executeSql('DROP TABLE IF EXISTS nfc');
    tx.executeSql('DROP TABLE IF EXISTS qr');
    tx.executeSql('DROP TABLE IF EXISTS gps');
    tx.executeSql('DROP TABLE IF EXISTS spell');
    tx.executeSql('DROP TABLE IF EXISTS quiz');
    tx.executeSql('DROP TABLE IF EXISTS versions');
    // tx.executeSql('DROP TABLE IF EXISTS story_log');
    // tx.executeSql('DROP TABLE IF EXISTS interaction_log');
}


// Transaction error callback
function errorCB(err) {
console.log("Error processing SQL: " + err.message);
}

// Success callback
function successCB() {
    //window.localStorage.setItem('runned', '1'); 
    console.log('Succesfully populated DB');
    //app.populateDb(db);
}

function errordropCB(err) {
console.log("Error droping SQL: " + err.message);
}

// Success callback
function successdropCB() {
    window.localStorage.setItem('runned', '0'); 
    console.log('Regenerating DB');
    db.transaction(populateDB, errorCB, successCB);
}



//// Function for submitting logs on-line by users; Send to server Not finished yet(Yifei)
function submit_logs(tx){
    ////Get story logs and interaction logs, then combine them together. 
    /*tx.executeSql('select * from story_log', [], success_get_story_log);
    tx.executeSql('select * from interaction_log', [], success_get_interaction_log);
    ////use story_log to merge interaction_log, just send story_log_json
    $.extend(story_log_json, interaction_log_json);*/
	
	alert("function called");
    
    ////Send logs to server by HTTP, needed to be implement
    
}


//// Call back function, return query results of story logs (Yifei)
function success_get_story_log(tx, res){
    var jsonObject = {};
    for (var i = 0; i < res.rows.length; i ++){
        var a = res.rows.item(i)["action"];
        var s = res.rows.item(i)["status"];
        var c_i = res.rows.item(i)["chapter_id"];
        var s_i = res.rows.item(i)["story_id"];
        var t = res.rows.item(i)["timestamp"];
        var each_item = {"action": a, "status": s, "chapter_id": c_i, "story_id": s_i, "timestamp": t};
        jsonObject["story_log"].push(each_item);
    }
    story_log_json = jsonObject;    
}

//// Call back function, return query results of interaction logs (Yifei)
function success_get_interaction_log(tx, res){
    var jsonObject = {};
    for (var i = 0; i < res.rows.length; i ++){
        var i_t = res.rows.item(i)["interaction_type"];
        var i_i = res.rows.item(i)["interaction_id"];
        var i_s = res.rows.item(i)["interaction_status"];
        var t = res.rows.item(i)["timestamp"];
        var each_item = {"interaction_type": a, "interaction_id": s, "interaction_status": c, "timestamp": t};
        jsonObject["interaction_log"].push(each_item);
    }
    interaction_log_json = jsonObject;
}


////logs for story (Yifei)
function story_log(tx, action, status, chapter_id, story_id){
    var timestamp = Date.now();
    tx.execute('INSERT INTO story_log (action, status, chapter_id, story_id, timestamp) VALUES (?,?,?,?)', [action, status, chapter_id, story_id, timestamp]);
}

////logs for interaction (Yifei)
function interaction_log(tx, interaction_type, interaction_id, interaction_status){
    var timestamp = Date.now();
    tx.execute('INSERT INTO interaction_log (interaction_type, interaction_id, interaction_status, timestamp) VALUES (?,?,?,?)', [interaction_type, interaction_id, interaction_status, timestamp]);
}

function populate_db_from_json(story_json)
{
    current_story_json = story_json;
    db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    db.transaction(populateFromJsonDB, errorJsonCB, successJsonCB);
    

    
}

function populateFromJsonDB(tx)
{
    //populating authors.
    var story_json = current_story_json;


    var authorJson = story_json.author;

    tx.executeSql("INSERT INTO authors (author_id, name, lastname, email, website) VALUES (?,?,?,?,?)", [authorJson.author_id, authorJson.name, authorJson.lastname, authorJson.email, authorJson.website]);

    //populating the stories
    //$.each(story_json, function(idx, obj) {  
    tx.executeSql("INSERT INTO stories (story_id, name, description, author_id) VALUES (?,?,?,?)", [story_json.story_id, story_json.name, story_json.description, authorJson.author_id]);
    //        });

    //populsting the chapters.
    var chaptersJson = story_json.chapters;

    $.each(chaptersJson, function(idx, objChapter) {
        if(objChapter.interaction != null)
        {
            var inter_type = objChapter.interaction.type;

            if( inter_type == "1" ) {
                tx.executeSql("INSERT INTO nfc (nfc_id, info, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.interaction.id, objChapter.interaction.info, objChapter.interaction.instructions, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,objChapter.interaction.feedbackurl_right,objChapter.interaction.feedbackurl_wrong]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, nfc_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);  
            } else if ( inter_type == "2" ) {
                tx.executeSql("INSERT INTO qr (qr_id, info, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.interaction.id, objChapter.interaction.info, objChapter.interaction.instructions, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,objChapter.interaction.feedbackurl_right,objChapter.interaction.feedbackurl_wrong]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, qr_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);
            } else if (inter_type == "3") {
                tx.executeSql("INSERT INTO gps (gps_id, latitude, longitude, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?,?)", [objChapter.interaction.id,objChapter.interaction.latitude,objChapter.interaction.longitude, objChapter.interaction.instructions, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,objChapter.interaction.feedbackurl_right,objChapter.interaction.feedbackurl_wrong]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, gps_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);  
            } else if (inter_type == "4") { 
                tx.executeSql("INSERT INTO spell (spell_id, phrase, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.interaction.id, objChapter.interaction.phrase, objChapter.interaction.instructions, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,objChapter.interaction.feedbackurl_right,objChapter.interaction.feedbackurl_wrong]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, spell_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);  
            } else if (inter_type == "5") {
                tx.executeSql("INSERT INTO quiz (quiz_id, question, correct_answer, answer_1, answer_2, answer_3, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?,?,?,?)", [objChapter.interaction.id, objChapter.interaction.question, objChapter.interaction.correct_answer, objChapter.interaction.answer_1, objChapter.interaction.answer_2, objChapter.interaction.answer_3, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,objChapter.interaction.feedbackurl_right,objChapter.interaction.feedbackurl_wrong]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, quiz_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);  
            }
            
            var int_id = objChapter.interaction.interaction_id;
            tx.executeSql("INSERT INTO chapters (chapter_id, story_id, number, name, body, video_path, image_path, audio_path, interaction_id, instructions) VALUES (?,?,?,?,?,?,?,?,?,?)", [objChapter.chapter_id, story_json.story_id, objChapter.number, objChapter.name, objChapter.body, objChapter.video_url, objChapter.image_url, objChapter.audio_url, int_id, objChapter.instructions]);  
        }
        else
        {
         tx.executeSql("INSERT INTO chapters (chapter_id, story_id, number, name, body, video_path, image_path, audio_path, instructions) VALUES (?,?,?,?,?,?,?,?,?)", [objChapter.chapter_id, story_json.story_id, objChapter.number, objChapter.name, objChapter.body, objChapter.video_url, objChapter.image_url, objChapter.audio_url]);     
        }


        //tx.executeSql("INSERT INTO interactions (story_id, number, name, body, video_path, image_path, audio_path, interaction_id) VALUES (?,?,?,?,?,?,?,?)", [objChapter.story_id, objChapter.story_id, objChapter.name, objChapter.body, objChapter.video_url,objChapter.image_url,objChapter.audio_url,objChapter.int_id]);  

        
    });
}

function successJsonCB() 
{
    alert('success');
}

function errorJsonCB(err)
{
    alert("Error populating from JSON: " + err.message);
}