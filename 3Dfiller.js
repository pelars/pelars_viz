	var first = true;
	 
		if(first == true){
			var url = "\"3d_viewer.html?session="+session_id+"&token=" +m_token +"\""

			document.getElementById("3D").innerHTML='<object width="800" height="600" type="text/html" data='+url+' ></object>';

			first = false;
		}
