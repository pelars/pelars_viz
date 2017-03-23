<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
  <title>Demo &raquo; Dynamic grid width &raquo; gridster.js</title>
  <link rel="stylesheet" type="text/css" href="gridster/dist/jquery.gridster.css">
  <link rel="stylesheet" type="text/css" href="gridster.css">
   <link href="vis.css" rel="stylesheet" type="text/css" />
  <link rel="stylesheet" href="style.css">
  <link rel="icon" type="image/png" href="/pelars/pelarslogo.png" sizes="16x16">
  <script data-main="config" src="requirejs/require.js"></script>
  <script type="text/javascript" src="jquery/dist/jquery.js"></script>
</head>

  <%

String session_par = request.getParameter("session");

%>
  
  <script>
	
  var session_id = <%=session_par%>;
  console.log(session_id)
  if(session_id == null){
    alert("call with session as parameter")
    window.stop();
  }

  function getCookie(name) {
      var arg = name + "="
      var alen = arg.length
      var clen = document.cookie.length
      var i = 0
      while (i < clen) {
          var j = i + alen
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

  var m_token = getCookie("token"); 
  console.log("got cookie: " + m_token)
  
  $(document).ready(function(){
    $("#audiobutton").click(function(){
    	$("#audio").css("overflow", "hidden");
    	var url = "audio.html?session=" + session_id;
    	console.log(url)
    	document.getElementById("audio").innerHTML='<object style="overflow:hidden;" width="800" height="500" type="text/html" data='+url+' ></object>';
    });
    $("#idebutton").click(function(){
    	$("#ide").css("overflow", "hidden");
    	var url = "program.html?session=" + session_id;
    	console.log(url)
    	document.getElementById("ide").innerHTML='<object style="overflow:hidden;" width="800" height="500" type="text/html" data='+url+' ></object>';
    });
});

  </script>

<body>

  <h1>PELARS grid visualization</h1>
		
    	 <h2>Time line</h2>

    <div id="nondrag" class="gridster">
        <ul>
            <li data-row="1" data-col="1" data-sizex="27" data-sizey="14"><div id = "timelines"><button type="button" onclick="requirejs(['widgets-filler'])">See the timeline</button></div></li>
        </ul>
    </div>


    <h2>CIID widgets</h2>

    <div id="draggrid" class="gridster">
        <ul>
              <li data-row="3" data-col="1" data-sizex="14" data-sizey="9"><div id ="datacard"><button type="button" onclick="requirejs(['data_card'])">See the datacard</button></div></li>
        </ul>
    </div>

     <h2>SSSUP widgets</h2>

    <div id="SSSUP" class="gridster">
        <ul>
            <li data-row="1" data-col="1" data-sizex="14" data-sizey="13"><div id ="3D" style = "overflow:hidden"><button type="button" onclick="requirejs(['3Dfiller'])">See the 3D visualization</button></div></li>
        <li data-row="1" data-col="2" data-sizex="14" data-sizey="13"><div id ="piechart"><button type="button" onclick="requirejs(['piechart'])">See Multimedia chart</button></div></li>
        <li data-row="2" data-col="1" data-sizex="13" data-sizey="8"><div id ="audio"><button id="audiobutton" type="button" >See audio graph</button></div></li>
        <li data-row="2" data-col="2" data-sizex="13" data-sizey="8"><div id ="ide"><button id="idebutton" type="button" >See programming intensity</button></div></li>
        </ul>
    </div>
    	
   
 
</body>
</html>
