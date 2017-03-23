

function getParam ( sname )
{
  var params = location.search.substr(location.search.indexOf("?")+1);
  var sval = "";
  params = params.split("&");
    // split param and value into individual pieces
    for (var i=0; i<params.length; i++)
       {
         temp = params[i].split("=");
         if ( [temp[0]] == sname ) { sval = temp[1]; }
       }
  return sval;
}

function getCookie(name) {
    var arg = name + "="
    var alen = arg.length
    var clen = document.cookie.length
    var i = 0
    console.log(clen)
    while (i < clen) {
        var j = i + alen
        console.log(document.cookie.substring(i, j))
        if (document.cookie.substring(i, j) == arg){
            return getCookieVal(j)
        }
        i = document.cookie.indexOf(" ", i) + 1
        if (i == 0) break
    }
    return null
}

function getCookieVal(offset){
    var endstr = document.cookie.indexOf (";", offset)
    if (endstr == -1)
    endstr = document.cookie.length
    return unescape(document.cookie.substring(offset, endstr))
}


function dochildren(phase, multimedia){
	var start = phase["start"]
	var end = phase["end"]
	var last = 0
	var children = new Array();
	console.log("getting children of phase ", phase["phase"])
	for(j = 0; j < multimedia.length; j++){
		if(multimedia[j]["time"] >= start && multimedia[j]["time"] <= end)
		{
			var relative_time = multimedia[j]["time"] - start
			if(relative_time < last)
				continue
			duration = relative_time - last
			xsize = 2000
			if(duration > 0)
				children.push({name : "", size : duration, spacer : "True"})
			children.push({name : "content"+j, size : xsize, spacer : false, content : true, link : multimedia[j]["data"], color : multimedia[j]["type"] == "text" ? "blue" : "red"})	
			last = relative_time + xsize
		}
	}
	return children
}

function get_session(token){
	jQuery.ajax({
		timeout : 15000,
		type : "GET",
		url : "/pelars/session/"+session+"?token=" + token,
		async: true,
		success : function(jqXHR, status, result)
		{
			var response = result.responseText
			parsed_session = JSON.parse(response)
			console.log("got session")
			get_multimedia(token)
		},
		error : function(jqXHR, status) {
			console.log("error loading data",jqXHR);
			res = 0; }
		});
}

function get_multimedia(token){
	jQuery.ajax({
		timeout : 15000,
		type : "GET",
		url : "/pelars/multimedia/"+session+"?token=" + token,
		async: true,
		success : function(jqXHR, status, result)
		{
			var response = result.responseText
			parsed_muiltimedia = JSON.parse(response)
			console.log("got multimedia")
			get_phase(token);
		},
		error : function(jqXHR, status) {
			console.log("error loading data",jqXHR);
			res = 0; }
		});
}

function get_phase(token){
	jQuery.ajax({
		timeout : 15000,
		type : "GET",
		url : "/pelars/phase/"+session+"?token=" + token,
		async: true,
		success : function(jqXHR, status, result)
		{
			var response = result.responseText
			parsed_phase = JSON.parse(response)

			out_data["name"] = "session"
			out_data["children"] = new Array();

			for(i = 0; i < parsed_phase.length; i++){
					var phase = parsed_phase[i]
					var child = dochildren(phase, parsed_muiltimedia)
					var n = phase['phase'].replace("obs_","");
					out_data["children"].push({name : n, size:(phase["end"] - phase["start"])/ 1000, spacer:false, unit : "seconds", children : child  })
			}

			draw();


			console.log("got phase")
			
		},
		error : function(jqXHR, status) {
			console.log("error loading data",jqXHR);
			res = 0; }
		});

}
function create_data(token){

	get_session(token)
}

var parsed_session
var parsed_data
var parsed_muiltimedia
var parsed_phase
var out_data = new Object();

var token = getCookie('token');

console.log("read the token :" + token);

var session = getParam('session')

if(session == "" ){
	session = 1051;
}

console.log("read session: " + session)

// fills out_data
create_data(token)
