<!DOCTYPE html>
<html>
<head>
	<!--<link rel="stylesheet/less" type="text/css" href="css/main.less" />
	<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/2.5.1/less.min.js"></script>
	<script src="js/main.js"></script>-->
    <!--<script src="js/markerTest.js"></script> -->
    <!-- <link rel="stylesheet" href="css/loginStyles.css"> -->
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	        font-size: 24px;
	        background-color: ghostwhite;
	        height: 100%;
	        max-width: 100%;
	        overflow-x: hidden;
	        position: relative;
        }
		
		h2{
			text-align: center;
		}
		
		select{
			font-size: 24px;
			display: block;
			width: 30%;
			box-sizing: border-box;
			margin: 0;
			border: 1px solid #aaa;
			border-radius: .4em;
		}
		
		.redirect{
			margin-left: 1vw;
			font-size: 24px;
			display: block;
			height: 100%;
			box-sizing: border-box;
			border: 1px solid #aaa;
		}

        .inputWrapperClass{
            display: flex;
            flex-direction: row;
			justify-content: center;
			align-content: center;
        }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

	<script>
        //global variable
        var manifestMallArray = [];
        var selectedValue;

        $(document).ready( function(){
        	var jsonFilePath = "manifest.json"; //which file to look at 
        	//var mall = "IMM";
        	$.getJSON(jsonFilePath, function(data){
            //console.log(data);
            for (var i in data){ //IMM, bla,bla
                manifestMallArray.push(i);
            }
            console.log(manifestMallArray);

            for (var i = 0; i<manifestMallArray.length; i++){
			    console.log("Start of loop");
                var opt = manifestMallArray[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                document.getElementById("selectedMall").appendChild(el);
			    console.log("End  loop");
            }
            
            selectedValue = document.getElementById("selectedMall").options[document.getElementById("selectedMall").selectedIndex].text;
            console.log("This is the selected value: " + selectedValue);
			
			localStorage.setItem("selectedValue", selectedValue); 
			console.log("Item stored?")

          });
        });

        function redirectToIndex(){
			location.href = "http://www.localhost/index.html" + "#" + selectedValue;
		}
    </script>
    
	<meta charset="utf-8">
	<title>Login</title>
</head>

<body>

    <h2>Gateway Signal Test Kit</h2>

    <div class= "inputWrapperClass" id="inputWrapper">
        <select name="malls" id="selectedMall"></select>
	    <input type="button" class="redirect" id="redirectToIndex" value="Go" onclick="redirectToIndex()">
    </div>
</body>




</html>
