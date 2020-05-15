//Global varibles
var xCoord = 0;
var yCoord = 0;
var newMarker;
var markerCount = 0;
var markerAdded = false;
var selectedMarkerID = "";
var addButtonPressed  = false;
var buttonArray = [], textArray = [], markerArray = [], oldCord = [], text;
var modeArray ={enabled:true, addingMode:true, movingMode:false, viewingMode:false};
function addText(value){ //For combining all id in an array
  text+= value.id + " "
}

//Checking Functions
function checkIDTxt(){ // used to check ids of all txts added
  text = "";
  if (textArray.length != 0){
    textArray.forEach(addText);
    alert("Current IDs for Text: "+ text);
  }
  else
  {
    alert("No ID found for Text");
  }
  
}

function checkIDBtn(){ // used to check ids of all buttons added
  text = "";
  if (buttonArray.length != 0){
    buttonArray.forEach(addText);
    alert("Current IDs for button = " + text);
  }
  else
  {
    alert("No ID found for button");
  }
}
//Addings Elements
function appendText(){ //Add a new p
  //var txt1 = "<p>Text.</p>";        // Create text with HTML
  //var txt2 = $("<p></p>").text("Text.");  // Create text with jQuery

  var txt3 = document.createElement("p");
  txt3.innerHTML = "Text";         // Create text with DOM
  txt3.id = "txt" + (textArray.length + 1);
  textArray.push(txt3); //Push to an Array
  $("#testArea").append(txt3);   // Append new elements
  checkIDTxt();
}

function appendButton(){ //Add a new button
  var buttonTest = document.createElement("button");
  buttonTest.innerHTML = "This is a button";
  buttonTest.id = "btn" + (buttonArray.length + 1);
  buttonArray.push(buttonTest); //Push to an Array
  $("#testArea").append(buttonTest);   // Append new elements
  checkIDBtn();
}

//Removing Items
function removeElements(){ //Remove element based on the id typed in textbox
  //alert(textArray);
  var elementID = document.getElementById("removeID").value;
  //alert(elementID);
  var element = document.getElementById(elementID);
  element.remove();
  removeText(elementID);
  checkIDBtn();
  checkIDTxt();
}

function removeText(name){ //Remove text
  for (i = 0; i < textArray.length; i++){
    if(textArray[i].id == name){
      //textArray.splice(i,1);
      delete textArray[i];
    }
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

//Markers 
function toggleMarkers(){ //Toggle all markers
  if(markerArray.length != 0){
    if(!modeArray.enabled){
      modeArray.enabled = true;
    }
    else{
      modeArray.enabled = false;
    }
  
    markerArray.forEach(toggleOneMarkers); //Call function for each element store in Array
  
  }
  else{
    alert("No Marker to toggle");
  }
}

function toggleOneMarkers(marker){ //toggle one marker
  marker.classList.toggle("marker");
  var markerStat = document.getElementById("markerStatus");
  markerStat.innerText = modeArray.enabled + "";
}

function toggleMode(){ //Toggle between Viewing and Adding
  var mode; //Text to display mode
  if(!modeArray.viewingMode){ //Swap to Viewing
    modeArray.viewingMode = true;
    modeArray.addingMode = false;
    modeArray.movingMode = false;
    $("#addButton").hide();
    mode = "Viewing";
    if(!addButtonPressed){
      document.getElementById("selectedMarker").innerText = newMarker.id;
      //removeMarker();
    }
  }
  else{                       //Swap to Adding
    modeArray.viewingMode = false;
    modeArray.addingMode = true;
    modeArray.movingMode =false;
    $("#addButton").show(); 
    mode = "Adding";
    document.getElementById("btnToggleMove").innerText = "Move Marker"; //Refresh Text in case it was switch from moving to adding
    for (var i = 0; i<markerArray.length; i++){ //Reset all markers to orginal setting
      markerArray[i].style.opacity= 1;
      markerArray[i].style.zIndex = 1;
      markerArray[i].style.backgroundColor ="red";
    }
    addButtonPressed = true;
  }
  document.getElementById("Mode").innerText = mode; //Update mode text
  document.getElementById("nodeInfoContainer").style.display = "none"; //hide previously viewed info
}

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
  $("#addNode").show();
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

function displayCurrentMarker(markerID){ //function runs when a marker is clicked
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
    //markerID.innerText = "None";
    modeArray.movingMode =false;
    //$("#btnToggleMove").hide(); 
  //}
  
}

function showCoords(event) {
  var container = document.querySelector("#imageSource");
  xCoord = event.clientX - container.getBoundingClientRect().left;
  yCoord = event.clientY - container.getBoundingClientRect().top;
  var pagexCoord = event.clientX;
  var pageyCoord = event.clientY;
  var coords = "Position within imageContainer:<br>" + "X coords: " + xCoord + ", Y coords: " + yCoord + "<br> Position within page:<br>" + "Page X coords: " + pagexCoord + ", Page Y coords: " + pageyCoord;
  document.getElementById("instructions").innerHTML = coords;
  //alert(coords);
}

function moveMarker(marker){ //Used to move a Marker around
  if(!modeArray.enabled){
    alert("Enable marker to move markers");
    return
  }
  var container = document.querySelector("#imageSource");
  var xPosition = event.clientX - container.scrollLeft - (marker.clientWidth); //container.scrollLeft is for when the div is scrollable
  var yPosition = event.clientY - container.scrollTop + window.pageYOffset - (marker.clientHeight); //container.scrollTop is for when the div is scrollable
  marker.style.left = xPosition + "px";
  marker.style.top = yPosition + "px";  
  console.log("marker is moving");
}

function noSignal(){
  document.getElementById("errorText").style.display = "block";
}

function addPressed(){
  var location = document.getElementById("locationName").value;
  var nodeID = document.getElementById("nodeID").value;
  if (location == "" && nodeID == ""){
    alert("Please make sure both fields are filled before adding node.");
    return;
  }
  else{
    addButtonPressed = true;
    markerArray.push(newMarker);
    addNode(newMarker.id, ("nodeInfo"+markerCount));
    markerCount++;
    var formStatus = "Node '" + nodeID + "' added at '" + location + "' <br>"
    document.getElementById("formStatus").innerHTML = formStatus;
    newMarker = null; 
    document.getElementById("locationName").value = "";
    document.getElementById("nodeID").value = "";
  }
}

function resetNodeDiv(){
  modeArray.movingMode =false; //Swap back to Viewing
  document.getElementById("editNode").value = "Edit"; //Update toggle button text
  document.getElementById("Mode").innerText = "Viewing"; //Update mode text
  $("#cancelEdit").hide();
}

//Function that interact with Node Class
function editSelectedNode(markerID){
  //if(modeArray.viewingMode){ //Only runs if viewing is enabled
    if(!modeArray.movingMode){ //Swap to Moving
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
          document.getElementById("nodeID").value = nodeList[i].nodeID;
        }
      }
      $("#"+ node.nodeID +" #editNode").attr("value", "Cancel Edit");
      $("#"+ node.nodeID +" #editNode").attr("onclick", "cancelEdit()");
      //document.getElementById("editNode").value = "Cancel Edit"; //Update toggle button text
      //document.getElementById("editNode").onclick = cancelEdit;
      
      document.getElementById("addNode").value = "Save";
      $("#addButton").show();
      document.getElementById("addNode").onclick = saveEdit;
    }
    else{
      resetNodeDiv();
      modeArray.movingMode = false;
    }
  //}
}

function saveEdit(){
  modeArray.movingMode = false;
  document.getElementById("editNode").value = "Edit";
  document.getElementById("editNode").onclick = editSelectedNode(selectedMarkerID);
  var newLocation = document.getElementById("locationName").value
  var newID = document.getElementById("nodeID").value
  $("#addButton").hide();
  document.getElementById("addNode").value = "Add";

  for (var i = 0; i<nodeList.length; i++){
    if (nodeList[i].markerID == selectedMarkerID){
      nodeList[i].editNode(newLocation, newID);
      document.getElementById("nodeInfo").innerHTML = nodeList[i].print();
      var formStatus = "Node '" + nodeList[i].nodeID + "' changes saved <br>"
      document.getElementById("formStatus").innerHTML = formStatus;
    }
  }

  document.getElementById("locationName").value = "";
  document.getElementById("nodeID").value = "";
  modeArray.movingMode =false; //Swap back to Viewing
  document.getElementById("Mode").innerText = "Viewing";

}

function cancelEdit(){
  resetNodeDiv();
  var marker = document.getElementById(selectedMarkerID);
  marker.style.left = oldCord[0];
  marker.style.top = oldCord[1];
  oldCord = [];
  document.getElementById("editNode").onclick = editSelectedNode;
  $("#addButton").hide();
  document.getElementById("locationName").value = "";
  document.getElementById("nodeID").value = "";
}
















//================================================== Node Class ====================================================
class Node{
  constructor(markerID, location, nodeID, infoID){
    this.markerID = markerID;
    this.location = location;
    this.nodeID = nodeID;
    this.infoID = infoID;
    this.signal = "Low";
    this.status = "No Signal";
  }
  signalChange(){
      //this will be the function for changing signal later
  }

  statusChange(){
      //this will be the function for changing status later
  }

  editNode(newLocation, newID){
    //this will be the function for editing node information later
    this.location = newLocation;
    this.nodeID = newID;
  }

  deleteNode(){
      
  }

  print(){
    return "ID: " + this.nodeID + "<br> Location: " + this.location + "<br> Signal Strength: " + this.signal + "<br> Status: " + this.status
  }
}

//=========================================== main (node class) ====================================================
var nodeList = [];

function createNodeContainer(newNode){ //Used to create a new container
  
  $("#informationContainerTest").append('<div id="' +newNode.nodeID +'" class="nodeInfoContainer"</div>'); //Div to store all other div
  $("#"+newNode.nodeID).append('<div id="' +newNode.infoID +'" class="nodeInfoWrapper"</div>');  //Div that showcase node info
  $("#"+newNode.nodeID).html(newNode.print());
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
        onclickFunction ="onclick=\"noSignal()\"";
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
  var location = document.getElementById("locationName").value;
  var nodeID = document.getElementById("nodeID").value;
  if (location == "" || nodeID == ""){
      alert("Please make sure both fields are filled before adding node.");
      return;
  }

  var n = new Node(markerID, location, nodeID, infoID);
  createNodeContainer(n);
  nodeList.push(n);
  console.log("Marker ID: " + n.markerID);
  console.log("Node Location: " + n.location);
  console.log("Node ID: " + n.nodeID);
}

function removeNode(markerID){
  for(var i = 0; i<nodeList.length; i++){
    if (nodeList[i].markerID == markerID){
        alert(nodeList[i].nodeID);
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