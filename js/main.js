//Global varibles
var xCoord = 0;
var yCoord = 0;
var markerCount = 0;
var buttonArray = [], textArray = [], markerArray = [], text;
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

function toggleMode(){
  var mode;
  if(!modeArray.viewingMode){
    modeArray.viewingMode = true;
    modeArray.addingMode = false;
    mode = "Viewing";
  }
  else{
    modeArray.viewingMode = false;
    modeArray.addingMode = true;
    mode = "Adding";
    for (var i = 0; i<markerArray.length; i++){
      markerArray[i].style.opacity= 1;
      markerArray[i].style.zIndex = 1;
      markerArray[i].style.backgroundColor ="red";
    }

  }
  document.getElementById("Mode").innerText = mode;
}

function createNewMarker(){ //add or move a a marker
  var newMarker;
  if (modeArray.enabled){ //Check if markers is currently shown
    if(modeArray.addingMode){ //Create marker if not in moving mode
      var container = document.querySelector("#imageSource");
      newMarker = document.createElement("div"); 
      container.append(newMarker); //create new div in #imageSource
      newMarker.classList.toggle("marker"); // give .marker class css to the new div
      newMarker.id = "marker" + (markerArray.length + 1);
      newMarker.setAttribute("onclick","displayCurrentMarker(this.id)") ;
      markerArray.push(newMarker);
      //alert("new marker created");
      moveMarker(newMarker);
    }
    else{
      //alert(document.getElementById("selectedMarker").text);
      newMarker = document.getElementById(document.getElementById("selectedMarker").text);
      
      //alert(newMarker.id);
    }
  }  
}

function displayCurrentMarker(markerID){
  if(modeArray.viewingMode){
    var textSelectedMarker = document.getElementById("selectedMarker");
    textSelectedMarker.innerText = markerID;
    for (var i = 0; i<markerArray.length; i++){
      if (markerArray[i].id == markerID){
        markerArray[i].style.opacity = 0.5;
        markerArray[i].style.zIndex = 3;
        markerArray[i].style.backgroundColor ="green";
      }
      else{
        markerArray[i].style.opacity = 1;
        markerArray[i].style.zIndex = 1;
        markerArray[i].style.backgroundColor ="red";
      }
    }
    $("#btnDeleteMarker").show();
  }
}

function removeMarker(){
  $("#btnDeleteMarker").hide();
  var markerID = document.getElementById("selectedMarker");
  if(markerID != "None"){
    removeFromArray(markerArray, markerID.innerText);
    markerID.innerText = "None";
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
