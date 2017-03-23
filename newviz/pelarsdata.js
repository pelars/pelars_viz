/// PELARS url and authentication
var pelarstoken = 0;
var pelarsprefix = "/pelars"
var dataaccess;
var thisSession = 0;

/// returns the value of the parameter sname passed in the session
function getLocationParam ( sname )
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

function pelars_getSnapshot(session,time,fx)
{
	return $.getJSONSync(pelarsprefix + "/snapshot/"+session+"/"+time,fx)
}

function pelars_getMultimedia(session,media,fx)
{
	console.log("pelars_getMultimedia " + media)
	return $.getJSONSync(pelarsprefix + "/multimedia/"+session+"/"+media,fx)
}

function pelars_getMultimedias(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/multimedia/"+session,fx)
}

function pelars_getContent(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/content/"+session,fx)
}

function pelars_getPost(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/content/"+session,fx)
}

function pelars_getPhases(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/phase/"+session,fx)
}

function pelars_getData(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/data/"+session,fx)
}


function pelars_getLastSession(next,fx)
{
	return $.getJSONSync(pelarsprefix + "/session",fx)
		.done(function(json1) {
			return parseInt(json1[json1.length-1].session);
		}
	)
}

function pelars_init()
{

	/// this is bad, use with care instead of the async get
	$.getJSONSync = function (url,fx)
	{
		jQuery.ajax({
			timeout : 2000,
			dataType: "json",
			type : "GET",
			crossDomain: true,
			url : url,
			async: false,
			success : function(result) { 
				fx(result)
			}
		});		
	}
	thisSession = getLocationParam("session") || "offline";



	// TODO here the offline mode from session
	if(thisSession == "offline")
	{
		console.log("offline")
		dataaccess = {
			getData: function (session,fx) { $.getJSONSync("data/data1.json",fx); },
			getContent: function (session,fx) { $.getJSONSync("data/postSession.json",fx); },
			getContextContent: function (session,fx) { $.getJSONSync("data/content.json",fx); },
			getMultimedias: function (session,fx) { $.getJSONSync("data/multimedia.json",fx); },
			getPhases: function (session,fx) { $.getJSONSync("data/phaseData.json",fx); },
			getLastSession: function () { return 1593 },
			getSnapshot(session,time,fx) { $.getJSONSync("data/button1.json",fx); },
		}

		thisSession = 1593
	}
	else
	{
		dataaccess = {
			getData: function (session,fx) { pelars_getData(session,fx) },
			getContent: function (session,fx) { pelars_getContent(session,fx) },
			getContextContent: function (session,fx) { $.getJSONSync("data/content.json",fx); },
			getPhases: function (session,fx) { pelars_getPhases(session,fx) },
			getSnapshot(session,time,fx) { pelars_getSnapshot(session,time,fx); },
			getLastSession: function () { return pelars_getLastSession() },
			getMultimedias: function (session,fx) { pelars_getMultimedias(session,fx) },
			getMultimedia: function (session,id,fx) { pelars_getMultimedia(session,id,fx) }
		}		
	}

	if(thisSession == "last")
		thisSession = dataaccess.getLastSession()

	dataaccess.session = thisSession
}
