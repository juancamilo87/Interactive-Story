version = '1.1.2';

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
    tx.executeSql('CREATE TABLE authors (author_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, name TEXT, lastname TEXT, email TEXT, website TEXT)');
    tx.executeSql('CREATE TABLE stories (story_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, name TEXT NOT NULL, description TEXT, author_id INTEGER NOT NULL, FOREIGN KEY(author_id) REFERENCES authors(author_id) ON DELETE CASCADE)');
    tx.executeSql('CREATE TABLE chapters (chapter_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, story_id INTEGER NOT NULL, number INTEGER NOT NULL, name TEXT NOT NULL, body TEXT, video_path TEXT, image_path TEXT, audio_path TEXT, interaction_id INTEGER, instructions TEXT, UNIQUE(story_id, number) ON CONFLICT REPLACE, FOREIGN KEY(story_id) REFERENCES stories(story_id) ON DELETE CASCADE, FOREIGN KEY(interaction_id) REFERENCES interactions(interaction_id) ON DELETE CASCADE)');
    tx.executeSql('CREATE TABLE interactions (interaction_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, interaction_type INTEGER NOT NULL, nfc_id INTEGER, qr_id INTEGER, gps_id INTEGER, spell_id INTEGER, quiz_id INTEGER, FOREIGN KEY(interaction_type) REFERENCES interaction_types(id) ON DELETE CASCADE, FOREIGN KEY(nfc_id) REFERENCES nfc(nfc_id) ON DELETE CASCADE, FOREIGN KEY(qr_id) REFERENCES qr(qr_id) ON DELETE CASCADE, FOREIGN KEY(gps_id) REFERENCES gps(gps_id) ON DELETE CASCADE, FOREIGN KEY(spell_id) REFERENCES spell(spell_id) ON DELETE CASCADE, FOREIGN KEY(quiz_id) REFERENCES quiz(quiz_id) ON DELETE CASCADE, CHECK((nfc_id is NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NOT NULL) OR (nfc_id is NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NOT NULL AND quiz_id is NULL) OR (nfc_id is NULL AND qr_id is NULL AND gps_id is NOT NULL AND spell_id is NULL AND quiz_id is NULL) OR (nfc_id is NULL AND qr_id is NOT NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NULL) OR (nfc_id is NOT NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NULL)))');
    tx.executeSql('CREATE TABLE interaction_types (id INTEGER PRIMARY KEY ON CONFLICT REPLACE, synonym TEXT UNIQUE NOT NULL ON CONFLICT REPLACE, table_name TEXT UNIQUE NOT NULL ON CONFLICT REPLACE)');
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['GPS', 'gps']);
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['NFC', 'nfc']);
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['QR', 'qr']);
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['Quiz', 'quiz']);
    tx.executeSql('INSERT INTO interaction_types (synonym, table_name) VALUES (?,?)', ['Spell Check', 'spell']);
    tx.executeSql('CREATE TABLE nfc (nfc_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, info TEXT NOT NULL, instructions TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');
    tx.executeSql('CREATE TABLE qr (qr_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, info TEXT NOT NULL, instructions TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');
    tx.executeSql('CREATE TABLE gps (gps_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, latitude REAL NOT NULL, longitude REAL NOT NULL, instructions TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');
    tx.executeSql('CREATE TABLE spell (spell_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, phrase TEXT NOT NULL, instructions TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');
    tx.executeSql('CREATE TABLE quiz (quiz_id INTEGER PRIMARY KEY ON CONFLICT REPLACE, question TEXT NOT NULL, correct_answer TEXT NOT NULL, answer_1 TEXT NOT NULL, answer_2 TEXT NOT NULL, answer_3 TEXT NOT NULL, feedback_right TEXT, feedback_wrong TEXT, audiopath_right TEXT, audiopath_wrong TEXT)');             
    tx.executeSql('CREATE TABLE versions (version TEXT)');
    tx.executeSql('INSERT INTO versions (version) VALUES (?)', [version]);
    
    ////Create tables related to logs(Yifei)
    tx.executeSql('CREATE TABLE story_log (log_id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT, status INTEGER, chapter_id INTEGER, story_id INTEGER, timestamp TEXT)');
    tx.executeSql('CREATE TABLE interaction_log (log_id INTEGER PRIMARY KEY AUTOINCREMENT, interaction_type TEXT, interaction_id INTEGER, interaction_status INTEGER, timestamp TEXT)');
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
    tx.executeSql('DROP TABLE IF EXISTS story_log');
    tx.executeSql('DROP TABLE IF EXISTS interaction_log');
}


// Transaction error callback
function errorCB(err) {
console.log("Error processing SQL: " + err.message);
}

// Success callback
function successCB() {
    window.localStorage.setItem('runned', '1'); 
    console.log('Succesfully populated DB');
    //app.populateDb(db);
}

function errordropCB(err) {
console.log("Error droping SQL: " + err.message);
}

// Success callback
function successdropCB() {
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
    db.transaction(populateFromJsonDB, errorJsonCBstories, successJsonCBstories);
    

    
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

        //Start download of urls
        //var fileName = url.substring(url.lastIndexOf('/')+1);
        
        var video_name;
        if(objChapter.video_url != null)
        {
            video_name = objChapter.video_url.substring(objChapter.video_url.lastIndexOf('/')+1);
        }
        var image_name;
        if(objChapter.image_url != null)
        {
            image_name = objChapter.image_url.substring(objChapter.image_url.lastIndexOf('/')+1);
        }
        var audio_name;
        if(objChapter.audio_url != null)
        {
            audio_name = objChapter.audio_url.substring(objChapter.audio_url.lastIndexOf('/')+1);
        }

        if(objChapter.video_url != null)
        {
            download_file(objChapter.video_url, story_json.story_id, objChapter.number, 0,0);
        }
        if(objChapter.image_url != null)
        {
            download_file(objChapter.image_url, story_json.story_id, objChapter.number, 1,0);
        }
        if(objChapter.audio_url != null)
        {
            download_file(objChapter.audio_url, story_json.story_id, objChapter.number, 2,0);
        }


        if(objChapter.interaction != null)
        {
            //Start download of interaction urls

            var feedback_right_name = null;
            if(objChapter.interaction.feedbackurl_right != null)
            {
                feedback_right_name = objChapter.interaction.feedbackurl_right.substring(objChapter.interaction.feedbackurl_right.lastIndexOf('/')+1);
            }

            var feedback_wrong_name;
            if(objChapter.interaction.feedbackurl_wrong != null)
            {
                feedback_wrong_name = objChapter.interaction.feedbackurl_wrong.substring(objChapter.interaction.feedbackurl_wrong.lastIndexOf('/')+1);;
            }

            if(objChapter.interaction.feedbackurl_right != null)
            {
                download_file(objChapter.interaction.feedbackurl_right, story_json.story_id, objChapter.number, 0,1);
            }
            if(objChapter.interaction.feedbackurl_wrong != null)
            {
                download_file(objChapter.interaction.feedbackurl_wrong, story_json.story_id, objChapter.number, 1,1);
            }
            var inter_type = objChapter.interaction.type;

            if( inter_type == "2" ) {
                tx.executeSql("INSERT INTO nfc (nfc_id, info, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.interaction.id, objChapter.interaction.info, objChapter.interaction.instructions, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,feedback_right_name,feedback_wrong_name]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, nfc_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);  
            } else if ( inter_type == "3" ) {
                tx.executeSql("INSERT INTO qr (qr_id, info, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.interaction.id, objChapter.interaction.info, objChapter.interaction.instructions, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,feedback_right_name,feedback_wrong_name]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, qr_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);
            } else if (inter_type == "1") {
                tx.executeSql("INSERT INTO gps (gps_id, latitude, longitude, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?,?)", [objChapter.interaction.id,objChapter.interaction.latitude,objChapter.interaction.longitude, objChapter.interaction.instructions, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,feedback_right_name,feedback_wrong_name]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, gps_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);  
            } else if (inter_type == "5") { 
                tx.executeSql("INSERT INTO spell (spell_id, phrase, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.interaction.id, objChapter.interaction.phrase, objChapter.interaction.instructions, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,feedback_right_name,feedback_wrong_name]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, spell_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);  
            } else if (inter_type == "4") {
                tx.executeSql("INSERT INTO quiz (quiz_id, question, correct_answer, answer_1, answer_2, answer_3, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?,?,?,?)", [objChapter.interaction.id, objChapter.interaction.question, objChapter.interaction.correct_answer, objChapter.interaction.answer_1, objChapter.interaction.answer_2, objChapter.interaction.answer_3, objChapter.interaction.feedback_right, objChapter.interaction.feedback_wrong,feedback_right_name,feedback_wrong_name]);  
                tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, quiz_id) VALUES (?,?,?)", [objChapter.interaction.interaction_id, objChapter.interaction.type, objChapter.interaction.id]);  
            }
            
            var int_id = objChapter.interaction.interaction_id;
            tx.executeSql("INSERT INTO chapters (chapter_id, story_id, number, name, body, video_path, image_path, audio_path, interaction_id, instructions) VALUES (?,?,?,?,?,?,?,?,?,?)", [objChapter.chapter_id, story_json.story_id, objChapter.number, objChapter.name, objChapter.body, video_name, image_name, audio_name, int_id, objChapter.instructions]);  
        }
        else
        {
         tx.executeSql("INSERT INTO chapters (chapter_id, story_id, number, name, body, video_path, image_path, audio_path, instructions) VALUES (?,?,?,?,?,?,?,?,?)", [objChapter.chapter_id, story_json.story_id, objChapter.number, objChapter.name, objChapter.body, video_name, image_name, audio_name]);     
        }


        //tx.executeSql("INSERT INTO interactions (story_id, number, name, body, video_path, image_path, audio_path, interaction_id) VALUES (?,?,?,?,?,?,?,?)", [objChapter.story_id, objChapter.story_id, objChapter.name, objChapter.body, objChapter.video_url,objChapter.image_url,objChapter.audio_url,objChapter.int_id]);  

        
    });
}

function successJsonCBstories() 
{
    alert('Story succesfully loaded');
}

function errorJsonCBstories(err)
{
    alert("Error loading story, verify the file has the appropriate format");
}

function download_stories()
{
    $.ajax({
          type: "GET",
          dataType: "text",
          url: "http://memoryhelper.netne.net/interactivestory/index.php/stories/get_all_stories",
          success: function( data ) {
            var new_data = data.split('<!-- Hosting24 Analytics Code -->');

            data = '{"stories": ' + new_data[0] + "}";
            jsonObject = JSON.parse(data);

            //console.log(JSON.stringify(jsonObject));
            allStories = jsonObject.stories;
            populate_db_from_json_online(allStories);
            

            //Iterate over stories to get internal JSON
            //Call populate_db_from_json(story_json) with the internal JSON
            },
          error: function(data, textStatus, errorThrown) {
                console.log('Error');
                console.log('Data: ' + data);
                console.log('Status: ' + textStatus);
                console.log('Error: ' + errorThrown);
            }
    });
}

function populate_db_from_json_online(story_json)
{
    current_story_json = story_json;
    db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    db.transaction(populateFromJsonDBOnline, errorJsonCBstoriesOnline, successJsonCBstoriesOnline);
    

    
}

function populateFromJsonDBOnline(tx)
{
    for(var i=0;i<current_story_json.length;i++){
                //console.log(i+"");
                var story_json = current_story_json[i];
                // if(story_json.story_id=='30')
                // {
                    //populating authors.
                    console.log("Story "+i);
                    console.log("authors length: "+ story_json.authors.length);
                    if(0 <story_json.authors.length)
                    {
                        var authorJson = story_json.authors[0];

                        tx.executeSql("INSERT INTO authors (author_id, name, lastname, email, website) VALUES (?,?,?,?,?)", [authorJson.author_id, authorJson.first_name, authorJson.last_name, authorJson.email, authorJson.website]);    

                        //populating the stories
                        tx.executeSql("INSERT INTO stories (story_id, name, description, author_id) VALUES (?,?,?,?)", [story_json.story_id, story_json.story_title, story_json.story_summary, authorJson.author_id]);

                        //populating the chapters.
                        var chaptersJson = story_json.chapters;

                        $.each(chaptersJson, function(idx, objChapter) {

                            //Start download of urls
                            //var fileName = url.substring(url.lastIndexOf('/')+1);
                            
                            var video_name = null;
                            if(objChapter.video_url != null && objChapter.video_url != "null" && objChapter.video_url != "")
                            {
                                video_name = objChapter.video_url.substring(objChapter.video_url.lastIndexOf('/')+1);
                                download_file(objChapter.video_url, story_json.story_id, objChapter.number, 0,0);
                            }
                            var image_name = null;
                            if(objChapter.image_url != null && objChapter.image_url != "null" && objChapter.image_url != "")
                            {
                                image_name = objChapter.image_url.substring(objChapter.image_url.lastIndexOf('/')+1);
                                download_file(objChapter.image_url, story_json.story_id, objChapter.number, 1,0);
                            }
                            var audio_name = null;
                            if(objChapter.audio_url != null && objChapter.audio_url != "null" && objChapter.audio_url != "")
                            {
                                audio_name = objChapter.audio_url.substring(objChapter.audio_url.lastIndexOf('/')+1);
                                download_file(objChapter.audio_url, story_json.story_id, objChapter.number, 2,0);
                            }

                            if(objChapter.interaction_id != null)
                            {
                                //Start download of interaction urls

                                var feedback_right_name = null;
                                if(objChapter.positive_audio_url != null && objChapter.positive_audio_url != "null" && objChapter.positive_audio_url != "")
                                {
                                    feedback_right_name = objChapter.positive_audio_url.substring(objChapter.positive_audio_url.lastIndexOf('/')+1);
                                    download_file(objChapter.positive_audio_url, story_json.story_id, objChapter.number, 0,1);
                                }

                                var feedback_wrong_name = null;
                                if(objChapter.negative_audio_url != null && objChapter.negative_audio_url != "null" && objChapter.negative_audio_url != "")
                                {
                                    feedback_wrong_name = objChapter.negative_audio_url.substring(objChapter.negative_audio_url.lastIndexOf('/')+1);;
                                    download_file(objChapter.negative_audio_url, story_json.story_id, objChapter.number, 1,1);
                                }

                                var inter_type = objChapter.interaction_type;

                                if( inter_type == "2" ) {
                                    tx.executeSql("INSERT INTO nfc (nfc_id, info, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.nfc_id, "This is the correct tag.", objChapter.instructions, objChapter.positive_feedback, objChapter.negative_feedback,feedback_right_name,feedback_wrong_name]);  
                                    // tx.executeSql("INSERT INTO nfc (nfc_id, info, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.nfc_id, objChapter.info, objChapter.instructions, objChapter.positive_feedback, objChapter.negative_feedback,feedback_right_name,feedback_wrong_name]);  
                                    tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, nfc_id) VALUES (?,?,?)", [objChapter.interaction_id, objChapter.interaction_type, objChapter.nfc_id]);  
                                } else if ( inter_type == "3" ) {
                                    tx.executeSql("INSERT INTO qr (qr_id, info, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.qr_id, objChapter.info, objChapter.instructions, objChapter.positive_feedback, objChapter.negative_feedback,feedback_right_name,feedback_wrong_name]);  
                                    tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, qr_id) VALUES (?,?,?)", [objChapter.interaction_id, objChapter.interaction_type, objChapter.qr_id]);
                                } else if (inter_type == "1") {
                                    tx.executeSql("INSERT INTO gps (gps_id, latitude, longitude, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?,?)", [objChapter.gps_id, objChapter.latitude, objChapter.longitude, objChapter.instructions, objChapter.positive_feedback, objChapter.negative_feedback, feedback_right_name, feedback_wrong_name]);  
                                    tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, gps_id) VALUES (?,?,?)", [objChapter.interaction_id, objChapter.interaction_type, objChapter.gps_id]);  
                                } else if (inter_type == "5") { 
                                    tx.executeSql("INSERT INTO spell (spell_id, phrase, instructions, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?)", [objChapter.spell_id, objChapter.phrase, objChapter.instructions, objChapter.positive_feedback, objChapter.negative_feedback,feedback_right_name,feedback_wrong_name]);  
                                    tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, spell_id) VALUES (?,?,?)", [objChapter.interaction_id, objChapter.interaction_type, objChapter.spell_id]);  
                                } else if (inter_type == "4") {
                                    tx.executeSql("INSERT INTO quiz (quiz_id, question, correct_answer, answer_1, answer_2, answer_3, feedback_right, feedback_wrong, audiopath_right, audiopath_wrong) VALUES (?,?,?,?,?,?,?,?,?,?)", [objChapter.quiz_id, objChapter.question, objChapter.correct_answer, objChapter.answer_1, objChapter.answer_2, objChapter.answer_3, objChapter.positive_feedback, objChapter.negative_feedback,feedback_right_name,feedback_wrong_name]);  
                                    tx.executeSql("INSERT INTO interactions (interaction_id, interaction_type, quiz_id) VALUES (?,?,?)", [objChapter.interaction_id, objChapter.interaction_type, objChapter.quiz_id]);  
                                }
                                
                                var int_id = objChapter.interaction_id;
                                tx.executeSql("INSERT INTO chapters (chapter_id, story_id, number, name, body, video_path, image_path, audio_path, interaction_id, instructions) VALUES (?,?,?,?,?,?,?,?,?,?)", [objChapter.chapter_id, story_json.story_id, objChapter.number, objChapter.title, objChapter.text, video_name, image_name, audio_name, int_id, objChapter.instructions]);  
                            }
                            else
                            {
                             tx.executeSql("INSERT INTO chapters (chapter_id, story_id, number, name, body, video_path, image_path, audio_path, instructions) VALUES (?,?,?,?,?,?,?,?,?)", [objChapter.chapter_id, story_json.story_id, objChapter.number, objChapter.title, objChapter.text, video_name, image_name, audio_name]);     
                            }

                        });
                        console.log("Story "+i+" loaded");
                    }
                    else
                    {
                        console.log("Story "+i+" not loaded story");
                        //throw "No author so no story stored";
                    }
                // }
                
    }
    
    
}

function successJsonCBstoriesOnline() 
{
    console.log('One story succesfully loaded');
    alert('Stories succesfully downloaded');
}

function errorJsonCBstoriesOnline(err)
{
    console.log('Error: ' + err);
    console.log('Error Message: ' + err.message);
    console.log('Error Code: ' + err.code);
    alert('Error downloading stories, please verify your internet connection and try again.');
}