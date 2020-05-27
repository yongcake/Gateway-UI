//Global varibles
var xPosition;
var yPosition;
var newMarker;
var markerCount = 0;
var nodeCount = 0;
var markerAdded = false;
var nodeExist = false;
var selectedMarkerID = "";
var addButtonPressed  = false;
var signalStrength = 1; //1 to 5 

var buttonArray = [], textArray = [], markerArray = [], oldCord = [], siteArray = [["Test1"],["Test2"]], text;
var modeArray ={enabled:true, addingMode:true, movingMode:false, viewingMode:false};
var currentSite = "Test1";
//Site Array format [[*SiteName*,*NodeArrays[*nodes*]*],[*SiteName*,*NodeArrays[*nodes*]*]]

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
      $("#addNode").show();
      $("#cancel").show();
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
  if(!modeArray.movingMode){
    removeFromArray(markerArray, markerID); //Function to remove marker,
    removeUnwantedMarker();
    modeArray.viewingMode =false;
    modeArray.addingMode =true;
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
  var container = document.querySelector("#imageSource");
  var xCoord = event.clientX - container.getBoundingClientRect().left;
  var yCoord = event.clientY - container.getBoundingClientRect().top;
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
  xPosition = event.clientX - container.scrollLeft - (marker.clientWidth); //container.scrollLeft is for when the div is scrollable
  yPosition = event.clientY - container.scrollTop + window.pageYOffset - (marker.clientHeight); //container.scrollTop is for when the div is scrollable
  marker.style.left = xPosition + "px";
  marker.style.top = yPosition + "px";  
  console.log("marker is moving");
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
  var nodeID = $("#nodeID").val(); 
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
    document.getElementById("locationName").value = "";
    document.getElementById("nodeID").value = "";
    $("#addNode").hide();
    $("#cancel").hide();
    console.log("Node LIst:"+nodeList);
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

function saveEdit(){
  var markerID = $("#selectedMarker").text();
  var node =getNodeByMarkerID(markerID);
  $("#"+ node.nodeID +" #editNode").attr("value", "Edit");
  $("#"+ node.nodeID +" #editNode").attr("onclick", 'editSelectedNode("'+markerID+'")');
  //document.getElementById("editNode").value = "Edit";
  //document.getElementById("editNode").onclick = editSelectedNode(selectedMarkerID);
  var newLocation = $("#locationName").val();
  var newID = $("#nodeID").val();
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
  removeMarker(newMarker.id);
  document.getElementById("locationName").value = "";
  document.getElementById("nodeID").value = "";
  $("#cancel").hide();
  $("#addNode").hide(); 
}

function testComplete(){
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

function changeSignalStrength(){
  var veryWeak = 
    '#signal-strength' + newMarker.id + ' .bar-1{'
    + 'background-color: #999;}';

    var weak = 
    '#signal-strength' + newMarker.id +' .bar-1, ' +
    '#signal-strength' + newMarker.id + ' .bar-2{'
    +  'background-color: #777;}'

    var medium = 
    '#signal-strength' + newMarker.id +' .bar-1, ' + 
    '#signal-strength' + newMarker.id + ' .bar-2,' + 
    '#signal-strength' + newMarker.id + ' .bar-3{'
    +  'background-color: #555;}';

    var strong =  
    '#signal-strength' + newMarker.id +' .bar-1, ' + 
    '#signal-strength' + newMarker.id + ' .bar-2,' + 
    '#signal-strength' + newMarker.id + ' .bar-3,' +
    '#signal-strength' + newMarker.id + ' .bar-4{'
    +  'background-color: #333;}';
    
    var veryStrong = 
    '#signal-strength' + newMarker.id +' .bar-1, ' + 
    '#signal-strength' + newMarker.id + ' .bar-2,' + 
    '#signal-strength' + newMarker.id + ' .bar-3,' +
    '#signal-strength' + newMarker.id + ' .bar-4,' +  
    '#signal-strength' + newMarker.id + ' .bar-5{'
    +  'background-color: #111;}';

    if (signalStrength == 1){
      var head = document.head || document.getElementsByTagName('head')[0]
      var style = document.createElement('style');
      head.appendChild(style);
      style.type = 'text/css';
      if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = veryWeak;
      } 
      else {
        style.appendChild(document.createTextNode(veryWeak));
      }
    }

    if (signalStrength == 2){
      var head = document.head || document.getElementsByTagName('head')[0]
      var style = document.createElement('style');
      head.appendChild(style);
      style.type = 'text/css';
      if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = weak;
      } 
      else {
        style.appendChild(document.createTextNode(weak));
      }
    }

    if (signalStrength == 3){
      var head = document.head || document.getElementsByTagName('head')[0]
      var style = document.createElement('style');
      head.appendChild(style);
      style.type = 'text/css';
      if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = medium;
      } 
      else {
        style.appendChild(document.createTextNode(medium));
      }
    }
    
    if (signalStrength == 4){
      var head = document.head || document.getElementsByTagName('head')[0]
      var style = document.createElement('style');
      head.appendChild(style);
      style.type = 'text/css';
      if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = strong;
      } 
      else {
        style.appendChild(document.createTextNode(strong));
      }
    }

    if (signalStrength == 5){
      var head = document.head || document.getElementsByTagName('head')[0]
      var style = document.createElement('style');
      head.appendChild(style);
      style.type = 'text/css';
      if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = veryStrong;
      } 
      else {
        style.appendChild(document.createTextNode(veryStrong));
      }
    }
}













//================================================== Node Class ====================================================
class Node{
  constructor(markerID, nodeID, location, nodeName, infoID){
    this.markerID = markerID;
    this.nodeID = nodeID;
    this.infoID = infoID;
    this.signal = "Low";
    this.status = "No Signal";
    this.editNode(location,nodeName);
    this.updatePosition(xPosition,yPosition);
  }
  signalChange(){
      //this will be the function for changing signal later
  }

  statusChange(){
      //this will be the function for changing status later
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
    return "Name: " + this.nodeName + "<br> Location: " + this.location + "<br> Signal Strength: " + this.signal + "<br> Status: " + this.status;
  }

  print2(){
    return "Name: " + this.nodeName + "<br> Location: " + this.location;
  }

  print3(){
    changeSignalStrength();
    var signalStrenghtBar = 
    '<div class="signal-strength" id="signal-strength' + this.markerID + '">'
    +     '<div class="bar bar-1"></div>'
    +     '<div class="bar bar-2"></div>'
    +     '<div class="bar bar-3"></div>'
    +     '<div class="bar bar-4"></div>'
    +     '<div class="bar bar-5"></div>'
    +'</div>';

    var signalStrengthTxt = "<br> Signal Strength: " + signalStrenghtBar;
    return signalStrengthTxt;
  }

  print4(){
    return "<br> Status: " + this.status
  }
}

//=========================================== main (node class) ====================================================
var nodeList = [];

function createNodeContainer(newNode){ //Used to create a new container
  
  $("#scrollInfoContainer").append('<div id="' +newNode.nodeID +'" class="nodeInfoContainer"</div>'); //Div to store all other div
  $("#"+newNode.nodeID).append('<div id="' +newNode.infoID +'" class="nodeInfoWrapper"</div>');  //Div that showcase node info
  $("#"+newNode.infoID).html(newNode.print2() + newNode.print3() + newNode.print4());
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
  var location = document.getElementById("locationName").value;
  var nodeID = "node"+nodeCount;
  nodeCount++;
  var nodeName = document.getElementById("nodeID").value;
  nodeExist = false;
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
  else{
    var n = new Node(markerID,nodeID, location, nodeName, infoID);
    createNodeContainer(n);
    nodeList.push(n);
    for (var i =0; i< siteArray.length; i++){
      if(siteArray[i][0] ==currentSite){ 
        siteArray[i][1] =nodeList;
        console.log("Current Site Nodes: " +siteArray[i][1].length);
      }
    }
    console.log("Marker ID: " + n.markerID);
    console.log("Node Location: " + n.location);
    console.log("Node ID: " + n.nodeID);
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

//===============(Not Sure if a class should be made)=======SITE CLass===========================================
//class TestSite{
//  constructor(siteName, list){
//    this.siteName = siteName;
//    this.updateNodeList(list);
//  }
//  updateNodeList(updatedList){
//      this.list = updatedList;
//  }
//}

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
        nodeList = siteArray[i][1];
      }
      else{
        nodeList = [];
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