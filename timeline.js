var vis = require('vis');
var s_end;

function getGroup(obj) {
	switch (obj['type']) {

	case "phase":
		return 1;
	case "face":
		return 2;
	case "hand":
		return 3;
	case "particle":
		return 7;
	case "ide":
		return 6;
	}
}

function customOrder(a, b) {
	// order by id
	return a.id - b.id;
}

var cb3 = function(data, ndata, groups, selector) {
	var c_phase = "setup";
	var j = 2;
	for ( var i = 0; i < data.length; i++) {
		var obj = data[i];
		var m_group = getGroup(obj);
		if ((obj['phase'] != c_phase || i == 0)
				&& !(obj['phase'] == "collector")) {
			
			var con = obj['phase'].replace("obs_","");
			
			ndata.add([ {
				id : j,
				//	content : obj['type'],
				start : obj['start'],
				end : obj['end'],
				group : 1,
				className : 'phase',
				content : con
			} ]);
		} else {
			ndata.update({
				id : j - 1,
				end : obj['end']
			});
			j = j - 1;
		}

		j = j + 1;
		c_phase = obj['phase'];
	}

	return j;
}

var cb4 = function(data, ndata, groups, j, selector) {			

	for ( var i = 0; i < data.length; i++) {
		var obj = data[i];
		var img_data = obj['data'];
		var image;
		var gr;
		var obj_class;


		if (obj['type'] == "image") {
			
			var imagegroup;
			
			switch (obj['view']){
				
			case "people":
				imagegroup = 9;
				break;
			case "workspace":
				imagegroup = 8;
				break;
			case "mobile":
				imagegroup = 11;
				break;
			case "screen":
				imagegroup = 10;
				break;
			default: 
				imagegroup = 9;
				break;
			
			}
			
			ndata.add([ {
				id : j,
				//	content : obj['type'],
				start : obj['time'],
				group : imagegroup,
				className : 'multimedia',
				type : 'box',
				content : '<a href= "' + img_data + '" onclick="window.open(\'' + img_data + '\',\'_blank\',\'width=800,height=600\'); return false;"><img src="' + img_data + '/thumb" style="width: 40px; height: 40px;"></a>'
			} ]);
		}

		if (obj['type'] == "text") {

			ndata.add([ {
				id : j,
				//	content : obj['type'],
				start : obj['time'],
				group : 12,
				className : 'multimedia',
				type : 'box',
				content : '<a href="' + img_data +'" target="_blank">' + String(obj['size']) + '</a>'
			} ]);
		}

		j = j + 1;
	}

	return j;
}

var cb2 = function(data, ndata, groups, j, selector) {
	var obj_data;
	var obj;
	for ( var i = 0; i < data.length; i++) {
		
		obj = data[i];
		
		if(obj['type'] == "audio"){
			continue;
		}
		
		var m_group = getGroup(obj);
		ndata.add([ {
			id : j,
			//	content : obj['type'],
			start : obj['time'],
			group : m_group,
			type : 'point',
			className : obj['type']
		} ]);
		if (obj['type'] == "hand" || obj['type'] == "face") {
			ndata.update({
				id : j,
				subgroup : obj['num'],
				subgrouporder : obj['num']
			});
		}
		if (obj['type'] == "particle") {
			var afterm = false;
			try{ 
				obj_data = JSON.parse(obj['data']);
			}
			catch(err){obj_data = obj['data']; afterm = true}

			var p_group
			var p_content

			switch (obj_data) {

			case "b2":
				p_group = 4;
				p_content = '<img src = \"assets/icons/idea.png\"  height="20" width="20"></img>'
				break;
			case "b1":
				p_group = 5;
				p_content = '<img src = \"assets/icons/thunder.png\" height="20" width="20"></img>'
				break;
			
			}

			if(afterm){

			ndata.update({
				id : j,
				group : p_group,
				className : "multimedia",
				content : p_content
			});
		}
		} 

		if(obj['type'] == "button"){
			obj_data = obj['data']
			switch (obj_data) {

			case "b2":
				p_group = 4;
				p_content = '<img src = \"assets/icons/idea.png\"  height="20" width="20"></img>'
				break;
			case "b1":
				p_group = 5;
				p_content = '<img src = \"assets/icons/thunder.png\" height="20" width="20"></img>'
				break;
			
			}

				ndata.update({
				id : j,
				group : p_group,
				className : "multimedia",
				content : p_content
			});

		}

		j = j + 1;
	}

	document.getElementById(selector).innerHTML = "";
	// Create a Timeline
	var container = document.getElementById(selector);
	var timeline = new vis.Timeline(container);
	timeline.setOptions(time_options);
	timeline.setGroups(groups);
	timeline.setItems(ndata);

}

var cb = function fillTimeline(data, session_id, selector) {

	var session_data = data;

	var names = [ 'Session', 'Phase', 'Face', 'Hand', 'Success Button', 'Frustration Button',
	              'Arduino IDE','Particle', 'Kinect2','Webcam','Screenshot','Mobile','Text'];
	var groups = new vis.DataSet();
	for ( var g = 0; g < names.length; g++) {

		groups.add({
			id : g,
			content : names[g]
		});

}
	//give subgroup to hands
	groups.update({
		id : 3,
		subgroupOrder : function(a, b) {
			return a.subgroupOrder - b.subgroupOrder;
		}
	});
	//give subgroup to hands
	groups.update({
		id : 2,
		subgroupOrder : function(a, b) {
			return a.subgroupOrder - b.subgroupOrder;
		}
	});

	var ndata = new vis.DataSet([ {
		id : 1,
		content : 'session',
		start : parseInt(session_data['start']),
		end : parseInt(session_data['end']),
		type : 'range',
		group : 0,
		className : 'red'
	} ]);

	//	ndata.add( [{id: 2, text: 'item 2', date: '2013-06-23'}])
	myurl = "/pelars/phase/".concat(session_id);
	//console.log(myurl);
	var j;

	$.getJSON(myurl, function(data) {
		j = cb3(data, ndata, groups, selector);
	});


	myurl = "/pelars/multimedia/".concat(session_id);
	console.log(myurl);

	$.getJSON(myurl, function(data) {
		j = cb4(data, ndata, groups, j, selector);
	});

	myurl = "/pelars/data/".concat(session_id);
	console.log(myurl);

	$.getJSON(myurl, function(data) {
		cb2(data, ndata, groups, j, selector);
	});
	

}

//getsession must get also the container
function create(session_id, selector) {
	
	//	var session_id = form.session.value;
	var myurl = "/pelars/session/".concat(session_id);
	//document.getElementById(selector).innerHTML("<p>loading... <img src=ajax-loader.gif /></p>"); 
	//$(selector).html("loading... <img src=ajax-loader.gif />");
	document.getElementById(selector).innerHTML = "loading... <img src=/pelars/ajax-loader.gif />";

	var data;
	// create a data set with groups
	jQuery.ajax({
		dataType : "json",
		url : myurl,
		data : data,
		type : 'GET',
		success : function(data) {
			cb(data, session_id, selector);
		},
		error : function(xhr, ajaxOptions, thrownError) {

			if(xhr.status == 403){
				alert("access forbidden");
				window.location.replace("/pelars");
			}

			if(xhr.status == 404){
				alert("not valid session");
			}
		}
	});
	return false;
}


// Configuration for the Timeline
var time_options = {
		stack : false,
		groupOrder : 'id',
		editable : true,
		margin : {
			item : 10, // minimal margin between items
			axis : 5
			// minimal margin between items and the axis
		},
		orientation : 'top'
};