//Global varibles
var xPosition,yPosition;
var newMarker;
var markerCount = 0,nodeCount = 0;
var markerAdded = false;
var nodeExist = false;
var addButtonPressed  = false;
var gatewayPlaced = false;
var selectedNode, selectedMarkerID = "";
var signalStrength = 1; //1 to 5 
var initMarkerCount = [], initNodeCount = [];
var buttonArray = ["A001","A002","A003","A004"], textArray = [], markerArray = [], oldCord = [], siteArray = [];
var modeArray ={enabled:true, addingMode:true, movingMode:false, viewingMode:false};
var currentSite = "";
//Site Array format [[*SiteName*,*NodeArrays[*nodes*]*],[*SiteName*,*NodeArrays[*nodes*]*]]
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
  var infoID, location, markerID, nodeID, nodeName, posLeft, posTop, signal, status, area;
  var jsonFilePath = "./config.json"; //which file to look at
  img.src = imgSrc;
  $.ajaxSetup({cache:false}); //disable cache so it can update 
  $.getJSON(jsonFilePath, function(data){
    for (var i in data){    
      var subData = data[i];
      console.log("==========================" + JSON.stringify(subData["nodeName"]) + "==========================");
      console.log(data);
      infoID = subData["infoID"];
      location = subData["location"];
      markerID = subData["markerID"];
      nodeID = subData["nodeID"];
      nodeName = subData["nodeName"];
      posLeft = subData["posLeft"] ; 
      posTop = subData["posTop"] ; 
      signal = subData["signal"];
      status = subData["status"];
      area = subData["area"];
      if (markerID != null && posLeft != null && posTop != null){
        var n = new Node(markerID, nodeID, location, nodeName, infoID,area); //create new node according to json
        n.status = status;
        //posLeft = posLeft *(divWidth/imageWidth) +container.getBoundingClientRect().left -15  ; //Downscale to where it should be on the container

        if($("#"+area).length == 0 && area != undefined){ //Create the floorSelect button if it doesn't already exist
          $("#floorSelectionWrapper").append("<input type='button' class='button' id='" + area + "' onclick=switchSites('"+area+"') value='" +area+ "'></input>");
          siteArray.push([area]); 
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

    if (siteArray[0] != undefined){ //check if there is any site added
      currentSite = siteArray[0][0];
     switchSites(siteArray[0][0]);
    }
    else{
      currentSite = "Site1";
    }
    //Site Array format [[*SiteName*,*NodeArrays[*nodes*]*],[*SiteName*,*NodeArrays[*nodes*]*]]
    for (i = 0; i< siteArray.length;i++){
      var siteNodes = [];
      for (j = 0; j< nodeList.length;j++){
        if(siteArray[i][0] == nodeList[j].area){
          siteNodes.push(nodeList[j]);
        }
      }
      siteArray[i][1] = siteNodes;
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

function removeFromArray(arrayList,itemName){ //Remove Btn
  //document.getElementById("nodeInfoContainer").style.display = "none";
  for (i = 0; i < arrayList.length; i++){
    if(arrayList[i].id == itemName){
      arrayList.splice(i,1);
    }
  }
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

function createNewMarker(){ //add or move a a marker
  if(!gatewayPlaced){
    
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
    for (var i = 0; i<markerArray.length; i++){
      if (markerArray[i].id == markerID){ //Change css of selected marker
        markerArray[i].style.opacity = 0.5;
        markerArray[i].style.zIndex = 3; //Bring markers to the front
        markerArray[i].style.backgroundColor ="green";
      }
      else{ //Revert css of other markers
        markerArray[i].style.opacity = 1;
        markerArray[i].style.zIndex = 1; //Bring markers to the back
        markerArray[i].style.backgroundColor ="red";
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
  removeFromArray(markerArray, markerID); //Function to remove marker,
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
    markerArray.push(newMarker);
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

//Function that interact with Node Class
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
    area: currentSite
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
  removeFromArray(markerArray, newMarker.id); //Function to remove marker,
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
        textToWrite += "============NEXT NODE=========\r\n";
      }
    }
  }).done(function(d) {
    textToWrite += "======END=========";
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
  for (var i = 0; i<siteArray.length;i++)
  {
    siteArray[i][1] = [];
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

//=========================================== main (node class) ====================================================
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
    var n = new Node(markerID, nodeID, location, nodeName, infoID,currentSite);
    n.updatePosition(xPosition, yPosition);
    createNodeContainer(n);
    nodeList.push(n);
    for (i = 0; i< siteArray.length;i++){
      var siteNodes = [];
      for (j = 0; j< nodeList.length;j++){
        if(siteArray[i][0] == nodeList[j].area){
          siteNodes.push(nodeList[j]);
        }
      }
      siteArray[i][1] = siteNodes;
    }
    console.log("Marker ID: " + n.markerID);
    console.log("Node Location: " + n.location);
    console.log("Node ID: " + n.nodeID);
    //alert("ImgWidth:"+getNodeByMarkerID(markerID).posLeft+"IMG" + imageWidth +"Div " + divWidth);
    //alert("ImgHeight:"+getNodeByMarkerID(markerID).posTop+"IMG" + imageHeight +"Div " + divHeight);
    //alert((getNodeByMarkerID(markerID).posLeft-container.getBoundingClientRect().left) *(imageWidth/divWidth)+ "|||||" +(getNodeByMarkerID(markerID).posTop- container.getBoundingClientRect().top) *(imageHeight/divHeight));
    $.post("./createConfigHTML.php",
  {
    nodeName: nodeName,
    markerID: markerID,
    nodeID: nodeID, 
    infoID: infoID,
    posLeft: getRelativeImageWidth(markerID),
    posTop:  getRelativeImageHeight(markerID),
    location: location,
    area: currentSite
  },
  function(){
    alert("Info Sent to ConfigHTML");
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
  console.log("Previous Site: "+ currentSite);
  clearSite(currentSite);
  remapMarkers(newSite);
  console.log("Current Site: "+ currentSite);
}
function remapMarkers(newSite){
  for(var i = 0;i<siteArray.length;i++){ //loop all the sites
    if(siteArray[i][0] == newSite ){
      currentSite = newSite; // change to site
      if(siteArray[i][1] !== undefined){ //in case site is created but no markers was added
        for(var j = 0;j< siteArray[i][1].length; j++){ //Loop the nodes in that site
          $("#"+siteArray[i][1][j].markerID).show();
          $("#"+siteArray[i][1][j].nodeID).show();  
        }
      }
      console.log(currentSite +" Added")
    }
  }
}

function clearSite(currentSite){
  for(var i = 0;i<siteArray.length;i++){ //loop all the sites
    if(siteArray[i][0] == currentSite ){
      if(siteArray[i][1] !== undefined){ //in case site is created but no markers was added
        for(var j = 0;j< siteArray[i][1].length; j++){ //Loop the nodes in that site
          $("#"+siteArray[i][1][j].markerID).hide();
          $("#"+siteArray[i][1][j].nodeID).hide();  
          //$("#selectedMarker").text("None");
          //selectedMarkerID ="";
        }
      }
    }
    console.log(currentSite +" Cleared")
  }
}

//================================================= Update Config =================================================
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
