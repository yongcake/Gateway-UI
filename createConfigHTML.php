<?php
$nodeName = $_POST["nodeName"];
$markerID = $_POST["markerID"];
$nodeID = $_POST["nodeID"];
$infoID = $_POST["infoID"];
$posLeft =  $_POST["posLeft"];
$posTop = $_POST["posTop"];
<<<<<<< HEAD
$location =  $_POST["location"];
=======
>>>>>>> 7fd2317154260a5f51dfc9eecd038a8c310abbfa
$area =  $_POST["area"];
$test =  $_POST["test"];


$nodeJson= file_get_contents('./nodeSetting.json');
$nodeArray = json_decode($nodeJson,true);

if (file_exists('./config.json')){
	$json= file_get_contents('./config.json');//encoded json
	$jsonArray = json_decode($json,true);
}
else{
	$jsonArray = array();
}
/*
$infoFile = fopen("./nodeinfo/infoHTML.txt", "w"); //Used to find user input & The name that changes
fwrite($infoFile, $nodeName."\n");
fwrite($infoFile, $markerID."\n");
fwrite($infoFile, $nodeID."\n");
fwrite($infoFile, $infoID."\n");
fwrite($infoFile, $area."\n");

fwrite($infoFile, "~~~~End of Item HTML Recieved~~~\n");
fclose($infoFile);
*/
if(!isset($jsonArray[$test]) && $test != ""){
	$jsonArray[$test]['testCompleted'] = false;
	$jsonArray[$test]['testNo'] = $test;
	$jsonArray[$test]['gatewayID'] = $markerID;
	$jsonArray[$test]['gatewayLeft'] = $posLeft;
	$jsonArray[$test]['gatewayTop'] = $posTop;
	$jsonArray[$test]['gatewayFloor'] = $area;
	$jsonArray[$test]['floorArray']["$area"]= array('floor'=>$area,'nodeList'=>array());

	$nodeArray[$test]['testCompleted'] = false;
	$nodeArray[$test]['testNo'] = $test;
	$nodeArray[$test]['gatewayID'] = $markerID;
	$nodeArray[$test]['gatewayFloor'] = $area;
	$nodeArray[$test][$area][$nodeName]['TX'] ="";
	$nodeArray[$test][$area][$nodeName]['SF'] = "";
	$nodeArray[$test][$area][$nodeName]['strength'] = 0;
	$nodeArray[$test][$area][$nodeName]['area'] = $area;
}
else {
	$node = $jsonArray[$test]['floorArray'][$area][$nodeName];
	$node['markerID'] = $markerID;
	$node['nodeID'] = $nodeID;
	$node['infoID'] = $infoID;
	$node['signal'] =0;
	$node['status'] ="Not Connected";
	$node['posLeft'] = $posLeft;
	$node['posTop'] = $posTop;
	$node['area'] =$area;
	$jsonArray[$test]["floorArray"][$area][$nodeName] = $node;
}
//else{
//	$node =array('markerID'=>$markerID,'nodeID'=>$nodeID,
//	'infoID'=>$infoID,'signal' =>1,'status'=>"Not Connected",
//	'nodeName'=>$nodeName, 'posLeft'=>$posLeft,'posTop'=>$posTop,'area' =>$area);
	//fwrite($infoFile, "\n Number of Nodes: ".count($jsonArray)."\n");
	//fwrite($infoFile, "\n New ID Created: ".$nodeName."\n");
//	$jsonArray[$test][$area][$nodeName] = $node;
//}


/*$myfile = fopen("nodeSetting.json", "w");
fwrite($myfile, json_encode($nodeArray));
fclose($myfile); */
$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);

	
?>

