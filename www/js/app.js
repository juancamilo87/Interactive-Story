var resultDiv;

document.addEventListener("deviceready", init, false);
function init() {
	document.querySelector("#QRScan").addEventListener("touchend", startScan, false);
	resultDiv = document.querySelector("#qrResult");
}

function startScan(interaction_id) {

	//alert( resultDiv );
	
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			var s = "Result: " + result.text + "<br/>" +
			"Format: " + result.format + "<br/>" +
			"Cancelled: " + result.cancelled;
			
			document.getElementById("qrResult").innerHTML = s;
			
			//alert( s );
			
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
				give_feedback(interaction_id, 1);
				next_chapter();
			}
			else
			{
				give_feedback(interaction_id, 0);
			}
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);

}