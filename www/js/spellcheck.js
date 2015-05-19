
function check_word(interaction_id){

	db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM interactions WHERE interaction_id='"+interaction_id+"'", [], function(tx, res){
            var new_id = res.rows.item(0).spell_id;
                table = 'spell';

            if(new_id != null)
            {
                tx.executeSql('SELECT * FROM '+table+" WHERE "+ table+"_id='"+new_id+"'", [], function(tx, res){
                    
                    var given_word = res.rows.item(0).phrase;
                    
                    //var given_word = document.getElementById("given_word").value;
					var typed_word = document.getElementById("typed_word").value;
                    typed_word = typed_word.trim();
					var similar = 0;

					//Verify ignore case
			        if (given_word.toUpperCase() == typed_word.toUpperCase()){
						similar = 1;
					}
					/*document.getElementById("result").innerHTML = similar;*/
				        
				    //alert( similar );

				    give_feedback(interaction_id, similar);
                });
            }   
        });
    }, errorCB);
}
