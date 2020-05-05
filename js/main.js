document.getElementById("btnTxt").onclick = function() {appendText()};

function appendText(){
  //var txt1 = "<p>Text.</p>";        // Create text with HTML
  //var txt2 = $("<p></p>").text("Text.");  // Create text with jQuery
  var txt3 = document.createElement("p");
  txt3.innerHTML = "Text";         // Create text with DOM
  $("body").append(txt3);   // Append new elements
}

function appendButton(){
  var buttonTest = document.createElement("button");
  buttonTest.innerHTML = "This is a button";
  $("body").append(buttonTest);   // Append new elements
}

