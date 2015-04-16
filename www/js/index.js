/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	
    	app.populateDb();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    },
	//Populate the database
	populateDb: function() {
		
		//alert("in populate db function");
		
		var databaseName 		= "StoryEditor";
    	var databaseVersion 	= "1.0";
    	var databaseDisplayName = "StoryEditor";
    	var databaseSize 		= 25;
    	
        var db = window.openDatabase(databaseName, databaseVersion , databaseDisplayName, databaseSize);

        var temp = "";
        
        var firstrun = window.localStorage.getItem('runned'); 
        if ( firstrun == null ) {
        	
        	//alert(firstrun);
        	//alert("in if check");
        	
            console.log('First Run: proceed to create DB');
            db.transaction(app.populateDBTables, app.errorCB, app.successCB);
        }
        else {
        	//alert("in else check");
        	//alert(firstrun);
            //alert('Not the first run');
        }
	},
	populateDBTables: function(tx) {
		tx.executeSql('CREATE TABLE stories (story_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT)');
        tx.executeSql('CREATE TABLE chapters (chapter_id INTEGER PRIMARY KEY AUTOINCREMENT, story_id INTEGER NOT NULL, number INTEGER NOT NULL, name TEXT NOT NULL, body TEXT, video_path TEXT, image_path TEXT, audio_path TEXT, interaction_id INTEGER, FOREIGN KEY(story_id) REFERENCES stories(story_id) ON DELETE CASCADE, FOREIGN KEY(interaction_id) REFERENCES interaction_types(id) ON DELETE CASCADE)');
        tx.executeSql('CREATE TABLE interactions (interaction_id INTEGER PRIMARY KEY AUTOINCREMENT, interaction_type INTEGER NOT NULL, nfc_id INTEGER, qr_id INTEGER, gps_id INTEGER, spell_id INTEGER, quiz_id INTEGER, FOREIGN KEY(interaction_type) REFERENCES interaction_types(id) ON DELETE CASCADE, FOREIGN KEY(nfc_id) REFERENCES nfc(nfc_id) ON DELETE CASCADE, FOREIGN KEY(qr_id) REFERENCES qr(qr_id) ON DELETE CASCADE, FOREIGN KEY(gps_id) REFERENCES gps(gps_id) ON DELETE CASCADE, FOREIGN KEY(spell_id) REFERENCES spell(spell_id) ON DELETE CASCADE, FOREIGN KEY(quiz_id) REFERENCES quiz(quiz_id) ON DELETE CASCADE, CHECK((nfc_id is NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NOT NULL) OR (nfc_id is NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NOT NULL AND quiz_id is NULL) OR (nfc_id is NULL AND qr_id is NULL AND gps_id is NOT NULL AND spell_id is NULL AND quiz_id is NULL) OR (nfc_id is NULL AND qr_id is NOT NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NULL) OR (nfc_id is NOT NULL AND qr_id is NULL AND gps_id is NULL AND spell_id is NULL AND quiz_id is NULL)))');
        tx.executeSql('CREATE TABLE interaction_types (id INTEGER PRIMARY KEY AUTOINCREMENT, synonym TEXT UNIQUE NOT NULL)');
        tx.executeSql('INSERT INTO interaction_types (synonym) VALUES (?)', ['NFC']);
        tx.executeSql('INSERT INTO interaction_types (synonym) VALUES (?)', ['QR']);
        tx.executeSql('INSERT INTO interaction_types (synonym) VALUES (?)', ['GPS']);
        tx.executeSql('INSERT INTO interaction_types (synonym) VALUES (?)', ['Spell Check']);
        tx.executeSql('INSERT INTO interaction_types (synonym) VALUES (?)', ['Quiz']);
        tx.executeSql('CREATE TABLE nfc (nfc_id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT NOT NULL)');
        tx.executeSql('CREATE TABLE qr (qr_id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT NOT NULL)');
        tx.executeSql('CREATE TABLE gps (gps_id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL NOT NULL, longitude REAL NOT NULL)');
        tx.executeSql('CREATE TABLE spell (spell_id INTEGER PRIMARY KEY AUTOINCREMENT, phrase TEXT NOT NULL)');
        tx.executeSql('CREATE TABLE quiz (quiz_id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, correct_answer TEXT NOT NULL, answer_1 TEXT NOT NULL, answer_2 TEXT NOT NULL, answer_3 TEXT NOT NULL)');
        
        
        var chapterJson = [
		                   { 	"story_id":"1", "name":"apple chapter 1", "body" : "test body of story 1", "video_url" : "www.vidoe.com", "image_url" : "http://chooseyourownadventurebooks.org/images/write.interactive.stories.png", "audio_url" : "www.audio.com", "interaction" : "1" },
		                   { 	"story_id":"2", "name":"apple chapter 2", "body" : "test body of story 2", "video_url" : "www.vidoe.com", "image_url" : "http://chooseyourownadventurebooks.org/images/write.interactive.stories.png", "audio_url" : "www.audio.com", "interaction" : "1" },
		                   { 	"story_id":"3", "name":"apple chapter 3", "body" : "test body of story 3", "video_url" : "www.vidoe.com", "image_url" : "http://chooseyourownadventurebooks.org/images/write.interactive.stories.png", "audio_url" : "www.audio.com", "interaction" : "1"}
		                  ]; 

		var storyJson = [
		                 { 	"id":"1", "name":"apple", "description" : "test description" },
		                 { 	"id":"2", "name":"apple", "description" : "test description" },
		                 { 	"id":"3", "name":"apple", "description" : "test description" }
		                ];
		
		$.each(storyJson, function(idx, obj) {	
 	        tx.executeSql("INSERT INTO stories (name, description) VALUES (?,?)", [obj.name, obj.description]);
 	        });
         
         $.each(chapterJson, function(idx, objChapter) {
                tx.executeSql("INSERT INTO chapters (story_id, number, name, body, video_path, image_path, audio_path, interaction_id) VALUES (?,?,?,?,?,?,?,?)", [objChapter.story_id, objChapter.story_id, objChapter.name, objChapter.body, objChapter.video_url,objChapter.image_url,objChapter.audio_url,objChapter.interaction_id]);  
        });
         
         tx.executeSql("SELECT * FROM stories", [], function(tx, results) {
             if(results.rows.length > 0) {
            	 
            	 //alert( results.rows.length );
            	 
            	 var temp_html = "";
            	 for( var i=0; i<results.rows.length; i++ ) {
            		 temp_html+= '<ul data-role="listview" data-inset="true">';
            		 temp_html+= '<li><a href="#story" id="load" onclick="app.loadChapterByStoryId(';
            		 temp_html+= results.rows.item(i).story_id;
            		 temp_html+= '); return true;">';
            		 temp_html+= results.rows.item(i).name;
            		 temp_html+= '</a></li>';
            		 temp_html+= '</ul>';
            	 }
          
            	 var storyElement = document.getElementById('story_list');
            	 storyElement.innerHTML = temp_html;
            	 
            	 
             } else {
            	 alert("no length");
             }
             
         });
        

	},
	errorCB: function(err) {
		alert("error code is " + err.message);
		//return false;
	},
	successCB: function() {
		window.localStorage.setItem('runned', '1');
        //alert("in success function");
        //alert(temp);
	},
	loadChapterByStoryId: function(storyId) {
		//alert("story id is" + storyId);
		
		var databaseName 		= "StoryEditor";
    	var databaseVersion 	= "1.0";
    	var databaseDisplayName = "StoryEditor";
    	var databaseSize 		= 25;
    	
        var db = window.openDatabase(databaseName, databaseVersion , databaseDisplayName, databaseSize);
        db.transaction( function(tx){ app.populateChaptersByStoryId(tx, storyId) } , app.errorCB, app.successCB);
        
        
	},
	populateChaptersByStoryId: function(tx, story_id) {
		tx.executeSql("SELECT * FROM chapters WHERE story_id='"+story_id+"'", [], function(tx, results) {
			
			//alert( "length is " + results.rows.length );
			
            if(results.rows.length > 0) {
           	 
           	 //alert( "chapter count is " + results.rows.length );
           	 
           	 var temp_html = "";
           	 for( var i=0; i<results.rows.length; i++ ) {
           		 temp_html+= '<ul data-role="listview" data-inset="true">';
           		 temp_html+= '<li><a href="#storycontent" onclick="app.loadChapterByChapterId(';
           		 temp_html+= results.rows.item(i).chapter_id;
           		 temp_html+= '); return true;">';
           		 temp_html+= results.rows.item(i).name;
           		 temp_html+= '</a></li>';
           		 temp_html+= '</ul>';
           	 }
         
           	 var storyElement = document.getElementById('chapter_list');
           	 storyElement.innerHTML = temp_html;
           	 
           	 alert( temp_html );
           	 
           	 
            } else {
           	 alert("no length");
            }
            
        });
		
		//return true;
	},
	loadChapterByChapterId: function(chapterId) {
		var databaseName 		= "StoryEditor";
    	var databaseVersion 	= "1.0";
    	var databaseDisplayName = "StoryEditor";
    	var databaseSize 		= 25;
    	
        var db = window.openDatabase(databaseName, databaseVersion , databaseDisplayName, databaseSize);
        db.transaction( function(tx){ app.getChapterContentByChapterId(tx, chapterId) } , app.errorCB, app.successCB);
	},
	getChapterContentByChapterId: function(tx, chapter_id) {
		tx.executeSql("SELECT * FROM chapters WHERE chapter_id='"+chapter_id+"'", [], function(tx, results) {
            if(results.rows.length > 0) {
           	 
           	 //alert( "chapter count is " + results.rows.length );
           	 
           	 var temp_html = "";
           	 for( var i=0; i<results.rows.length; i++ ) {
           		 temp_html+= '<p>';
           		 temp_html+= results.rows.item(i).body;
           		 temp_html+= '</p>';
           		 temp_html+= '<p>';
           		 temp_html+= '<img src="';
          		 temp_html+= results.rows.item(i).image_path;
          		 temp_html+= '" width="200" height="200" data-rel="external"/>';
          		 temp_html+= '</p>';
           	 }
           	 
           	 //alert(temp_html);
           	 
           	 var storyElement = document.getElementById('chapter_content');
           	 storyElement.innerHTML = temp_html;
           	 
           	 
            } else {
           	 alert("no length");
            }
            
        });
	}
};

app.initialize();