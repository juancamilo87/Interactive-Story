
function check_word(given_word, typed_word){



var given_word = document.getElementById("given_word").value;
var typed_word = document.getElementById("typed_word").value;

var similar = false;

        if (given_word == typed_word){
			similar = true;
		}
	document.getElementById("result").innerHTML = similar; 
	
}