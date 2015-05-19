function check_quiz(interaction_id){
	
	//alert( correct_answer );

	db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM interactions WHERE interaction_id='"+interaction_id+"'", [], function(tx, res){
            var new_id = res.rows.item(0).quiz_id;
                table = 'quiz';

            if(new_id != null)
            {
                tx.executeSql('SELECT * FROM '+table+" WHERE "+ table+"_id='"+new_id+"'", [], function(tx, res){
                    
                    var correct_answer = res.rows.item(0).correct_answer;
                    
				    var form = document.getElementById("question_form");
					var radios = form.elements["question1"];
					var val=0;
					var is_correct = 0;
					
					for (var i=0, len=radios.length; i<len; i++) {
						        if ( radios[i].checked ) { // radio checked?
						            val = radios[i].value; // if so, hold its value in val
						            break; // and break out of for loop
						        }
						    }
					if (val==correct_answer){
						is_correct = 1;
					}
					    
					//alert(is_correct);
					give_feedback(interaction_id, is_correct);

                });
            }   
        });
    }, errorCB);
}