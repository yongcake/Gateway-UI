//Global varibles
var url = window.location.href;
var mall = sliceURL(url);
var xPosition,yPosition;
var newMarker;
var nodeCount = 0 ,testCounter = 0;;
var markerAdded = false;
var nodeExist = false;
var addButtonPressed  = false;  
var addGatewayButtonPressed = false;
var gatewayMarkerAdded = false;
var gatewayUniqueMarker;
var gatewayUniqueContainer;
var gatewayPlaced = false;
var selectedNode, selectedMarkerID = "";
var signalStrength = 1; //1 to 5 
var initTestCount = [], initNodeCount = [];
var buttonArray = [], testArray = [], oldCord = [], manifestJsonArray = [];
var modeArray ={enabled:true, addingMode:true, movingMode:false, viewingMode:false};
var currentFloor = "";
//New Site Array format [ [*TestNO*,true,[GatewayID,GatewayLeft,GatewayTop,[*Floor*,*NodeArrays[*nodes*]*]*]] , [*TestNO*,true,[GatewayID,GatewayLeft,GatewayTop,[*Floor*,*NodeArrays[*nodes*]*]*]] ]
var imageWidth = 0;
var imageHeight = 0;
var divWidth = 0;
var divHeight = 0;
var img = new Image();

$(document).ready( function(){
	var jsonFilePath = "manifest.json"; //which file to look at 
	//var mall = "IMM";
	$.getJSON(jsonFilePath, function(data){
    //console.log(data);
    for (var i in data){ //IMM, bla,bla
		//console.log(i);
		if(i == mall){
			var mallData = data[i]; //data in that mall
			var floorArrayData = mallData["floorInfo"];
			manifestJsonArray = floorArrayData;
			var selectSite = false;
			for(var k in floorArrayData){ //k = {"floor": v, "imagePath": v, "size":{"width": v,"height": v}}
				var area = floorArrayData[k]["floor"];
				if(!selectSite){
					switchSites(area);
					selectSite = true;
				}
				$("#floorSelectionWrapper").append("<input type='button' class='button' id='" + area + "' onclick=switchSites('"+area+"') value='" +area+ "'></input>");
			}
			console.log(mallData);
			for(var j in mallData["nodeList"]){
				var nodeN = mallData["nodeList"][j];
				$("#inputInfo").append("<input type='button' class='addNode' id='" + nodeN + "' onclick=changeSelectedNode('"+nodeN+"') value='" +nodeN+ "' disabled ></input>");
				buttonArray.push(nodeN);
			}
			//console.log(floorArrayData);
		}
    }
  });
	
});

$(document).ready( function(){
  console.log("~~~~~~~~~~~~~~~~~~~~~~ Initializing ~~~~~~~~~~~~~~~~~~~~~~")
  var testCompleted, testNo, gatewayID, gatewayLeft, gatewayTop, gatewayFloor, infoID, location, markerID, nodeID, nodeName, posLeft, posTop, signal, status, area, test,pointID,active;//
  var jsonFilePath = "config.json"; //which file to look at
  var newFloorArray = [];
  var container = document.querySelector("#imageSource");
  divWidth = document.getElementById("imageSource").offsetWidth;
  divHeight = document.getElementById("imageSource").offsetHeight;
  
  $("#inputInfo").hide();
  $.ajaxSetup({cache:false}); //disable cache so it can update 
  $.getJSON(jsonFilePath, function(data){
    //console.log(Object.keys(data).length);
    for (var i in data){     //i = TestID
      var testData = data[i]; //info inside "testn"
      console.log("==========================" + JSON.stringify(i) + "==========================");
      console.log(data);
      testCompleted = testData["testCompleted"];
	  testNo = testData["testNo"];
	  gatewayID = testData["gatewayID"];
	  gatewayLeft = testData["gatewayLeft"];
	  gatewayTop = testData["gatewayTop"];
      gatewayFloor = testData["gatewayFloor"];
	  floors = testData["floorArray"];
	  if(!testCompleted){
		$("#imageSource").append("<div class='gateway' id='" + gatewayID + "'></div>");
		for(var m = 0; m<manifestJsonArray.length; m++){
			if(manifestJsonArray[m]["floor"] == gatewayFloor){
				imagePath = manifestJsonArray[m]["imagePath"];
				if(imagePath != undefined){
					$("#con").css('background-image','url('+imagePath+')');
				}
				imageWidth =	manifestJsonArray[m]["size"]["width"];
				imageHeight =	manifestJsonArray[m]["size"]["height"];
				posX = gatewayLeft * (divWidth/imageWidth) +container.getBoundingClientRect().left ;
				posY = gatewayTop * (divHeight/imageHeight) +container.getBoundingClientRect().top  + window.pageYOffset;
				initPlaceMarker($("#"+gatewayID)[0],posX,posY);
			}
		}	
	  }
        
      for (var j in floors){ //j == Floor'floorNo'
        var floorData = floors[j];
        nodeList = floorData["nodeList"];
        //console.log(floorData);
        var newNodeList = [];
        for (var k in nodeList){ //k = pointID
          var nodeData = nodeList[k];
         // console.log(nodeData);
          markerID = nodeData["markerID"];
          nodeID = nodeData["nodeID"];
          infoID = nodeData["infoID"];
          signal = nodeData["signal"];
          status = nodeData["status"];
          posLeft = nodeData["posLeft"] ; 
          posTop = nodeData["posTop"] ; 
          nodeName = nodeData["nodeName"];
          area = nodeData["area"];
          test = nodeData["testNo"]
          pointID = nodeData["pointID"];
          active = nodeData["active"];

          if (markerID != null && posLeft != null && posTop != null){
            var n = new Node(markerID, nodeID, location, nodeName, infoID,area,pointID,active); //create new node according to json
            n.status = status;

            n.updatePosition(posLeft, posTop);
			
			if(!testCompleted && active == "true"){
				createNodeContainer(n); // create node container (info) according to json
				$("#"+n.nodeID).hide();
				newNodeList.push(n); // add node to nodeList
			}
            //console.log(n);
            var nCount = parseInt(nodeID.slice(4, nodeID.length));
            initNodeCount.push(nCount); //Needed to get unique Node/Point ID
            nodeCount++;

          }
          else{
           //console.log("something went wrong here :(");
          }

      }
	  if(!testCompleted){
		newFloorArray.push([j,newNodeList]); 
	  }
      //console.log("New Floor added: "+j);
    }
    var newTest = new Test(i,gatewayID,gatewayLeft,gatewayTop,gatewayFloor,newFloorArray);
    var mCount = parseInt(i.slice(4, i.length));
    initTestCount.push(mCount); //Needed to get unique Test ID
	if(!testCompleted){
		testArray.push(newTest);
		gatewayPlaced =true;
		$("#addGateway").hide();
		$("#inputInfo").show();
	}
	newFloorArray = [];

  }


    for (i =0 ; i <testArray.length;i++){ //Test
	  if(testArray[i].floorArray != null){
		for(j = 0; j<testArray[i].floorArray.length;j++){ //floors
			var nodes = testArray[i].floorArray[j][1];
			for(var m = 0; m<manifestJsonArray.length; m++){
				if(manifestJsonArray[m]["floor"] == testArray[i].floorArray[j][0]){
					imageWidth = manifestJsonArray[m]["size"]["width"];
					imageHeight = manifestJsonArray[m]["size"]["height"];
				}
			}
			
			for(k = 0; k<nodes.length;k++){    //nodes
				var node = testArray[i].floorArray[j][1][k]; //1 node class
				var top = node.posTop * (divHeight/imageHeight) +container.getBoundingClientRect().top + window.pageYOffset;
				var left = node.posLeft * (divWidth/imageWidth) +container.getBoundingClientRect().left ;
				node.updatePosition(left,top);
				initMarker(node.markerID, left, top);
				
			}
		}
		switchSites(testArray[i].gatewayFloor);
	  }
    }
	
    var mLargest = 0;
    var nLargest = 0;
    for (var i = 0; i<initTestCount.length; i++){
      if (initTestCount[i]>mLargest){
        mLargest = initTestCount[i];
      }
    }
    testCounter = mLargest;

    for (var i = 0; i<=initNodeCount.length; i++){
      if (initNodeCount[i]>nLargest){
        nLargest = initNodeCount[i]
      }
    }
    
    nodeCount = nLargest + 1;
    console.log("~~~~~~~~~~~~~~~~~~~~~~~ Finished ~~~~~~~~~~~~~~~~~~~~~~~~~")
  });

});



//================================================================================
function initMarker(markerID, xPos, yPos){ //add or move a marker
  if(modeArray.enabled){
    if(modeArray.addingMode && !modeArray.movingMode){ //Create marker if not in moving mode
      var container = document.querySelector("#imageSource");
      var initMarker = document.createElement("div");
      container.append(initMarker); //create new div in #imageSource
      initMarker.classList.toggle("marker"); // give .marker class css to the new div
      initMarker.id = markerID;
      $("#"+markerID).hide();
      initPlaceMarker(initMarker, xPos, yPos);
      console.log("Maker is added");
    }
  }
}

function initPlaceMarker(initMarkerDiv, xPos, yPos){ //Used to move a Marker around
  initMarkerDiv.style.left =xPos+ "px"; 
  initMarkerDiv.style.top =yPos+ "px"; 
}
var prevSelectedNode;
function changeSelectedNode(newNode){
  var count = 0;
  $("#addNode").show();
  $("#cancel").show();
  prevSelectedNode = selectedNode;
  selectedNode = newNode;

  for (i = 0; i<buttonArray.length;i++){
    $("#"+buttonArray[i]).attr('disabled',false); //loop through buttons to enable it
  }
  //$("#"+newNode).attr('disabled',true);

  if (prevSelectedNode != "" && prevSelectedNode != selectedNode){ // will not pass if there is no prevSelectedNode and if user click on same button again
    $("#"+prevSelectedNode).removeClass("addBorder");
  }

  $("#"+newNode).addClass("addBorder");
  selectiveDisableNodeButton(); //disable those selected ones


}

function disableAllNodeButton(){  //disable all node buttons 
  for (i = 0; i<buttonArray.length;i++){
    $("#"+buttonArray[i]).attr('disabled',true);
  }
}

function enableAllNodeButton(){
  for (i = 0; i<buttonArray.length;i++){
    $("#"+buttonArray[i]).attr('disabled',false);
  }
}

function selectiveDisableNodeButton(){ //only disable those that are selected 
  var nodeList = getAllActiveNode();
  for (var i = 0; i<nodeList.length; i++){
    for (var j = 0; j<buttonArray.length; j++){
      if (nodeList[i]["nodeName"] == buttonArray[j]){
        $("#"+ nodeList[i]["nodeName"]).attr('disabled', true);
        $("#" +nodeList[i]["nodeName"]).removeClass("addBorder");
      }
    }
  }
}

function removeFromArray(itemName){ //Remove Btn
  $("#"+itemName).remove();
  removeNode(itemName);
}
function removeUnwantedMarker(){
  if(newMarker != null){
    $("#"+newMarker.id).remove();
  }
}

//Markers 

function addGatewayPressed(){
  addGatewayButtonPressed = true;
  testCounter++;
  var testNo = "Test"+testCounter;
  var gatewayID = "gateway"+testCounter;
  var container = document.querySelector("#imageSource");
  if(addGatewayButtonPressed == true){
	  var newFloorArray = [];
	  for(var m = 0; m<manifestJsonArray.length; m++){
	      newFloorArray.push([manifestJsonArray[m]["floor"],[]])
	  }
      var test = new Test(testNo, gatewayID, parseInt(gatewayUniqueMarker.style.left), parseInt(gatewayUniqueMarker.style.top), currentFloor, newFloorArray); //testNo, gatewayID, gatewayLeft, gatewayTop, area,
      testArray.push(test);
      $.post("./createConfigHTML.php",
      {
        markerID: gatewayID,
        posLeft: (test.gatewayLeft - container.getBoundingClientRect().left) *(imageWidth/divWidth),
        posTop:  (test.gatewayTop - container.getBoundingClientRect().top -window.pageYOffset) *(imageHeight/divHeight),
        area: currentFloor,
        test: testNo,
		floorArray: newFloorArray
      },
      function(){
        console.log("Gateway Info Sent to ConfigHTML");
      });
      gatewayPlaced = true;
      gatewayUniqueMarker = null;
      gatewayUniqueContainer = null;

    }
  $("#addGateway").hide();
  $("#inputInfo").show();
  return;
}

function createNewMarker(){ //add or move a a marker
  if(!gatewayPlaced){
    $("#addGateway").attr('disabled',false);
    var gatewayID = "gateway"+(testCounter+1);
    if (gatewayMarkerAdded == false){
      $("#imageSource").append('<div class="gateway" id="' +gatewayID+ '"></div>');
      gatewayUniqueMarker = document.getElementById(gatewayID);
      gatewayUniqueContainer = $("#imageSource")[0];
      gatewayMarkerAdded = true;
    }

    if(addGatewayButtonPressed == false){
      moveMarker(gatewayUniqueMarker);
      console.log('still moving gateway maker');
    }
    
    
    return;
  }

  if (addButtonPressed == true){ //if "add" is pressed, reset modes.
    modeArray.addingMode = true;
    addButtonPressed = false;
  }
  
  if(modeArray.enabled){
    if (modeArray.viewingMode){
      if(modeArray.movingMode){
        var marker = document.getElementById(selectedMarkerID);
        moveMarker(marker);
      }
      return;
    }
    if(modeArray.addingMode && !modeArray.movingMode){ //Create marker if not in moving mode
      for (i = 0; i<buttonArray.length;i++){
        $("#"+buttonArray[i]).attr('disabled',false);
      }
      selectiveDisableNodeButton();
      $("#addNode").attr("value","Add");
      $("#addNode").attr("onclick", "addPressed()")
      console.log("change to addPressed");
      var container = document.querySelector("#imageSource");
      newMarker = document.createElement("div"); 
      container.append(newMarker); //create new div in #imageSource
      newMarker.classList.toggle("marker"); // give .marker class css to the new div
      newMarker.id = "marker" + (nodeCount);
      moveMarker(newMarker);
      modeArray.addingMode = false;
      console.log("maker is added");
    }
    else if (!addButtonPressed && !modeArray.movingMode){
      moveMarker(newMarker);
    }
  }
  console.log("this is created" + newMarker.id);

  //check if all node have been used
  var count = 0;
  for(i = 0; i<buttonArray.length;i++){
    if (document.getElementById(buttonArray[i]).hasAttribute("disabled")){
      count++;
    }
  }
  if (count == buttonArray.length){
    var ans  = confirm("All node has been used, would you like to reuse the node? (Press 'OK' to continue)");
    if (ans == true) {
      enableAllNodeButton();
    } 
    else {
		
      return;
    }
  }
}

function showAlert(){
  document.getElementById("formContainerID").style.display = "none";
  document.getElementById("alertForm").style.display = "flex";
}

function hideAlert(){
  document.getElementById("formContainerID").style.display = "flex";
  document.getElementById("alertForm").style.display = "none";
}



function removeMarker(markerID){  //Runs when btnDeleteMarker is clicked
  //if(markerID != "None"){ //doesn't run when there isn't a marker selected
  var node = getNodeByMarkerID(markerID);

  removeUnwantedMarker();
  modeArray.viewingMode =false;
  modeArray.addingMode =true;
  if(!modeArray.movingMode){
    $.post("deleteJsonObj.php",
    {
      test: "Test"+(testCounter),
      area: node.area,
      pointID: node.pointID,
	  infoID: node.infoID
    },
    function(){
      console.log("Info Sent to deleteJson php");
    });
    

    $("#errorText").hide(); // remove if unnecessary 
    removeFromArray(markerID); //Function to remove marker,
  }
  
  else{
    alert("Exit from Editing to delete");
  }
   
  
}

function showCoords(event) {
  //getMetaDo('../Image/dummyButSmaller.jpg'); 
  var container = document.querySelector("#imageSource");
  var xCoord = event.clientX - container.getBoundingClientRect().left;
  var yCoord = event.clientY - container.getBoundingClientRect().top;
  var pagexCoord = event.clientX;
  var pageyCoord = event.clientY;
  var coords = "Position within imageContainer:<br>" + "X coords: " + xCoord + ", Y coords: " + yCoord + "<br><br> Position within page:<br>" + "Page X coords: " + pagexCoord + ", Page Y coords: " + pageyCoord + "<br><br>" + "Image Width: " + imageWidth + ", Image Height: " +  imageHeight;
  document.getElementById("instructions").innerHTML = coords;
  //alert(coords);
}



function moveMarker(marker){ //Used to move a Marker around
  if(!modeArray.enabled){
    alert("Enable marker to move markers");
    return;
  }
  var container = document.querySelector("#imageSource");
  xPosition = event.clientX  - container.scrollLeft - (marker.clientWidth); //container.scrollLeft is for when the div is scrollable
  yPosition = event.clientY - container.scrollTop + window.pageYOffset - (marker.clientHeight); //container.scrollTop is for when the div is scrollable
  marker.style.left = xPosition + "px";
  marker.style.top = yPosition + "px";  
  console.log("marker is moving" + container.scrollTop +"||" +container.scrollLeft);
  return true;

}

function noSignal(markerID){ //Not Used
  var nodeName;
  var nodeList = getAllActiveNode();
  for (var i = 0; i<nodeList.length; i++){  
    if (nodeList[i].markerID == markerID){  
      nodeName = nodeList[i].nodeName;
    }
  }
  var errorText = "No connection between Node '" + nodeName + "' and Gateway, try: <br>- Moving the Gateway to a more optimal position <br>- Moving the Node to a more optimal position <br>- Checking if you have entered the right location for the node "
  document.getElementById("errorText").innerHTML = errorText;
  $("#errorText").show();

}


function addPressed(){
  var nodeID = selectedNode; 
    addButtonPressed = true;
    $("#" +selectedNode).removeClass("addBorder"); //remove the border on the button
    addNode(newMarker.id, ("nodeInfo"+nodeCount));
    selectiveDisableNodeButton();
    if (nodeExist == false){
    }
    newMarker = null; 
    
  
}

function resetNodeDiv(){
  modeArray.movingMode =false; //Swap back to Viewing
  modeArray.viewingMode = false;
  $("#Mode").text("Adding"); //Update mode text
  $("#cancelEdit").hide();
}

//Function that interact with 8-u
function editSelectedNode(markerID){
    if(!modeArray.movingMode){ //Swap to Moving
      removeUnwantedMarker();
      var node = getNodeByMarkerID(markerID);
      modeArray.viewingMode = true;
      modeArray.movingMode =true;
      selectedMarkerID = markerID;
      $("#selectedMarker").text(markerID);
      var marker = document.getElementById(selectedMarkerID);
      oldCord= [marker.style.left,marker.style.top];
      document.getElementById("Mode").innerText = "Moving"; //Update mode text
      var nodeList = getAllActiveNode();
      for (var i = 0; i<nodeList.length; i++){
        if(nodeList[i].markerID == selectedMarkerID){
          var formStatus = "Editing Node '" + nodeList[i].nodeName + "'";
          document.getElementById("formStatus").innerHTML = formStatus;
        }
      }
      $("#"+ node.nodeID +" #editNode").attr("value", "Cancel Edit");
      $("#"+ node.nodeID +" #editNode").attr("onclick", "cancelEdit()");
      
      document.getElementById("addNode").value = "Save";
      $("#addNode").show();
      document.getElementById("addNode").style.display = "block";
      $("#cancel").hide();
      document.getElementById("addNode").onclick = saveEdit;
      
      console.log("change to saveEdit");
    }

  return true;
}

function editJson(newLocation, newID, oldNodeName, posLeft, posTop){
  $.ajax({
    url: '../updateJson.php',
    type: 'POST',
    data: {oldNodeName: oldNodeName, newNodeName: newID, nodeLocation: newLocation, nodePosLeft: posLeft, nodePosTop: posTop},
    success: function(data){
      console.log(data);
    }
  });
}

function saveEdit(){
  var markerID = $("#selectedMarker").text();
  var node = getNodeByMarkerID(markerID);
  $("#"+ node.nodeID +" #editNode").attr("value", "Edit");
  $("#"+ node.nodeID +" #editNode").attr("onclick", 'editSelectedNode("'+markerID+'")');
  var newLocation = $("#locationName").val();
  var newID = $("#nodeID").val();
  
  
  if (xPosition != null && yPosition != null){
    node.updatePosition(xPosition, yPosition);
  }
  
  
  $.post("updateJson.php",
  {
    test: "Test"+(testCounter),
    area: getNodeByMarkerID(markerID).area,
    pointID: getNodeByMarkerID(markerID).pointID,
    posLeft: getRelativeImageWidth(node.posLeft),
    posTop: getRelativeImageHeight(node.posTop),
  },
  function(){
    console.log("Info Sent to ConfigHTML");
  });
  var nodeList = getAllActiveNode();
  $("#addNode").hide();
  document.getElementById("addNode").value = "Add";
/*   for (var i = 0; i<nodeList.length; i++){
    if (nodeList[i].markerID == selectedMarkerID){
      nodeList[i].editNode(newLocation, newID);
      $("#"+ node.nodeID +" #"+node.infoID).html(nodeList[i].print());
      document.getElementById("nodeInfo").innerHTML = nodeList[i].print();
      var formStatus = "Node '" + nodeList[i].nodeName + "' changes saved "
      document.getElementById("formStatus").innerHTML = formStatus;
    }
  } */


  modeArray.movingMode =false; //Swap back to Adding
  modeArray.viewingMode =false; 
  modeArray.addingMode = true;
  document.getElementById("Mode").innerText = "Adding";

}

function cancelEdit(){
  //var formStatus = "Edit Cancelled";
  //document.getElementById("formStatus").innerHTML = formStatus;
  resetNodeDiv();
  var marker = document.getElementById(selectedMarkerID);
  marker.style.left = oldCord[0];
  marker.style.top = oldCord[1];
  oldCord = [];
  var markerID = $("#selectedMarker").text();
  var node =getNodeByMarkerID(markerID);
  $("#"+ node.nodeID +" #editNode").attr("value", "Edit");
  $("#"+ node.nodeID +" #editNode").attr("onclick", 'editSelectedNode("'+markerID+'")');
  $("#addNode").hide();
  document.getElementById("locationName").value = "";
  document.getElementById("nodeID").value = "";
  modeArray.movingMode =false; //Swap back to Adding
  modeArray.viewingMode =false; 
  modeArray.addingMode = true;
}

function cancelPressed(){

  removeFromArray(newMarker.id); //Function to remove marker,
  removeUnwantedMarker();
  modeArray.viewingMode =false;
  modeArray.addingMode =true;

  disableAllNodeButton();
  for (i = 0; i<buttonArray.length;i++){ //remove all border
    $("#"+buttonArray[i]).removeClass("addBorder");
  }
  $("#cancel").hide();
  $("#addNode").hide(); 
}

function moveGateway(){
  //reset the HTML 
  var testCleared = false;
  for(i = 0; i<testArray.length;i++){
    if(!testArray[i].testCompleted){
      testArray[i].stopTest();
	  testCleared= true;
    }
  }
  if(testCleared){
	  $("#addGateway").show();
      $("#inputInfo").hide();
      addGatewayButtonPressed = false;
      gatewayPlaced = false;
      gatewayMarkerAdded = false;
	  removeUnwantedMarker();
	  markerAdded = false;
	  nodeExist = false;
      addButtonPressed  = false;  
	  modeArray ={enabled:true, addingMode:true, movingMode:false, viewingMode:false};
	  //testArray = [];
  }
  //document.getElementById("imageSource").innerHTML = ""; 
  //document.getElementById("formStatus").innerHTML = ""; 
  //document.getElementById("scrollInfoContainer").innerHTML = ""; 


  // reset all the bool stuff 


}

function testComplete(){
  var testCleared = false;
  for(i = 0; i<testArray.length;i++){
    if(!testArray[i].testCompleted){
      testArray[i].stopTest();
	  testCleared= true;
    }
  }
  if(testCleared){
	  $("#addGateway").show();
      $("#inputInfo").hide();
      addGatewayButtonPressed = false;
      gatewayPlaced = false;
      gatewayMarkerAdded = false;
	  removeUnwantedMarker();
	  markerAdded = false;
	  nodeExist = false;
      addButtonPressed  = false;  
	  modeArray ={enabled:true, addingMode:true, movingMode:false, viewingMode:false};
	  //testArray = [];
  }
  //document.getElementById("imageSource").innerHTML = ""; 
  //document.getElementById("formStatus").innerHTML = ""; 
  //document.getElementById("scrollInfoContainer").innerHTML = ""; 

}



function changeSignalStrengthNotation(markerID){
  //console.log("function is invoked");
  //console.log(markerID);
  var node = getNodeByMarkerID(markerID);
  //var element = $("#signal-strength" + node.markerID);
  $("#signal-strength" + node.markerID).removeClass();
  $("#signal-strength" + node.markerID).addClass("signal-strength");
  if (node.signal == 1){
    $("#signal-strength" + node.markerID).addClass("signal-strength-1");
	$("#"+node.markerID).css("background-color","red");
  }

  if (node.signal == 2){
    $("#signal-strength" + node.markerID).addClass("signal-strength-2");
	$("#"+node.markerID).css("background-color","rgb(255, 72, 0)");
  }

  if (node.signal == 3){
    $("#signal-strength" + node.markerID).addClass("signal-strength-3");
	$("#"+node.markerID).css("background-color","yellow");
  }

  if (node.signal == 4){
    $("#signal-strength" + node.markerID).addClass("signal-strength-4");
	$("#"+node.markerID).css("background-color","rgb(59, 177, 147)");
  }

  if (node.signal == 5){
    $("#signal-strength" + node.markerID).addClass("signal-strength-5");
	$("#"+node.markerID).css("background-color","#3BB143");
  }
}












//================================================== Node Class ====================================================
class Node{
  constructor(markerID, nodeID, location, nodeName, infoID, area,pointID,active){
    this.markerID = markerID;
    this.nodeID = nodeID;
    this.infoID = infoID;
    this.signal = 1;
    this.status = "No Signal";
    this.editNode(location,nodeName);
    this.updatePosition(xPosition,yPosition);
    this.area = area;
    this.pointID = pointID;
    this.active = active;
  }

  statusChange(){
      //this will be the function for changing status later
      this.status = "Connected";
      //console.log("Status is changed");
  }

  editNode(newLocation, newName){
    //this will be the function for editing node information later
    this.location = newLocation;
    //$("#"+this.nodeID).attr("id",newID);
    this.nodeName = newName;
  }

  updatePosition(left,top){
    this.posLeft = left;
    this.posTop = top;
  }

  getPosition(){
    return [this.posLeft,this.posTop];
  }
  
  print(){
    //console.log("i am being printed again hello.");
    //console.log(this.signal);
    var signalStrenghtBar = 
    '<div class="signal-strength" id="signal-strength' + this.markerID + '">'
    +     '<div class="bar bar-1"></div>'
    +     '<div class="bar bar-2"></div>'
    +     '<div class="bar bar-3"></div>'
    +     '<div class="bar bar-4"></div>'
    +     '<div class="bar bar-5"></div>'
    +'</div>';
    return "Name: " + this.nodeName + "<div style='display:flex; flex-direction:row; justify-content:flex-start; align-items:center;'> Signal Strength: " + /*this.signal*/ signalStrenghtBar + "</div> Status: " + this.status;

  }
}

//========================================================= main (node class) ============================================================
var nodeList = [];

function createNodeContainer(newNode){ //Used to create a new container
  
  $("#scrollInfoContainer").prepend('<div id="' +newNode.nodeID +'" class="nodeInfoContainer"</div>'); //Div to store all other div
  $("#"+newNode.nodeID).append('<div id="' +newNode.infoID +'" class="nodeInfoWrapper"</div>');//Div that showcase node info
  $("#"+newNode.infoID).html(newNode.print());

  console.log("Elements created");
  //Buttons
  $("#"+newNode.nodeID).append('<div id="Temp" class="nodeButtonWrapper"</div>'); //Div container the buttons

  for (var i = 0; i<2;i++){
    var buttonID;
    var onclickFunction;
    var text;
    switch(i){
      case 0: //Edit
        buttonID = "editNode"
        onclickFunction ='onclick="editSelectedNode(\''+newNode.markerID+'\')"';
        text ="Edit"
        break;
      case 1: //Delete
        buttonID = "deleteNode"
        onclickFunction ='onclick="removeMarker(\''+newNode.markerID+'\')"';
        text ="Delete"
        break;
      /* case 2: //No Signal
        buttonID = "noSignalNode"
        onclickFunction ='onclick="noSignal(\''+newNode.markerID+'\')"';
        text ="No Signal"
        break; */
    }
    $("#Temp").append('<input type="button" ' + onclickFunction  
        + ' id="' + buttonID  
        + '" value="' + text
        + '" class="nodeButton"</div>'); //Div to store all other div
    
  }
  $("#Temp").removeAttr("id");
  console.log("All Done");
}

function addNode(markerID, infoID)
{
  var nodeID = "node"+nodeCount;
  var pointID ="point"+nodeCount;
  var nodeName = selectedNode;     
  var location ="useless";
  nodeExist = false;
  selectedNode = "";
  disableAllNodeButton();
  selectiveDisableNodeButton();
  $("#addNode").hide();
  $("#cancel").hide();
  for (var i = 0; i<testArray.length; i++){
	if(!testArray[i].testCompleted){
		for(var j = 0;j<testArray[i].floorArray.length;j++){
			for(var k = 0;k<testArray[i].floorArray[j][1].length;k++){
				if(testArray[i].floorArray[j][1][k].nodeName == nodeName && (testArray[i].floorArray[j][1][k].active || testArray[i].floorArray[j][1][k].active == "true")){
					var node = testArray[i].floorArray[j][1][k];
					var testNo = testArray[i].testNo;
					//alert(node.infoID);
					
					$.post("./completeNodeTest.php",
					{
						test: testArray[i].testNo,
						infoID: node.infoID
					},
					function(){
					console.log(testNo+node.infoID+" status has been updated in JSON");
					});
					node.active = false;
					$("#"+node.nodeID).remove();
					$("#"+node.infoID).remove();
					$("#"+node.markerID).remove();
					}
				}
			}
		}
  }
  if(nodeExist){
    document.getElementById("formStatus").innerHTML = "";
    alert("Node ID already exist and is active, please select a differnt node"); 
    removeUnwantedMarker();
    return;
  }
  else{ //this is supposed to be the else statement
    var n = new Node(markerID, nodeID, location, nodeName, infoID,currentFloor,pointID,true); //Last 2 = pointId , Active
    n.updatePosition(xPosition, yPosition);
    createNodeContainer(n);
    getActiveNodeListByFloor(currentFloor).push(n);
    /*console.log("Marker ID: " + n.markerID);
    console.log("Node Location: " + n.location);
    console.log("Node ID: " + n.nodeID);
	console.log("Node Top: " + n.posTop);
	console.log("Node Left: " + n.posLeft);	
	console.log("Node Relative Top: " + getRelativeImageHeight(n.posTop));
	console.log("Node Relative Left: " + getRelativeImageWidth(n.posLeft));*/
    var pointID = n.pointID;
	console.log(n);
    $.post("./createConfigHTML.php",
  {
    nodeName: nodeName,
    markerID: markerID,
    nodeID: nodeID, 
    infoID: infoID,
    posLeft: getRelativeImageWidth(n.posLeft),
    posTop:  getRelativeImageHeight(n.posTop),
    area: currentFloor,
    test: "Test"+(testCounter),
    pointID: pointID,
    active: true
  },
  function(){
    console.log("Info Sent to ConfigHTML");

  });
  
  }
  nodeCount++;
}

function removeNode(markerID){
  var newList = getActiveNodeListByFloor(currentFloor);
  for(var i = 0; i<newList.length; i++){
    if (newList[i].markerID == markerID){
        $("#"+newList[i].nodeID).remove();
        newList.splice(i, 1);
        console.log("remove success");
    }
  }
}

function getNodeByMarkerID(markerID){
  for(var i = 0;i<testArray.length;i++){ //loop all the sites
    if(!testArray[i].testCompleted){
      for(j = 0; j <testArray[i].floorArray.length;j++){
        if(testArray[i].floorArray[i][1] !== undefined){ //in case site is created but no markers was added
          if(testArray[i].floorArray[j][0]== currentFloor){
            for(var k = 0;k< testArray[i].floorArray[j][1].length; k++){ //Loop the nodes in that site
              if(testArray[i].floorArray[j][1][k].active){
				if(testArray[i].floorArray[j][1][k].markerID == markerID){
				  return(testArray[i].floorArray[j][1][k]);
				}
                //console.log("NODE FOUND "+testArray[i].floorArray[j][1][k].markerID);
              }
            }
          }
        }
      }
    }
  }
}

function getActiveNodeListByFloor(floor){//Get or Create new floor
  for(var i = 0;i<testArray.length;i++){ //loop all the sites
    if(!testArray[i].testCompleted){
      for(j = 0; j <testArray[i].floorArray.length;j++){
        if(testArray[i].floorArray[i][1] != undefined){ //in case site is created but no markers was added
          if(testArray[i].floorArray[j][0]== floor){
            return (testArray[i].floorArray[j][1]);
          }
        }
      }
    }
  }
  //Create a new Floor if it does not exist
  for(i = 0; i < testArray.length; i++){
    if(!testArray.testCompleted){
        floorNo = testArray[i]['floorArray'].length;//index of empty floor
        testArray[i]['floorArray'][floorNo] = []
        testArray[i]['floorArray'][floorNo][0] = currentFloor;
        testArray[i]['floorArray'][floorNo][1] = [];
        return testArray[i]['floorArray'][floorNo][1];
      }
  }
}
function getAllActiveNode(){
  var allNodes = [];
    for(var i = 0;i<testArray.length;i++){ //loop all the sites
      if(!testArray[i].testCompleted){
		if(testArray[i]['floorArray'] != undefined){
			for(floor = 0; floor <testArray[i]['floorArray'].length;floor++){ // all floor
				if(testArray[i]['floorArray'][floor][1] != undefined){ //in case site is created but no markers was added
					for(k = 0;k<testArray[i]['floorArray'][floor][1].length; k++){
						if(testArray[i].floorArray[floor][1][k].active){
							allNodes.push(testArray[i]['floorArray'][floor][1][k]);
						}		
					}
				}
			}
		}
      }
  }
  //console.log(allNodes);
  return allNodes;
}

function getRelativeImageWidth(width){
  var container = document.querySelector("#imageSource");
  //console.log(getNodeByMarkerID(markerID).posLeft);
  return (width-container.getBoundingClientRect().left) *(imageWidth/divWidth); //
}
function getRelativeImageHeight(top){
  var container = document.querySelector("#imageSource");
  return (top- container.getBoundingClientRect().top -window.pageYOffset) *(imageHeight/divHeight);//
}

//Sites Related Functinos
function switchSites(newSite){ //Toggle between Sites

  var imagePath;
  var newImgWidth, newImg;
  console.log("Previous Site: "+ currentFloor);
  clearSite(currentFloor);
  remapMarkers(newSite);
  console.log("Current Site: "+ currentFloor);
  for(var m = 0; m<manifestJsonArray.length; m++){
	if(manifestJsonArray[m]["floor"] == newSite){
		imagePath = manifestJsonArray[m]["imagePath"];
   		if(imagePath != undefined){
			$("#con").css('background-image','url('+imagePath+')');
		}
		imageWidth =	manifestJsonArray[m]["size"]["width"];
		imageHeight =	manifestJsonArray[m]["size"]["height"];
		}
	}
}
function remapMarkers(newSite){
  for(var i = 0;i<testArray.length;i++){ //loop all the sites
    if(!testArray[i].testCompleted){
		console.log(testArray[i].testNo);
		if(testArray[i].gatewayFloor == newSite){
			$("#"+testArray[i].gatewayID).show();
		}
      for(j = 0; j <testArray[i].floorArray.length;j++){
        if(testArray[i].floorArray[i][1] !== undefined){ //in case site is created but no markers was added
          if(testArray[i].floorArray[j][0]== newSite){
            for(var k = 0;k< testArray[i].floorArray[j][1].length; k++){ //Loop the nodes in that site
              $("#"+testArray[i].floorArray[j][1][k].markerID).show();
              $("#"+testArray[i].floorArray[j][1][k].nodeID).show();  
              //console.log(testArray[i].floorArray[j][1][k].markerID+" shown");
            }
          }
        }
      }
    }
  }
  currentFloor = newSite; // change to site
  console.log(currentFloor +" Added")
}

function clearSite(currentFloor){
  for(var i = 0;i<testArray.length;i++){ //loop all the sites
    if(!testArray[i].testCompleted){
		console.log(testArray[i].testNo);
		if(testArray[i].gatewayFloor == currentFloor){
			console.log(testArray[i].gatewayID);
			$("#"+testArray[i].gatewayID).hide();
		}
      for(j = 0; j <testArray[i].floorArray.length;j++){
        if(testArray[i].floorArray[i][1] !== undefined){ //in case site is created but no markers was added
          if(testArray[i].floorArray[j][0]== currentFloor){
            for(var k = 0;k< testArray[i].floorArray[j][1].length; k++){ //Loop the nodes in that site
              $("#"+testArray[i].floorArray[j][1][k].markerID).hide();
              $("#"+testArray[i].floorArray[j][1][k].nodeID).hide();  
              //console.log(testArray[i].floorArray[j][1][k].markerID+" hidden");
            }
          }
        }
      }
    }
  }
  console.log(currentFloor +" Cleared")
}
//========================================================== Test Class ==================================================================
class Test{
  constructor(testNo, gatewayID, gatewayLeft, gatewayTop, area, floorArray){
    this.testNo = testNo;
    this.gatewayID = gatewayID;
    this.gatewayLeft = gatewayLeft;
    this.gatewayTop = gatewayTop;
    this.gatewayFloor = area;
    this.floorArray = floorArray; //floorArray = [["F1",nodeList[node,node]],["F2",[nodeList[node,node]]]]
    this.testCompleted = false;
    console.log("Test created");
  }
  
  stopTest(){
    if(!this.testCompleted){
	  console.log("START:" + this.floorArray);
	  var testNo = this.testNo;
	  $("#"+this.gatewayID).remove();
        for(i = 0; i < this.floorArray.length;i++){//Floors
		//console.log(this.floorArray);
		if(this.floorArray[i][1]!= undefined){
		  if(this.floorArray[i][1].length> 0){
			for(j = 0 ; j <this.floorArray[i][1].length;j++){ //Nodes
				var node = this.floorArray[i][1][j];
				console.log(node)
				node.active =false;
				$("#"+node.markerID).remove();
				$("#"+node.nodeID).remove();
				$("#"+node.infoID).remove();
				}
			}
		}
      }
	  $.post("./completeTest.php",
      {
        test: testNo
      },
      function(){
        console.log(testNo+" status has been updated in JSON");
      });
	  this.testCompleted =true;
	  console.log(this.floorArray);
    }
  }

}
//===================================================== Update Config =============================================================
//node constructor(markerID, nodeID, location, nodeName, infoID, area,pointID,active)
function updateSignal(){
  var jsonFilePath = "getActiveItems.php"; //which file to look at 
  var searchKey = "signal"; //what to search for
  $.ajaxSetup({cache:false}); //disable cache so it can update 
  $.getJSON(jsonFilePath, function(data){
    //console.log(data);
	if(data != ""){
	var nodeList = getActiveNodeListByFloor(currentFloor);
    for (var i in data){ //Test0,1,2,3
      var testData = data[i]; //data in Test0,1,2,3
      var floorArrayData = testData["floorArray"];  //floorArray in Test
      for (var j in floorArrayData){ 
        if (j == currentFloor){
          //console.log("DATA: "+testData);
          var nodeListData = floorArrayData[j]["nodeList"]; //each points in nodeList
          //console.log(nodeListData); 
          for (var k = 0; k<nodeList.length; k++){
            for (l in nodeListData){
              if (nodeList[k].pointID == l){
				//console.log(getNodeByMarkerID(nodeList[k].markerID).signal);
                nodeList[k].signal = nodeListData[l]["signal"];
				//console.log(getNodeByMarkerID(nodeList[k].markerID).signal);
                //console.log(nodeList[k].signal);
				$("#"+ nodeList[k].infoID).html(nodeList[k].print());
				if (nodeList[k].signal != 0){
					nodeList[k].statusChange();
					changeSignalStrengthNotation(nodeList[k].markerID);
				}
				if(nodeList[k].active =="true" || nodeList[k].active){
					//changeSignalStrengthNotation(nodeList[k].markerID);
				}
                //console.log("reading from json and printing info out");
              }
            }
          }
        }
      }
    }
	}
  });
}

$("document").ready(function(){
  setInterval(updateSignal, 1000);
}); 

function upperCaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function sliceURL(url){
	var delimiter = "#";
	var counter = 0;
	for (var i = 0; i<url.length;i++){
		counter++;
		if (url[i] == delimiter)
		{
			break;
		}
	}

	//here u shd have the delimiter count 
	return url.slice(counter, url.length);
} 