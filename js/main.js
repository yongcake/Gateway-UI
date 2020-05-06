//document.getElementById("btnTxt").onclick = function() {appendText()};
//Global varibles
var xCoord = 0;
var yCoord = 0;
var buttonArray = [], textArray = [], markerArray = [], text;
var enableMarker = true;
markerArray.push(document.getElementById("marker"));

function addText(value){
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
function appendText(){
  //var txt1 = "<p>Text.</p>";        // Create text with HTML
  //var txt2 = $("<p></p>").text("Text.");  // Create text with jQuery

  var txt3 = document.createElement("p");
  txt3.innerHTML = "Text";         // Create text with DOM
  txt3.id = "txt" + (textArray.length + 1);
  textArray.push(txt3);
  $("#testArea").append(txt3);   // Append new elements
  checkIDTxt();
}

function appendButton(){
  var buttonTest = document.createElement("button");
  buttonTest.innerHTML = "This is a button";
  buttonTest.id = "btn" + (buttonArray.length + 1);
  buttonArray.push(buttonTest);
  $("#testArea").append(buttonTest);   // Append new elements
  checkIDBtn();
}

//Removing Items
function removeElements(){
  //alert(textArray);
  var elementID = document.getElementById("removeID").value;
  //alert(elementID);
  var element = document.getElementById(elementID);
  element.remove();
  removeText(elementID);
  removeBtn(elementID);
  checkIDBtn();
  checkIDTxt();
}

function removeText(name){
  for (i = 0; i < textArray.length; i++){
    if(textArray[i].id == name){
      textArray.splice(i,1);
    }
  }
}

function removeBtn(name){
  for (i = 0; i < buttonArray.length; i++){
    if(buttonArray[i].id == name){
      buttonArray.splice(i,1);
    }
  }
}




//Markers 
function toggleMarker(){
  if(!enableMarker){
    enableMarker = true;
  }
  else{
    enableMarker = false;
  }
  var marker = document.getElementById("marker");
  marker.classList.toggle("markerTrue")
  var markerStat = document.getElementById("markerStatus");
  markerStat.innerText = enableMarker + "";
}

function createNewMarker(){
  if(enableMarker){
    var container = document.querySelector("#imageSource");
    var newMarker = document.createElement("div");
    container.append(newMarker); 
    newMarker.classList.toggle("marker");
    var xPosition = event.clientX - container.getBoundingClientRect().left + (newMarker.clientWidth / 2);
    var yPosition = event.clientY ;
    newMarker.style.left = xPosition + "px";
    newMarker.style.top = yPosition + "px";
    //alert("new marker created");
  }

}

function showCoords(event) {
  xCoord = event.clientX;
  yCoord = event.clientY;
  var coords = "X coords: " + xCoord + ", Y coords: " + yCoord;
  document.getElementById("instructions").innerHTML = coords;
  //alert(coords);
}

//document.getElementById("#imageSource").addEventListener("click", createNewMarker);

function moveMarker(){
  if(!enableMarker){
    alert("Enable marker to move markers");
    return
  }
  var marker = document.querySelector("#marker");
  var container = document.querySelector("#imageSource");
  var xPosition = event.clientX - container.getBoundingClientRect().left - (marker.clientWidth / 2);
  var yPosition = event.clientY - container.getBoundingClientRect().top - (marker.clientHeight/ 2);
  marker.style.left = xPosition + "px";
  marker.style.top = yPosition + "px";
}

