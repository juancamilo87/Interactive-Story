// var resultDiv;

// document.addEventListener("deviceready", init, false);
// function init() {
// 	document.querySelector("#QRScan").addEventListener("touchend", startScan, false);
// 	resultDiv = document.querySelector("#qrResult");
// }

function startScan(interaction_id) {

	//alert( resultDiv );
    db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM interactions WHERE interaction_id='"+interaction_id+"'", [], function(tx, res){
            var new_id = res.rows.item(0).qr_id;
                table = 'qr';

            if(new_id != null)
            {
                tx.executeSql('SELECT * FROM '+table+" WHERE "+ table+"_id='"+new_id+"'", [], function(tx, res){
                   
                    message = res.rows.item(0).info;

                    cordova.plugins.barcodeScanner.scan(
						function (result) {
							if(result.text == message)
							{
								give_feedback(interaction_id, 1);
							}
							else
							{
								give_feedback(interaction_id, 0);
							}

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




                });
            }   
        });

	}, errorCB);  
}