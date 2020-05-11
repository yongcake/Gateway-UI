class Node{
    constructor(location, identification){
        this.location = location;
        this.identification = identification;
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
    }

    deleteNode(){
        
    }
}

var nodeList = [];

function addNode()
{
    var location = document.getElementById("locationName").value;
    var identification = document.getElementById("nodeID").value;
    if (location == "" || identification == ""){
        alert("Please make sure both fields are filled before adding node.");
        return;
    }

    var n = new Node(location, identification);
    nodeList.push(n);   
    console.log("Node Location: " + n.location);
    console.log("Node ID: " + n.identification);
}
