var resultDiv;

document.addEventListener("deviceready", init, false);
function init() {
	document.querySelector("#startScan").addEventListener("touchend", scan(1,"This is the code"), false);
	resultDiv = document.querySelector("#results");

}

function startScan() {

	cordova.plugins.barcodeScanner.scan(
		function (result) {
			var s = "Result: " + result.text + "<br/>" +
			"Format: " + result.format + "<br/>" +
			"Cancelled: " + result.cancelled;
			resultDiv.innerHTML = s;
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);

}

function scan(interaction_id, message)
{
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			if(result.text == message)
			{
				alert("correct");
				//give_feedback(interaction_id, 1);
				//next_chapter();
			}
			else
			{
				alert("incorrect");
				//give_feedback(interaction_id, 0);
			}
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);

}