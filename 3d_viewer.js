
define(["threejs","dat.gui", "jquery","TextGeometry","font.Helvetica","OrbitControls"],function (require) {




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


var debug = false;


	function doscale(x)
	{
		x.x *= 100;
		x.y *= 100;
		x.z *= 100;
		return x;
	}

	function init(session) {

		scene = new THREE.Scene();

		// renderer
		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setClearColor( 0xcccccc); //scene.fog.color );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

		container = document.getElementById( 'container' );
		container.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );

		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000 );

		// initial position
		camera.position.z = 150;
		camera.position.y = 80;

		controls = new THREE.OrbitControls( camera );
		/*
		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;
		controls.keys = [ 65, 83, 68 ];
		*/
		controls.addEventListener( 'change', render );

		// FLOOR
		var loader = new THREE.TextureLoader();
		var floorTexture = loader.load( "blue.jpeg", render);
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
		floorTexture.repeat.set( 10, 10 );
		var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
		var floorGeometry = new THREE.PlaneBufferGeometry(200, 200, 10, 10);
		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.position.y = -0.5;
		floor.rotation.x = Math.PI / 2;

		// world
		scene.add(floor)
		
		var world2webgl = new THREE.Matrix4();
		world2webgl.set(  0,  0,   1,  0,
					      1,  0,   0,  0,
					      0,  1,   0,  0,
					      0,  0,   0,  1);

		var world2webgl_inv = new THREE.Matrix4();
		world2webgl_inv.getInverse(world2webgl);

		var geometry = new THREE.SphereGeometry( 1 );
		var material =  new THREE.MeshLambertMaterial( { color:0xffff00} );

		// lights

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0x002288 );
		light.position.set( -1, -1, -1 );
		scene.add( light );

		light = new THREE.AmbientLight( 0x222222 );
		scene.add( light );

		var token = getCookie('token');
		console.log("imported module has read token: " + token)
	//	var token;

		DrawAxisCb(token, world2webgl, world2webgl_inv, session, token)
		scene.updateMatrix()

		animate()
		render();
	}

	function DrawAxisCb(token, world2webgl, world2webgl_inv, session){

		var calibration_1;
		var calibration_2;
		var name_1;
		var name_2;
		var r1 = new THREE.Matrix3;
		var r2 = new THREE.Matrix3;
		var rt1 = new THREE.Matrix4;
		var rt2 = new THREE.Matrix4;
		var t1 = new THREE.Vector3;
		var t2 = new THREE.Vector3;
		
		// get calibrations and draw them
		jQuery.ajax({
			dataType : "json",
			url : "/pelars/calibration/"+session+"?token=" + token,
			type: 'GET',
			async: true,
			success : function(jqXHR, status, result) {
				var parsed = JSON.parse(result.responseText)

				calibration_1 = parsed[0]["parameters"]
				calibration_2 = parsed[1]["parameters"]

				name_1 = parsed[0]["type"]
				name_2 = parsed[1]["type"]

				t1.set(calibration_1[3], calibration_1[7], calibration_1[11]);
				t2.set(calibration_2[3], calibration_2[7], calibration_2[11]);


				rt1.set(calibration_1[0], calibration_1[1], calibration_1[2], calibration_1[3],
					   calibration_1[4], calibration_1[5], calibration_1[6], calibration_1[7],
					   calibration_1[8], calibration_1[9], calibration_1[10], calibration_1[11],
					   0,0,0,1);

				rt2.set(calibration_2[0], calibration_2[1], calibration_2[2], calibration_2[3],
					   calibration_2[4], calibration_2[5], calibration_2[6], calibration_2[7],
					   calibration_2[8], calibration_2[9], calibration_2[10], calibration_2[11],
					   0,0,0,1);

				var tmp1 = new THREE.Matrix4();
				var tmp2 = new THREE.Matrix4();
				//console.log(rt1)
				tmp1.multiplyMatrices(rt1, world2webgl)
				tmp2.multiplyMatrices(rt2, world2webgl)
				//console.log(tmp1)

				tmp1.getInverse(tmp1)
				tmp2.getInverse(tmp2)
				tmp1.elements[15] = 1
				tmp2.elements[15] = 1

				drawAxis(tmp1, tmp2, name_1, name_2);
				var flip = false; // flip y for older session since opencv images grow towards bottom

				var hand_complete = false;;
				var face_complete = false;

				jQuery.ajax({
					timeout : 15000,
					type : "GET",
					url : "/pelars/data/"+session+"/hand"+"?token=" + token,
					async: true,
					success : function(jqXHR, status, result)
					{
						var response = result.responseText
						var parsed = JSON.parse(response, "hand")
						
						if(!debug){
							if(!(parsed["status"] == "Empty")){
								console.log("got hands")
								players["hand"].play(parsed, "hand", world2webgl_inv, flip)
							}
						}else{
						
							var t_position = new THREE.Vector4();
							for(i = 0; i < parsed.length; i++){
								var q = parsed[i]
								var tmp2 = new THREE.Vector4(q.tx, q.ty, q.tz, 1);
								tmp2.applyMatrix4(world2webgl_inv)
			
								namedsr.addSR("H"+i, "", 
								doscale((new THREE.Vector3(tmp2.x,tmp2.y,tmp2.z))), 
								(new THREE.Quaternion(0,0,0,1)),undefined,undefined,false)
							}
						}

					},
					error : function(jqXHR, status) {
						console.log("error loading data",jqXHR);
						res = 0; }
					});

				jQuery.ajax({
					timeout : 15000,
					type : "GET",
					url : "/pelars/data/"+session+"/face"+"?token=" + token,
					async: true,
					success : function(jqXHR, status, result)
					{
						var response = result.responseText
						var parsed = JSON.parse(response)
						var t_position = new THREE.Vector4();
						if(session <= 1051)
							flip = true;

						if(!debug){
							if(!(parsed["status"] == "Empty")){
								console.log("got faces")
								players["face"].play(parsed, "face", world2webgl_inv, flip)
							}
						}
						else{
							for(i = 0; i < parsed.length; i++){

								var q = parsed[i]

								var tmp2 = new THREE.Vector4(q.pos_x0,q.pos_y0,q.pos_z0, 1);
								tmp2.applyMatrix4(world2webgl_inv)
								namedsr.addSR("F"+i, "", 
										doscale((new THREE.Vector3(tmp2.x,tmp2.y,tmp2.z))), 
										(new THREE.Quaternion(0,0,0,1)),undefined,undefined,true)
							}
						}
						face_complete = true;
					},
					error : function(jqXHR, status) {
						console.log("error loading data",jqXHR);
						res = 0; }
					}
				);
				
				/*
				while(!(hand_complete && face_complete)){
					console.log("")
				}*/

				for(var key in players){
					console.log("starting "+key)
					players[key].start();
				}

			},
			error : function(jqXHR, status) {
			}
		});
	}

	function drawAxis(rt1, rt2, name_1, name_2) {

		var quaternion1 = new THREE.Quaternion();
		var quaternion2 = new THREE.Quaternion();

		quaternion1.setFromRotationMatrix(rt1);
		quaternion2.setFromRotationMatrix(rt2);

		quaternion1.normalize()
		quaternion2.normalize()

		var t1 = new THREE.Vector3;
		var t2 = new THREE.Vector3;

		t1.set(rt1.elements[12], rt1.elements[13], rt1.elements[14]);
		t2.set(rt2.elements[12], rt2.elements[13], rt2.elements[14]);

		namedsr.addSR("O","", new THREE.Vector3(0.5, 0.5, 0.5), new THREE.Quaternion())
		namedsr.addSR(name_1, "O", doscale(t1), quaternion1)
		namedsr.addSR(name_2, "O", doscale(t2), quaternion2)
		
		scene.updateMatrix()
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		//controls.handleResize();

		render();
	}

	function animate() {

		requestAnimationFrame(animate)
		camnavig.step()
		/*
		$.each(players, function(key, value) {
			value.step();
		})*/
		for(var key in players){
			players[key].step();
		}

		controls.update();
		renderer.render( scene, camera );

	}

	function render() {
		renderer.render( scene, camera );
		
	}


	//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	FramesPlayer = function ()
	{
		this.frames = []
		this.active = false
	}
	FramesPlayer.prototype.start = function()
	{
		this.active = true;
		this.index = 0;
		this.clock = new THREE.Clock(true)
		console.log("Started ",this.frames.length, " " , this.type)
	}
	FramesPlayer.prototype.step = function ()
	{
		if(!this.active || this.frames.length == 0 || this.index >= this.frames.length)
			return
		var scale = 1 // real time
		var vt = (this.clock.getElapsedTime()) // moves from start time to virtual time in seconds
		while(true)
		{
			var q = this.frames[this.index]
			var cvt = (q.time/1000.0-this.bt) * scale // relative seconds
			if(cvt > vt)
			{
				// skip 
				break
			}
			if(this.type == "hand")
			{

				// rotation
				var hand_gl_r = new THREE.Quaternion(q.rx,q.ry,q.rz,q.rw)
				hand_gl_r.normalize()
				var tmp = new THREE.Quaternion().setFromRotationMatrix(this.mat)
				tmp.normalize()
				hand_gl_r.multiply(tmp)
				hand_gl_r.normalize()

				// translation
				var hand_gl_t = new THREE.Vector4(q.tx, q.ty, q.tz, 1);
				hand_gl_t.applyMatrix4(this.mat)

				namedsr.addSR("H"+q.num, "", 
						doscale(new THREE.Vector3(hand_gl_t.x,hand_gl_t.y,hand_gl_t.z)), 
						hand_gl_r,undefined,undefined,true)

			}
			
			if(this.type == "face")
			{
				if(this.flip){
					q.pos_y0 = -q.pos_y0
					q.pos_y1 = -q.pos_y1
					q.pos_y2 = -q.pos_y2
				}	

				var face_point_1 = new THREE.Vector4(q.pos_x0,q.pos_y0,q.pos_z0, 1);
				var face_point_2 = new THREE.Vector4(q.pos_x1,q.pos_y1,q.pos_z1, 1);
				var face_point_3 = new THREE.Vector4(q.pos_x2,q.pos_y2,q.pos_z2, 1);

				face_point_1.applyMatrix4(this.mat)
				face_point_2.applyMatrix4(this.mat)
				face_point_2.applyMatrix4(this.mat)

				namedsr.addSR("F"+q.num, "", 
						doscale((new THREE.Vector3(face_point_1.x,face_point_1.y,face_point_1.z))), 
						(new THREE.Quaternion()),undefined,undefined,true)
				
			}

			this.index++
			if(this.index >= this.frames.length)
			{
				console.log("Terminated")
				break
			}
		}
	}

	FramesPlayer.prototype.play = function (frames, type, world2webgl_inv, flip)
	{
		this.clock = new THREE.Clock(true)
		this.frames = frames
		this.bt = this.frames[0].time/1000.0
		this.index = 0
		this.type = type
		this.mat = world2webgl_inv;
		this.flip = flip
		console.log("Doing ",this.frames.length, " " , type)
	}

	LiveFrame = function (name,parentname,p0,q0,label)
	{
		if(!label)
			label = name
		THREE.Object3D.call( this );

		this.name = name
		this.parentname = parent

		this.position.copy(p0)
		this.quaternion.copy(q0)

		var a = new THREE.AxisHelper(10)
		this.add(a)			

		var text3d = new THREE.TextGeometry( label, {
			size: 5,
			height: 1,
			curveSegments: 2,
			font: "helvetiker"
		});
		text3d.computeBoundingBox();

		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		var textMaterial = new THREE.MeshBasicMaterial( { color:  Math.random() * 0xffff00, overdraw: 0.5 } );
		var text = new THREE.Mesh( text3d, textMaterial );

		text.position.set(0,0,0)
		text.rotation.x = 0;
		text.rotation.y = 0;

		this.text = text
		this.add(text)

		// TODO: label
		// TODO: parent to self arrow
		this.updateMatrix();

	}
	LiveFrame.prototype = Object.create( THREE.Object3D.prototype );

	LiveFrame.prototype.constructor = LiveFrame;

	LiveFrame.prototype.showLabels = function(x)
	{
		this.text.visible = x
	}

	CamNavig = function()
	{
		this.active = false
		this.clock = new THREE.Clock(false)
	}

	CamNavig.prototype = Object.create(Object.prototype);

	CamNavig.prototype.constructor = CamNavig;

	CamNavig.prototype.step = function()
	{
		if(!this.active)
			return
		// check active
		// check time
		// slerp
		// lerp	

		var lambda = this.clock.getElapsedTime()/this.duration
		if(lambda >= 1)
		{
			//console.log("Reset")
			lambda = 1
			this.active = false;
			controls.reset();
			this.clock.stop();				
		}
		if(this.endquat)
		{
	        var newQuaternion = new THREE.Quaternion();
	        THREE.Quaternion.slerp(camera.quaternion, this.endquat, newQuaternion, lambda);
	        camera.quaternion = newQuaternion;
	    }

	    if(this.endpos)
	    {
	        var newPosition = new THREE.Vector3();
	        camera.position.lerp(this.endpos,lambda)
	        camera.position = newPosition
	    }
	}

	CamNavig.prototype.setup = function(camera, endpos, endquat, duration)
	{
		this.clock.start()
		this.camera = camera
		this.duration = duration
		this.endpos = endpos
		this.endquat = endquat
		this.active = true
	}
	// general manager
	NamedSRG = function ()
	{
		this.knownSR = {}

		// TODO: add: scene,gui,parameters,camnavig,render(),camera
	}
	NamedSRG.prototype = Object.create(Object.prototype );

	NamedSRG.prototype.constructor = NamedSRG;

	NamedSRG.prototype.addSR = function (name,parentname,pos,quat,other,label,update)
	{
		if(!label)
			label = name

		if(!update && name in this.knownSR)
		{
			//console.log("duplicate name")
			return false
		}

			var pa
		if(parentname != "")
		{
			pa = this.knownSR[parentname]
			if(!pa)
			{
				//console.log("missing parent")
				return					
			}
		}

		var sr = this.knownSR[name]
		if(sr)
		{
			sr.position.copy(pos)
			sr.quaternion.copy(quat)

			sr.updateMatrix();

			return true
		}
		else
		{
			var livelabel = new LiveFrame(name,pa,pos,quat,label)
			if(!pa)
			{
				scene.add(livelabel)
				//livelabel.folder = gui.addFolder(livelabel.name)
			}
			else
			{
				pa.add(livelabel)
				//livelabel.folder = pa.folder.addFolder(livelabel.name)
			}
			var prefix = livelabel.uuid
			parameters[prefix + ".visible"] = true


			// every node is identified (number? ) to manipulate parameters
			// Names of folders in dat.GUI have to be unique so I append the node UUID to the name
/*
			livelabel.folder.add(parameters,prefix + ".visible").name("visible").onChange(function (x)
			{
				livelabel.visible = x
				render();
			}
			)*/
			parameters[prefix + ".do"] =function () {
				// TODO compute good view point for the reference system
				camnavig.setup(camera,livelabel.position,livelabel.quaternion,3)
			}
			//livelabel.folder.add(parameters,prefix +".do").name("Nav")
			this.knownSR[name]= livelabel
			return true
		}

	}

	NamedSRG.prototype.removeSR = function (name)
	{
		var lv = this.knownSR[name]
		if(!lv)
			return
		lv.parent.remove(lv)
		delete this.knownSR[name]
		//gui.removeFolder(name)
		// TODO remove: prefix + .visible .do ....
	}

	NamedSRG.prototype.connect = function ()
	{
		var ws = new WebSocket("ws://localhost:8000/");
	      // Set event handlers.
	      ws.onopen = function() {
	        output("onopen");
	      };
	      
	      ws.onmessage = function(e) {
	        // e.data contains received string.
	        output("onmessage: " + e.data);
	      };
	      
	      ws.onclose = function() {
	        output("onclose");
	      };
	      ws.onerror = function(e) {
	        output("onerror");
	        console.log(e)
	      };
	}
/*
	var gui = new dat.GUI();

	gui.removeFolder = function(name) {
	    this.__folders[name].close();
	    this.__folders[name].domElement.parentNode.parentNode.removeChild(this.__folders[name].domElement.parentNode);
	    this.__folders[name] = undefined;
	    this.onResize();
	}
*/
	parameters = {
		"showlabels": true,
		"allvisible": false,
		"resetview" : function ()
		{
			camnavig.setup(camera, new THREE.Vector3(0,200,500), new THREE.Quaternion(),5)
		}

	}

	var livelabel;
/*
	gui.add( parameters, 'allvisible' ).name("All Visible").onChange(function(newValue) {

	})
	gui.add( parameters, 'showlabels' ).name("Show Labels").onChange(function(newValue) {

	})
	gui.add( parameters, 'resetview' ).name("Reset View")
	

	// add the 
	gui.open();
*/

	// needs notification of change

	var players = [];
	players["hand"] = new FramesPlayer()
	players["face"] = new FramesPlayer()
	var container, stats;
	var camera, controls, scene, renderer;
	var namedsr = new NamedSRG();

	var camnavig = new CamNavig();
	var cross;

	var sessionhtml = 	getParam('session');


	init(sessionhtml);

	animate();
});