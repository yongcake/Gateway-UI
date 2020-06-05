<?php
$nodeName = $_POST["nodeName"];
$markerID = $_POST["markerID"];
$nodeID = $_POST["nodeID"];
$infoID = $_POST["infoID"];
$posLeft =  $_POST["posLeft"];
$posTop = $_POST["posTop"];
$location =  $_POST["location"];
$area =  $_POST["area"];



if (file_exists('./config.json')){
	$json= file_get_contents('./config.json');//encoded json
	$jsonArray = json_decode($json,true);
}
else{
	$jsonArray = array();
}


$infoFile = fopen("infoHTML.txt", "w"); //Used to find user input & The name that changes
fwrite($infoFile, $nodeName."\n");
fwrite($infoFile, $markerID."\n");
fwrite($infoFile, $nodeID."\n");
fwrite($infoFile, $infoID."\n");
fwrite($infoFile, $area."\n");
fwrite($infoFile, "~~~~End of Item HTML Recieved~~~\n");
if(isset($jsonArray[$nodeName])){
	$jsonArray[$nodeName]['markerID'] = $markerID;
	$jsonArray[$nodeName]['nodeID'] = $nodeID;
	$jsonArray[$nodeName]['infoID'] = $infoID;
	$jsonArray[$nodeName]['posLeft'] = $posLeft;
	$jsonArray[$nodeName]['posTop'] = $posTop;
	$jsonArray[$nodeName]['location'] = $location;
	$jsonArray[$nodeName]['area'] =$area;
	fwrite($infoFile, "\n Updated Marker ID of $nodename: ". $jsonArray[$nodeName]['markerID']."\n");
}
else{
	$jsonArray[$nodeName] =array('markerID'=>$markerID,'nodeID'=>$nodeID,
	'infoID'=>$infoID,'signal' =>1,'status'=>"Not Connected",
	'nodeName'=>$nodeName, 'posLeft'=>$posLeft,'posTop'=>$posTop,'location' =>$location,'area' =>$area);
	fwrite($infoFile, "\n Number of Nodes: ".count($jsonArray)."\n");
	fwrite($infoFile, "\n New ID Created: ".$nodeName."\n");
}

fclose($infoFile);

$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);


	
?>
