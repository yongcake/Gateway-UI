<?php
$nodeName = $_POST["nodeName"];
$markerID = $_POST["markerID"];
$nodeID = $_POST["nodeID"];
$infoID = $_POST["infoID"];
$posLeft =  $_POST["posLeft"];
$posTop = $_POST["posTop"];
$area =  $_POST["area"];
$test =  $_POST["test"];
$pointID =  $_POST["pointID"];
$active =  $_POST["active"];

$nodeJson= file_get_contents('./packetInfo.json');
$nodeArray = json_decode($nodeJson,true);

if (file_exists('./config.json')){
	$json= file_get_contents('./config.json'); //encoded json
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
if(!isset($jsonArray[$test]) && $test != ""){ //For Gateway
	$jsonArray[$test]['testCompleted'] = false;
	$jsonArray[$test]['testNo'] = $test;
	$jsonArray[$test]['gatewayID'] = $markerID;
	$jsonArray[$test]['gatewayLeft'] = $posLeft;
	$jsonArray[$test]['gatewayTop'] = $posTop;
	$jsonArray[$test]['gatewayFloor'] = $area;
	$jsonArray[$test]['floorArray']["$area"]['nodeList'] =array();

	//$nodeArray[$test]['testCompleted'] = false;
	$nodeArray[$test]['gatewayLeft'] = $posLeft;
	$nodeArray[$test]['gatewayTop'] = $posTop;
	$nodeArray[$test]['gatewayFloor'] = $area;
	//$jsonArray[$test]['floorArray']["$area"]= ;
}
else { //For Nodes
	$pointNo = count($jsonArray[$test]['floorArray'][$area]['nodeList']);
	$node = $jsonArray[$test]['floorArray'][$area]['nodeList']['Point'.$pointNo];
	//config.json
	$node['pointID'] =$pointID;
	$node['markerID'] = $markerID;
	$node['nodeID'] = $nodeID;
	$node['infoID'] = $infoID;
	$node['nodeName'] = $nodeName;
	$node['signal'] =0;
	$node['status'] ="Not Connected";
	$node['posLeft'] = $posLeft;
	$node['posTop'] = $posTop;
	$node['area'] =$area;
	$node['active'] =$active;
	$jsonArray[$test]["floorArray"][$area]['nodeList']['Point'.$pointNo] = $node;

	//packetInfo.json
	$nodeArray[$test]['floorArray'][$area]['Point'.$pointNo]['pointID'] =$pointID;
	$nodeArray[$test]['floorArray'][$area]['Point'.$pointNo]['nodeID'] =$nodeName;
	$nodeArray[$test]['floorArray'][$area]['Point'.$pointNo]['posLeft'] = $posLeft;
	$nodeArray[$test]['floorArray'][$area]['Point'.$pointNo]['posTop'] = $posTop;
	$nodeArray[$test]['floorArray'][$area]['Point'.$pointNo]['trace'] = array();
}
//else{
//	$node =array('markerID'=>$markerID,'nodeID'=>$nodeID,
//	'infoID'=>$infoID,'signal' =>1,'status'=>"Not Connected",
//	'nodeName'=>$nodeName, 'posLeft'=>$posLeft,'posTop'=>$posTop,'area' =>$area);
	//fwrite($infoFile, "\n Number of Nodes: ".count($jsonArray)."\n");
	//fwrite($infoFile, "\n New ID Created: ".$nodeName."\n");
//	$jsonArray[$test][$area][$nodeName] = $node;
//}


$myfile = fopen("packetInfo.json", "w");
fwrite($myfile, json_encode($nodeArray));
fclose($myfile); 
$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);

	
?>

