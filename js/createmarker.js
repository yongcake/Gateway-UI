var xCoord = 0;
var yCoord = 0;
var markerCount = 0;
var markerAdded = false;
var selectedMarkerID = "";
var addButtonPressed  = false;
var buttonArray = [], textArray = [], markerArray = [], text;
var modeArray ={enabled:true, addingMode:true, movingMode:true, viewingMode:false};

function createNewMarker(){
    var newMarker;
    var location = document.getElementById("locationName").value;
    var nodeID = document.getElementById("nodeID").value;
    if(modeArray.enabled){
        if(modeArray.movingMode && addButtonPressed == false){
            var container = document.querySelector("#imageSource");
            newMarker = document.createElement("div"); 
            container.append(newMarker); //create new div in #imageSource
            newMarker.classList.toggle("marker"); // give .marker class css to the new div
            newMarker.id = "marker" + (markerCount);
            markerCount++;
            addNode(newMarker.id);
            var formStatus = "Node '" + nodeID + "' added at '" + location + "' <br>"
            document.getElementById("formStatus").innerHTML = formStatus;
            newMarker.setAttribute("onclick","displayCurrentMarker(this.id)");
            markerArray.push(newMarker);
            //alert("new marker created");
            //markerAdded = true;
            //document.getElementById("locationName").value = "";
            //document.getElementById("nodeID").value = "";
            moveMarker(newMarker);
        }
        else if(modeArray.movingMode && addButtonPressed == true){
            if (location == "" && nodeID == ""){
                alert("Please make sure both fields are filled before adding node.");
                return;
            }
            else{
                
            }
        }
    }
}