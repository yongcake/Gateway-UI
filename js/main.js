//Global varibles
var xPosition,yPosition;
var newMarker;
var markerCount = 0, nodeCount = 0 ,testCounter = 0;;
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
var initMarkerCount = [], initNodeCount = [];
var buttonArray = ["A001","A002","A003","A004","A005","A006"], testArray = [], oldCord = [], floorArray = [];
var modeArray ={enabled:true, addingMode:true, movingMode:false, viewingMode:false};
var currentFloor = "";
//Old Site Array format [[*Floor*,*NodeArrays[*nodes*]*],[*Floor*,*NodeArrays[*nodes*]*]]
//New Site Array format [ [*TestNO*,true,[GatewayID,GatewayLeft,GatewayTop,[*Floor*,*NodeArrays[*nodes*]*]*]] , [*TestNO*,true,[GatewayID,GatewayLeft,GatewayTop,[*Floor*,*NodeArrays[*nodes*]*]*]] ]
var imageWidth = 0;
var imageHeight = 0;
var divWidth = 0;
var divHeight = 0;
var imgSrc = '../Image/dummy.png'; //'../Image/dummyButSmaller.jpg';
var img = new Image();
//img.addEventListener("load", function(){
    //alert("divWIDTH:" +divWidth +" DIVHEIGHT:"+divHeight);
    //divWidth = document.getElementById("imageSource").offsetWidth;
    //divHeight = document.getElementById("imageSource").offsetHeight
    //alert("divWIDTH:" +this.naturalWidth +" DIVHEIGHT:"+this.naturalHeight);
//    return "Image Width: " + imageWidth + ", Image Height: " +  imageHeight;
//});

$(document).ready( function(){
  console.log("~~~~~~~~~~~~~~~~~~~~~~ Initializing ~~~~~~~~~~~~~~~~~~~~~~")
  var testCompleted, testNo, gatewayID, gatewayLeft, gatewayTop, gatewayFloor, floorArray, floor, nodeList, infoID, location, markerID, nodeID, nodeName, posLeft, posTop, signal, status, area, test;
  var jsonFilePath = "./config.json"; //which file to look at
  img.src = imgSrc;
  $("#inputInfo").hide();
  $.ajaxSetup({cache:false}); //disable cache so it can update 
  $.getJSON(jsonFilePath, function(data){
    for (var i in data){    
      var testData = data[i]; //info inside "testn"
      console.log("==========================" + JSON.stringify(subData["testNo"]) + "==========================");
      console.log(data);
      testCompleted = testData["testCompleted"];
      testNo = testData["testNo"];
      gatewayID = testData["gatewayID"];
      gatewayLeft = testData["gatewayLeft"];
      gatewayTop = testData["gatewayTop"];
      gatewayFloor = testData["gatewayFloor"];
      floorArray = testData["floorArray"];

      for (var j in floorArray){
        var floorData = j;
        floor = j["floor"];
        nodeList = j["nodeList"];

        for (var k in nodeList){
          var nodeData = k;

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

          if (markerID != null && posLeft != null && posTop != null){
            var n = new Node(markerID, nodeID, location, nodeName, infoID,area); //create new node according to json
            n.status = status;
            //posLeft = posLeft *(divWidth/imageWidth) +container.getBoundingClientRect().left -15  ; //Downscale to where it should be on the container

            if($("#"+area).length == 0 && area != undefined){ //Create the floorSelect button if it doesn't already exist
              $("#floorSelectionWrapper").append("<input type='button' class='button' id='" + area + "' onclick=switchSites('"+area+"') value='" +area+ "'></input>");
              floorArray.push([area]); 
            }
            n.updatePosition(posLeft, posTop);

            createNodeContainer(n); // create node container (info) according to json
            $("#"+n.nodeID).hide();
            nodeList.push(n); // add node to nodeList
          

            var mCount = parseInt(markerID.slice(6, markerID.length));
            initMarkerCount.push(mCount);
            markerCount++;

            var nCount = parseInt(nodeID.slice(4, nodeID.length));
            initNodeCount.push(nCount);
            nodeCount++;

          }
          else{
           //console.log("something went wrong here :(");
          }
      }
    }
  }
    imageWidth = img.naturalWidth;
    imageHeight = img.naturalHeight;
    var container = document.querySelector("#imageSource");
    divWidth = document.getElementById("imageSource").offsetWidth;
    divHeight = document.getElementById("imageSource").offsetHeight
    //alert("divWIDTH:" +divWidth +" DIVHEIGHT:"+divHeight);
    //alert("imageWIDTH:" +imageWidth +" imageHEIGHT:"+imageHeight);
    for (i =0 ; i <nodeList.length;i++){

      var top = nodeList[i].posTop * (divHeight/imageHeight) +container.getBoundingClientRect().top -15 + window.pageYOffset;
      var left = nodeList[i].posLeft * (divWidth/imageWidth) +container.getBoundingClientRect().left -15;
      nodeList[i].updatePosition(left,top);
      initMarker(nodeList[i].markerID, left, top);
    }

    if (floorArray[0] != undefined){ //check if there is any site added
      currentFloor = floorArray[0][0];
     switchSites(floorArray[0][0]);
    }
    else{
      currentFloor = "Floor1";
        $("#floorSelectionWrapper").append("<input type='button' class='button' id='Floor1' onclick=switchSites('Floor1') value='Floor1'></input>"); //Remove this after modifying
    }
    //Site Array format [[*SiteName*,*NodeArrays[*nodes*]*],[*SiteName*,*NodeArrays[*nodes*]*]]
    for (i = 0; i< floorArray.length;i++){
      var siteNodes = [];
      for (j = 0; j< nodeList.length;j++){
        if(floorArray[i][0] == nodeList[j].area){
          siteNodes.push(nodeList[j]);
        }
      }
      floorArray[i][1] = siteNodes;
    }

    var mLargest = 0;
    var nLargest = 0;
    for (var i = 0; i<initMarkerCount.length; i++){
      if (initMarkerCount[i]>mLargest){
        mLargest = initMarkerCount[i];
      }
    }
    markerCount = mLargest + 1;

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
  initMarkerDiv.style.left =xPos+ "px"; //Calculator where it should be on the container
  initMarkerDiv.style.top = yPos+ "px"; //Calculator where it should be on the container
}

function changeSelectedNode(newNode){
  $("#addNode").show();
  $("#cancel").show();
  selectedNode = newNode;
  for (i = 0; i<buttonArray.length;i++){
    $("#"+buttonArray[i]).attr('disabled',false);
  }
  $("#"+newNode).attr('disabled',true);
}

function disableAllNodeButton(){
  for (i = 0; i<buttonArray.length;i++){
    $("#"+buttonArray[i]).attr('disabled',true);
  }
}

function removeFromArray(itemName){ //Remove Btn
  //document.getElementById("nodeInfoContainer").style.display = "none";
  $("#"+itemName).remove();
  removeNode(itemName);
}
function removeUnwantedMarker(){
  if(newMarker != null){
    $("#"+newMarker.id).remove();
  }
}

//Markers 

//(Not Used ATM)
function toggleMove(){ //Toggle between Viewing and Moving
  if(modeArray.viewingMode){ //Only runs if viewing is enabled
    if(!modeArray.movingMode){ //Swap to Moving
      modeArray.movingMode =true;
      document.getElementById("Mode").innerText = "Moving"; //Update mode text
      document.getElementById("btnToggleMove").innerText = "Stop Moving"; //Update toggle button text
    }
    else{
      modeArray.movingMode =false; //Swap back to Viewing
      document.getElementById("btnToggleMove").innerText = "Move Marker"; //Update toggle button text
      document.getElementById("Mode").innerText = "Viewing"; //Update mode text
    }
  }
}

function addGatewayPressed(){
  addGatewayButtonPressed = true;
  var testNo = "Test"+testCounter;
  var gatewayID = "gateway"+testCounter;
  if(addGatewayButtonPressed == true){
      var test = new Test(testNo, "gateway1", gatewayUniqueMarker.style.left, gatewayUniqueMarker.style.top, currentFloor, floorArray); //testNo, gatewayID, gatewayLeft, gatewayTop, area, floorArray
      testArray.push(test);
      //gatewayUniqueMarker = document.getElementById(gatewayID);
      //gatewayUniqueContainer = $("#imageSource")[0];
      $.post("./createConfigHTML.php",
      {
        markerID: gatewayID,
        posLeft: (gatewayUniqueMarker.style.left- gatewayUniqueContainer.getBoundingClientRect().left) *(imageWidth/divWidth),
        posTop:  (gatewayUniqueMarker.style.top - gatewayUniqueContainer.getBoundingClientRect().top -window.pageYOffset) *(imageHeight/divHeight),
        area: currentFloor,
        test: testNo
      },
      function(){
        console.log("Gateway Info Sent to ConfigHTML");
      });
      gatewayPlaced = true;
      gatewayUniqueMarker = null;
      gatewayUniqueContainer = null;
      testCounter++;
    }
  $("#addGateway").hide();
  $("#inputInfo").show();
  return;
}

function createNewMarker(){ //add or move a a marker
  if(!gatewayPlaced){
    $("#addGateway").attr('disabled',false);
    var testNo = "Test"+testCounter;
    var gatewayID = "gateway"+testCounter;
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
      //$("#addNode").show();
      //$("#cancel").show();
      for (i = 0; i<buttonArray.length;i++){
        $("#"+buttonArray[i]).attr('disabled',false);
      }
      $("#addNode").attr("value","Add");
      $("#addNode").attr("onclick", "addPressed()")
      var container = document.querySelector("#imageSource");
      newMarker = document.createElement("div"); 
      container.append(newMarker); //create new div in #imageSource
      newMarker.classList.toggle("marker"); // give .marker class css to the new div
      newMarker.id = "marker" + (markerCount);
      //newMarker.setAttribute("onclick","displayCurrentMarker(this.id)");
      moveMarker(newMarker);
      modeArray.addingMode = false;
      console.log("maker is added");
    }
    else if (!addButtonPressed && !modeArray.movingMode){
      moveMarker(newMarker);
    }
  }
  console.log("this is created" + newMarker.id);
}

function displayCurrentMarker(markerID){ //function runs when a marker is clicked (Currently not Used)
  if(modeArray.viewingMode){
    var textSelectedMarker = document.getElementById("selectedMarker");
    textSelectedMarker.innerText = markerID;
    selectedMarkerID = markerID;
    resetNodeDiv();
    for (var i = 0; i<nodeList.length; i++){
      if (nodeList[i].markerID == markerID){ //Change css of selected marker
        $("#"+nodeList[i].markerID).css("opacity", 0.5);
        $("#"+nodeList[i].markerID).css("zIndex", 3); //Bring markers to the front
        $("#"+nodeList[i].markerID).css("backgroundColor", "green"); 
      }
      else{ //Revert css of other markers
        $("#"+nodeList[i].markerID).css("opacity", 1);
        $("#"+nodeList[i].markerID).css("zIndex", 1); //Bring markers to the front
        $("#"+nodeList[i].markerID).css("backgroundColor", "red"); 
      }
    }
    //$("#btnToggleMove").show();
    //dispay information when VIEWED
    for(var i = 0; i<nodeList.length; i++){
      if (nodeList[i].markerID == markerID){
          document.getElementById("nodeInfo").innerHTML = nodeList[i].print();
          document.getElementById("nodeInfoContainer").style.display = "flex";
      }
    }
  }
}

function removeMarker(markerID){  //Runs when btnDeleteMarker is clicked
  //if(markerID != "None"){ //doesn't run when there isn't a marker selected
  removeFromArray(markerID); //Function to remove marker,
  removeUnwantedMarker();
  modeArray.viewingMode =false;
  modeArray.addingMode =true;
  if(!modeArray.movingMode){
    
    $.post("deleteJsonObj.php",
    {
      nodeName: getNodeByMarkerID(markerID).nodeName
    },
    function(){
      alert("Info Sent to ConfigHTML");
    });
    

    $("#errorText").hide(); // remove if unnecessary 
    
  }
  else{
    alert("Exit from Editing to delete");
  }
    //markerID.innerText = "None";
    //$("#btnToggleMove").hide(); 
  //}
  
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

function noSignal(markerID){
  var nodeName;
  for (var i = 0; i<nodeList.length; i++){  
    if (nodeList[i].markerID == markerID){  
      nodeName = nodeList[i].nodeName;
    }
  }
  var errorText = "No connection between Node '" + nodeName + "' and Gateway, try: <br>- Moving the Gateway to a more optimal position <br>- Moving the Node to a more optimal position <br>- Checking if you have entered the right location for the node "
  document.getElementById("errorText").innerHTML = errorText;
  $("#errorText").show();
  //removeMarker(newMarker.id);
}


function addPressed(){
  var location = $("#locationName").val(); //.value
  location = "ahh";
  var nodeID = selectedNode; 
  if (location == "" || nodeID == ""){
    alert("Please make sure both fields are filled before adding node.");
    return;
  }
  else{
    addButtonPressed = true;
    addNode(newMarker.id, ("nodeInfo"+markerCount));
    markerCount++;
    if (nodeExist == false){
      var formStatus = "Node '" + nodeID + "' added at '" + location + "'"
      document.getElementById("formStatus").innerHTML = formStatus;
    }
    newMarker = null; 
    //document.getElementById("locationName").value = "";
    //document.getElementById("nodeID").value = "";
  }
}

function resetNodeDiv(){
  modeArray.movingMode =false; //Swap back to Viewing
  modeArray.viewingMode = false;
  $("#Mode").text("Adding"); //Update mode text
  $("#cancelEdit").hide();
}

//Function that interact with 8-u
function editSelectedNode(markerID){
  //if(modeArray.viewingMode){ //Only runs if viewing is enabled
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

      for (var i = 0; i<nodeList.length; i++){
        if(nodeList[i].markerID == selectedMarkerID){
          document.getElementById("locationName").value = nodeList[i].location;
          document.getElementById("nodeID").value = nodeList[i].nodeName;
          var formStatus = "Editing Node '" + nodeList[i].nodeName + "'";
          document.getElementById("formStatus").innerHTML = formStatus;
        }
      }
      $("#"+ node.nodeID +" #editNode").attr("value", "Cancel Edit");
      $("#"+ node.nodeID +" #editNode").attr("onclick", "cancelEdit()");
      //document.getElementById("editNode").value = "Cancel Edit"; //Update toggle button text
      //document.getElementById("editNode").onclick = cancelEdit;
      
      document.getElementById("addNode").value = "Save";
      $("#addNode").show();
      $("#cancel").hide();
      document.getElementById("addNode").onclick = saveEdit;
    }
  //}
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
  var node =getNodeByMarkerID(markerID);
  var oldNodeName = node.nodeName;
  var oldLocation = node.location;
  $("#"+ node.nodeID +" #editNode").attr("value", "Edit");
  $("#"+ node.nodeID +" #editNode").attr("onclick", 'editSelectedNode("'+markerID+'")');
  //document.getElementById("editNode").value = "Edit";
  //document.getElementById("editNode").onclick = editSelectedNode(selectedMarkerID);
  var newLocation = $("#locationName").val();
  var newID = $("#nodeID").val();
  
  
  if (xPosition != null && yPosition != null){
    node.updatePosition(xPosition, yPosition);
  }
  
  $.post("updateJson.php",
  {
    oldNodeName: oldNodeName,
    oldLocation: oldLocation,
    nodeName: newID,
    markerID: markerID,
    nodeID: getNodeByMarkerID(markerID).nodeID,
    infoID: getNodeByMarkerID(markerID).infoID,
    posLeft: getRelativeImageWidth(markerID),
    posTop: getRelativeImageHeight(markerID),
    location: newLocation,
    area: currentFloor
  },
  function(){
    alert("Info Sent to ConfigHTML");
  });

  
  

  $("#addNode").hide();
  document.getElementById("addNode").value = "Add";
  for (var i = 0; i<nodeList.length; i++){
    if (nodeList[i].markerID == selectedMarkerID){
      nodeList[i].editNode(newLocation, newID);
      $("#"+ node.nodeID +" #"+node.infoID).html(nodeList[i].print());
      //document.getElementById("nodeInfo").innerHTML = nodeList[i].print();
      var formStatus = "Node '" + nodeList[i].nodeName + "' changes saved "
      document.getElementById("formStatus").innerHTML = formStatus;
    }
  }


  document.getElementById("locationName").value = "";
  document.getElementById("nodeID").value = "";
  modeArray.movingMode =false; //Swap back to Adding
  modeArray.viewingMode =false; 
  modeArray.addingMode = true;
  document.getElementById("Mode").innerText = "Adding";

}

function cancelEdit(){
  var formStatus = "Edit Cancelled";
  document.getElementById("formStatus").innerHTML = formStatus;
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
  document.getElementById("formStatus").innerHTML = "Selection Cancelled";
  //removeMarker(newMarker.id);
  removeFromArray(newMarker.id); //Function to remove marker,
  removeUnwantedMarker();
  modeArray.viewingMode =false;
  modeArray.addingMode =true;
  //$("#errorText").hide(); // remove if unnecessary
  
  //document.getElementById("locationName").value = "";
  //document.getElementById("nodeID").value = "";
  disableAllNodeButton();
  $("#cancel").hide();
  $("#addNode").hide(); 
}

function testComplete(){
  var jsonFilePath = "./nodeSetting.json"; //which file to look at
  var textToWrite ="===========Start============", nodename;
  $.getJSON(jsonFilePath, function(data){
    for (var i =0; i<nodeList.length;i++){
      nodename = nodeList[i].nodeName;
      if(data[nodename] != undefined){
        //console.log("==========================" + JSON.stringify(subData["nodeName"]) + "==========================");
        textToWrite += "Node Name: "+nodename + "\r\n";
        textToWrite += "Suitable TX Setting: " + data[nodename]["TX"]+"\r\n";
        textToWrite += "Suitable SF Setting: " + data[nodename]["SF"]+"\r\n";
        textToWrite += "Location: " + data[nodename]["location"]+"\r\n";
        textToWrite += "Highest Strength Obtain: " + data[nodename]["strength"]+"\r\n";
        textToWrite += "Floor Test: " + data[nodename]["area"]+"\r\n";
        textToWrite += "============NEXT NODE===========\r\n";
      }
    }
  }).done(function(d) {
    textToWrite += "=========END=========";
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = "";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  }).fail(function(d) {
    alert("nodeSetting.json Not Found");
  });
  for (var i = 0; i<floorArray.length;i++)
  {
    floorArray[i][1] = [];
  }
  markerArray = [];
  
  //nodeList = []; // completely clear nodeList
  document.getElementById("imageSource").innerHTML = ""; 
  document.getElementById("formStatus").innerHTML = ""; 
  document.getElementById("scrollInfoContainer").innerHTML = ""; 

}

function addSite(){
  var siteID = prompt("Floor number (e.g. F1) [for now use 'Test1/2/3/4/5]");
  var container = document.querySelector(".floorSelectionWrapper");
  var newSite = document.createElement("input");
  container.append(newSite); //create new input in .floorSelectionWrapper
  newSite.classList.add("button");
  newSite.type("button");
  newSite.id(siteID);
  newSite.value(siteID);

  //newMarker.classList.toggle("marker"); // give .marker class css to the new div
  //  newMarker.id = "marker" + (markerCount);
}

function toggleVeryWeak(){

}

function changeSignalStrengthNotation(markerID){
  //console.log("function is invoked");
  //console.log(markerID);
  var node = getNodeByMarkerID(markerID);
  if (node.signal == 1){
    var element = document.getElementById("signal-strength" + markerID);
    //console.log(element);
    //element.className = "";
    element.classList.add("signal-strength");
    element.classList.add("signal-strength-1");
  }

  if (node.signal == 2){
    var element = document.getElementById("signal-strength" + markerID);
    element.className = "";
    element.classList.add("signal-strength");
    element.classList.add("signal-strength-2");
  }

  if (node.signal == 3){
    var element = document.getElementById("signal-strength" + markerID);
    element.className = "";
    element.classList.add("signal-strength");
    element.classList.add("signal-strength-3");
  }

  if (node.signal == 4){
    var element = document.getElementById("signal-strength" + markerID);
    element.className = "";
    element.classList.add("signal-strength");
    element.classList.add("signal-strength-4");
  }

  if (node.signal == 5){
    var element = document.getElementById("signal-strength" + markerID);
    //element.className = "";
    element.classList.add("signal-strength");
    element.classList.add("signal-strength-5");
  }
}












//================================================== Node Class ====================================================
class Node{
  constructor(markerID, nodeID, location, nodeName, infoID, area){
    this.markerID = markerID;
    this.nodeID = nodeID;
    this.infoID = infoID;
    this.signal = 1;
    this.status = "No Signal";
    this.editNode(location,nodeName);
    this.updatePosition(xPosition,yPosition);
    this.area = area;
  }
  signalChange(){
      //this will be the function for changing signal later
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
    return "Name: " + this.nodeName + "<br> Location: " + this.location + "<div style='display:flex; flex-direction:row; justify-content:flex-start; align-items:center;'> Signal Strength: " + /*this.signal*/ signalStrenghtBar + "</div> Status: " + this.status;

  }
}

//========================================================= main (node class) ============================================================
var nodeList = [];

function createNodeContainer(newNode){ //Used to create a new container
  
  $("#scrollInfoContainer").append('<div id="' +newNode.nodeID +'" class="nodeInfoContainer"</div>'); //Div to store all other div
  $("#"+newNode.nodeID).append('<div id="' +newNode.infoID +'" class="nodeInfoWrapper"</div>');//Div that showcase node info
  //$("#"+newNode.infoID).html(newNode.print2() + newNode.print3() + newNode.print4());
  $("#"+newNode.infoID).html(newNode.print());

  console.log("Elements created");
  //Buttons
  $("#"+newNode.nodeID).append('<div id="Temp" class="nodeButtonWrapper"</div>'); //Div container the buttons

  for (var i = 0; i<3;i++){
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
      case 2: //No Signal
        buttonID = "noSignalNode"
        onclickFunction ='onclick="noSignal(\''+newNode.markerID+'\')"';
        text ="No Signal"
        break;
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
  var location = "Not Relavent";
  var nodeID = "node"+nodeCount;
  nodeCount++;
  var nodeName = selectedNode;
  nodeExist = false;
  selectedNode = "";
  disableAllNodeButton();
  $("#addNode").hide();
  $("#cancel").hide();
  if (location == "" || nodeID == ""){
      alert("Please make sure both fields are filled before adding node.");
      return;
  }

  for (var i = 0; i<nodeList.length; i++){
    if (nodeName == nodeList[i].nodeName){
      nodeExist = true;
    }
  }

  if(nodeExist == true){
    document.getElementById("formStatus").innerHTML = "";
    alert("Node ID already exist, please enter a non-existing ID"); 
    removeMarker(markerID);
    return;
  }
  else{ //this is supposed to be the else statement
    var n = new Node(markerID, nodeID, location, nodeName, infoID,currentFloor);
    n.updatePosition(xPosition, yPosition);
    createNodeContainer(n);
    nodeList.push(n);
    for (i = 0; i< floorArray.length;i++){
      var siteNodes = [];
      for (j = 0; j< nodeList.length;j++){
        if(floorArray[i][0] == nodeList[j].area){
          siteNodes.push(nodeList[j]);
        }
      }
      floorArray[i][1] = siteNodes;
    }
    console.log("Marker ID: " + n.markerID);
    console.log("Node Location: " + n.location);
    console.log("Node ID: " + n.nodeID);
    //testArray[x][0] = TestNo, [1] = testCompleted, [2] = floorArray 
    
    $.post("./createConfigHTML.php",
  {
    nodeName: nodeName,
    markerID: markerID,
    nodeID: nodeID, 
    infoID: infoID,
    posLeft: getRelativeImageWidth(markerID),
    posTop:  getRelativeImageHeight(markerID),
    location: location,
    area: currentFloor,
    test: testNo
  },
  function(){
    console.log("Info Sent to ConfigHTML");
  });
  
  }
}

function removeNode(markerID){
  for(var i = 0; i<nodeList.length; i++){
    if (nodeList[i].markerID == markerID){
        $("#"+nodeList[i].nodeID).remove();
        nodeList.splice(i, 1);
        console.log("remove success");
    }
  }
}

function getNodeByMarkerID(markerID){
  if(nodeList.length > 0){
    for (var i = 0; i< nodeList.length;i++){
      if(nodeList[i].markerID == markerID){
        return nodeList[i];
      }
    }
  }
  else{
    alert("No Node found");
  }
  
}

function getRelativeImageWidth(markerID){
  var container = document.querySelector("#imageSource");
  return (getNodeByMarkerID(markerID).posLeft-container.getBoundingClientRect().left) *(imageWidth/divWidth);
}
function getRelativeImageHeight(markerID){
  var container = document.querySelector("#imageSource");
  return (getNodeByMarkerID(markerID).posTop- container.getBoundingClientRect().top -window.pageYOffset) *(imageHeight/divHeight);
}

//Sites Related Functinos
function switchSites(newSite){ //Toggle between Sites
  console.log("Previous Site: "+ currentFloor);
  clearSite(currentFloor);
  remapMarkers(newSite);
  console.log("Current Site: "+ currentFloor);
}
function remapMarkers(newSite){
  for(var i = 0;i<floorArray.length;i++){ //loop all the sites
    if(floorArray[i][0] == newSite ){
      currentFloor = newSite; // change to site
      if(floorArray[i][1] !== undefined){ //in case site is created but no markers was added
        for(var j = 0;j< floorArray[i][1].length; j++){ //Loop the nodes in that site
          $("#"+floorArray[i][1][j].markerID).show();
          $("#"+floorArray[i][1][j].nodeID).show();  
        }
      }
      console.log(currentFloor +" Added")
    }
  }
}

function clearSite(currentFloor){
  for(var i = 0;i<floorArray.length;i++){ //loop all the sites
    if(floorArray[i][0] == currentFloor ){
      if(floorArray[i][1] !== undefined){ //in case site is created but no markers was added
        for(var j = 0;j< floorArray[i][1].length; j++){ //Loop the nodes in that site
          $("#"+floorArray[i][1][j].markerID).hide();
          $("#"+floorArray[i][1][j].nodeID).hide();  
          //$("#selectedMarker").text("None");
          //selectedMarkerID ="";
        }
      }
    }
    console.log(currentFloor +" Cleared")
  }
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
  
  toggleTestCompleted(){
    if(this.testCompleted){
      this.testCompleted = false;
    }
    else{
      this.testCompleted =true;
    }
  }

  updateNode(floor, nodeName,node){//Update the node object
    for(i = 0; i < this.floorArray.length;i++){  //loop all the floors
      var testNodeList = this.floorArray[i][1];
      if(this.floorArray[i][0] == floor){
        for (j = 0; j< testNodeList.length;j++){ //loop all the nodes in that floor
          if(testNodeList[j].nodeName =nodeName){
            this.floorArray[i][1][j] = node;
            return;
          }
        }
      }
    }
  }

  updateNodePos(floor, nodeName, xPosition,yPosition){  //Update a specfic node position in test Array
    for(i = 0; i < this.floorArray.length;i++){  //loop all the floors
      var testNodeList = this.floorArray[i][1];
      if(this.floorArray[i][0] == floor){
        for (j = 0; j< testNodeList.length;j++){ //loop all the nodes in that floor
          if(testNodeList[j].nodeName =nodeName){
            testNodeList[j].updatePosition(xPosition,yPosition);
            this.floorArray[i][1] = testNodeList[j];
            return;
          }
        }
      }
    }
  }

  updateNodeName(floor, nodeName, newLocation,newID){  //Update a specfic nodeName in test Array
    for(i = 0; i < this.floorArray.length;i++){ //loop all the floors
      var testNodeList = this.floorArray[i][1];
      if(this.floorArray[i][0] == floor){
        for (j = 0; j< testNodeList.length;j++){  //loop all the nodes in that floor
          if(testNodeList[j].nodeName =nodeName){
            testNodeList[j].editNode(newLocation, newID);
            this.floorArray[i][1] = testNodeList[j];
            return;
          }
        }
      }
    }
  }
}

//===================================================== Update Config =============================================================
function updateSignal(){
  var jsonFilePath = "./config.json"; //which file to look at
  var searchKey = "signal"; //what to search for
  $.ajaxSetup({cache:false}); //disable cache so it can update 
  $.getJSON(jsonFilePath, function(data){
    //console.log(data);
    for (var i = 0; i<nodeList.length; i++){ //loop through all nodes
      for (var j in data){ //loop through first key ==> j
        if (nodeList[i].nodeName == j){
          for (var k in data[j]){ //loop through sub keys ==> k
            if (k == searchKey){
              var nodeObj = data[j];
              var updatedSignal = data[j][k];
              //var updatedStatus = data[j]["status"];
              nodeList[i].signal = updatedSignal;
              nodeList[i].statusChange();
              //nodeList[i].status = updatedStatus;
              $("#"+ nodeList[i].infoID).html(nodeList[i].print());
              changeSignalStrengthNotation(nodeList[i].markerID);
              console.log("reading from json and printing info out");
              //document.getElementById(nodeList[i].infoID).innerText(nodeList[i].print());
              //console.log(nodeObj);
              //console.log(updatedSignal);
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
