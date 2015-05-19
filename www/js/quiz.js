function check_quiz(interaction_id){
	
	//alert( correct_answer );
	
	var form = document.getElementById("question_form");
	var radios = form.elements["question1"];
	var val=0;
	var is_correct = false;
	
	for (var i=0, len=radios.length; i<len; i++) {
		        if ( radios[i].checked ) { // radio checked?
		            val = radios[i].value; // if so, hold its value in val
		            break; // and break out of for loop
		        }
		    }
	if (val==correct_answer){
		is_correct = true;
	}
	    
	alert(is_correct);
}