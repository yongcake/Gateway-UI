//import React from "react"
//import ReactDOM from "react-dom"

//ReactDOM.render(
//    <h1>Hello, world!</h1>,
//    document.getElementById('root')
//  );

//document.getElementById("btnTxt").onclick = function() {appendText()};

function appendText(){
  //var txt1 = "<p>Text.</p>";        // Create text with HTML
  //var txt2 = $("<p></p>").text("Text.");  // Create text with jQuery
  var txt3 = document.createElement("p");
  txt3.innerHTML = "Text";         // Create text with DOM
  $("#testArea").append(txt3);   // Append new elements
}

function appendButton(){
  var buttonTest = document.createElement("button");
  buttonTest.innerHTML = "This is a button";
  $("#testArea").append(buttonTest);   // Append new elements
}
