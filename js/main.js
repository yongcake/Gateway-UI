//Global varibles
var xCoord = 0;
var yCoord = 0;
var markerCount = 0;
var markerAdded = false;
var buttonArray = [], textArray = [], markerArray = [], text;
var modeArray ={enabled:true, addingMode:true, movingMode:false, viewingMode:false};
var oldCords
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

function removeFromArray(arrayList,itemName){ //Remove element from an array and page
  for (i = 0; i < arrayList.length; i++){
    if(arrayList[i].id == itemName){
      arrayList.splice(i,1);
      var element = document.getElementById(itemName);
      element.remove();
    }
  }
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
    mode = "Viewing";
  }
  else{                       //Swap to Adding
    modeArray.viewingMode = false;
    modeArray.addingMode = true;
    modeArray.movingMode =false;
    $("#btnDeleteMarker").hide(); //Hide function that shouldn't be used in the current mode
    $("#btnToggleMove").hide(); //Hide function that shouldn't be used in the current mode
    mode = "Adding";
    document.getElementById("btnToggleMove").innerText = "Move Marker"; //Refresh Text in case it was switch from moving to adding
    for (var i = 0; i<markerArray.length; i++){ //Reset all markers to orginal setting
      markerArray[i].style.opacity= 1;
      markerArray[i].style.zIndex = 1;
      markerArray[i].style.backgroundColor ="red";
    }

  }
  document.getElementById("Mode").innerText = mode; //Update mode text
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
  var newMarker;
  var location = document.getElementById("locationName").value;
  var nodeID = document.getElementById("nodeID").value;
  if (modeArray.addingMode && location == "" && nodeID == ""){
    alert("Please make sure both fields are filled before adding node.");
    return;
  }
  if (modeArray.enabled){ //Check if markers is currently shown
    if(modeArray.addingMode && location != "" && nodeID != ""){ //Create marker if not in moving mode
      var container = document.querySelector("#imageSource");
      newMarker = document.createElement("div"); 
      container.append(newMarker); //create new div in #imageSource
      newMarker.classList.toggle("marker"); // give .marker class css to the new div
      newMarker.id = "marker" + (markerCount);
      markerCount++;
      addNode(newMarker.id);
      newMarker.setAttribute("onclick","displayCurrentMarker(this.id)");
      markerArray.push(newMarker);
      //alert("new marker created");
      //markerAdded = true;
      document.getElementById("locationName").value = "";
      document.getElementById("nodeID").value = "";
    }
    else if(modeArray.movingMode){
      //alert(document.getElementById("selectedMarker").text);
      newMarker = document.getElementById(document.getElementById("selectedMarker").text);
      
    }
    moveMarker(newMarker);
  } 

}

function displayCurrentMarker(markerID){ //function runs when a marker is clicked
  if(modeArray.viewingMode){
    var textSelectedMarker = document.getElementById("selectedMarker");
    textSelectedMarker.innerText = markerID;
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
    $("#btnDeleteMarker").show(); //button becomes available
    $("#btnToggleMove").show(); //button becomes available
    for(var i = 0; i<nodeList.length; i++){ //Find markers information
      if (nodeList[i].markerID == markerID){
          var nodeInformation = "ID: " + nodeList[i].nodeID + "<br> Location: " + nodeList[i].location + "<br> Signal Strength: " + nodeList[i].signal + "<br> Status: " + nodeList[i].status
          document.getElementById("nodeInfo").innerHTML = nodeInformation;
      }
    }
  }
}

function removeMarker(){  //Runs when btnDeleteMarker is clicked
  $("#btnDeleteMarker").hide(); //hide button when marker is deleted
  var markerID = document.getElementById("selectedMarker"); //Text that displays selected marker
  if(markerID != "None"){ //doesn't run when there isn't a marker selected
    removeFromArray(markerArray, markerID.innerText); //Function to remove marker,
    markerID.innerText = "None";
    modeArray.movingMode =false;
    $("#btnToggleMove").hide(); 
  }
 
}

function refreshMarkerList(){

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

//document.getElementById("#imageSource").addEventListener("click", createNewMarker);

function moveMarker(marker){ //Used to move a Marker around
  if(!modeArray.enabled){
    alert("Enable marker to move markers");
    return
  }
  //var marker = document.querySelector("#marker");
  var container = document.querySelector("#imageSource");
  //var xPosition = event.clientX - container.getBoundingClientRect().left - (marker.clientWidth / 2); //container.scrollLeft is for when the div is scrollable
  //var yPosition = event.clientY + window.pageYOffset; ; //container.scrollTop is for when the div is scrollable
  var xPosition = event.clientX - container.scrollLeft - (marker.clientWidth); //container.scrollLeft is for when the div is scrollable
  var yPosition = event.clientY - container.scrollTop + window.pageYOffset - (marker.clientHeight); //container.scrollTop is for when the div is scrollable
  marker.style.left = xPosition + "px";
  marker.style.top = yPosition + "px";
}























//==================================================Node Class=====================================================
class Node{
  constructor(markerID, location, nodeID){
    this.markerID = markerID;
    this.location = location;
    this.nodeID = nodeID;
    this.signal = "Low";
    this.status = "No Signal";
  }
  signalChange(){
      //this will be the function for changing signal later
  }

  statusChange(){
      //this will be the function for changing status later
  }

  editNode(){
      //this will be the function for editing node information later
      if(modeArray.viewingMode){ //Only runs if viewing is enabled
        if(!modeArray.movingMode){ //Swap to Moving
          modeArray.movingMode =true;
          document.getElementById("Mode").innerText = "Moving"; //Update mode text
          document.getElementById("btnEditNode").innerText = "Confirm Edit"; //Update toggle button text

        }
        else{
          modeArray.movingMode =false; //Swap back to Viewing
          document.getElementById("btnEditNode").innerText = "Edit"; //Update toggle button text
          document.getElementById("Mode").innerText = "Viewing"; //Update mode text
        }
      }
      

  }

  deleteNode(){
      
  }
}

var nodeList = [];

function addNode(markerID)
{
  var location = document.getElementById("locationName").value;
  var nodeID = document.getElementById("nodeID").value;
  if (location == "" || nodeID == ""){
      alert("Please make sure both fields are filled before adding node.");
      return;
  }

  var n = new Node(markerID, location, nodeID);
  nodeList.push(n);
  console.log("Marker ID: " + n.markerID);
  console.log("Node Location: " + n.location);
  console.log("Node ID: " + n.nodeID);
}

