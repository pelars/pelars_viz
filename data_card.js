
define([],function () {

	var first = true;
	 
//	$( "#datacard" ).click(function() {
		if(first == true){
			$('#datacard').load('wholeCard.html?session' + session_id);  
//			create(session_id, "timelines");
			first = false;
		}
//	});

});