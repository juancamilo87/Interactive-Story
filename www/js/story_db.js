version = '1.1';

////yifei added here
var story_log_json = null;
var interaction_log_json = null;
////

document.addEventListener("deviceready", onDeviceReady, false);
var db;
function onDeviceReady() {
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
    }
    else
    {
        console.log('DB version outdated, DB will be re generated');
        db.transaction(dropDB, errorCB, successdropCB);
        
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
    
    ////Create tables related to logs(Yifei)
    tx.executeSql('CREATE TABLE story_log (action TEXT, status INTEGER, chapter_id INTEGER, story_id INTEGER, timestamp TEXT, PRIMARY KEY(chapter_id, story_id, timestamp))');
    tx.executeSql('CREATE TABLE interaction_log (interaction_type TEXT, interaction_id INTEGER, interaction_status INTEGER, timestamp TEXT, PRIMARY KEY(interaction_type, interation_id, timestamp))');
    ////
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
}


// Transaction error callback
function errorCB(err) {
console.log("Error processing SQL: " + err.code);
}

// Success callback
function successCB() {
    window.localStorage.setItem('runned', '1'); 
    console.log('Succesfully populated DB');
}

// Success callback
function successdropCB() {
    console.log('Regenerating DB');
    db.transaction(populateDB, errorCB, successCB);
}



//// Function for submitting logs on-line by users; Send to server Not finished yet(Yifei)
function submit_logs(tx){
    ////Get story logs and interaction logs, then combine them together. 
    tx.executeSql('select * from story_log', [], success_get_story_log);
    tx.executeSql('select * from interaction_log', [], success_get_interaction_log);
    ////use story_log to merge interaction_log, just send story_log_json
    $.extend(story_log_json, interaction_log_json);
    
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
