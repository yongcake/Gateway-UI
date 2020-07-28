<?php
$nodeName = $_POST["nodeName"];
$markerID = $_POST["markerID"];
$gatewayID = $_POST["markerID"];
$nodeID = $_POST["nodeID"];
$infoID = $_POST["infoID"];
$posLeft =  $_POST["posLeft"];
$posTop = $_POST["posTop"];
$area =  $_POST["area"];
$test =  $_POST["test"];
$pointID =  $_POST["pointID"];
$active =  $_POST["active"];
$floorArr = $_POST["floorArray"];
/*$nodeJson= file_get_contents('./packetInfo.json');
$nodeArray = json_decode($nodeJson,true);*/

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
if(!isset($jsonArray[$test]) && $test != ""){ //For Geteway
	$jsonArray["shutdown"] = false;
	$jsonArray[$test]['testCompleted'] = false;
	$jsonArray[$test]['testNo'] = $test;
	$jsonArray[$test]['gatewayID'] = $markerID;
	$jsonArray[$test]['gatewayLeft'] = $posLeft;
	$jsonArray[$test]['gatewayTop'] = $posTop;
	$jsonArray[$test]['gatewayFloor'] = $area;
	for ($i = 0; $i < count($floorArr);$i++){
		$jsonArray[$test]['floorArray'][$floorArr[$i][0]] = array("floor"=>$floorArr[$i][0],"nodeList"=>array());
	}/*
	if(count($floorArr)<= 0){
		$jsonArray[$test]['floorArray'] ="BUGGED";
	}
	if(count($nodeID)!= 0){
		$jsonArray[$test]['nodeID'] =$nodeID;
	}
	
	if(count($pointID)!= 0){
		$jsonArray[$test]['point'] =$pointID;
	}*/
	$myfile = fopen("config.json", "w");
	chmod("config.json",0777);
	fwrite($myfile, json_encode($jsonArray));
	fclose($myfile);

}
else { //For Nodes
	//$pointNo = count($jsonArray[$test]['floorArray'][$area]['nodeList']);
	$jsonArray[$test]['floorArray']["$area"]['floor'] = $area;
	$node = $jsonArray[$test]['floorArray'][$area]['nodeList'][$pointID];
	//config.json
	$node['pointID'] =$pointID;
	$node['markerID'] = $markerID;
	$node['nodeID'] = $nodeID;
	$node['infoID'] = $infoID;
	$node['nodeName'] = $nodeName;
	$node['signal'] =0;
	$node['status'] ="No Signal";
	$node['posLeft'] = $posLeft;
	$node['posTop'] = $posTop;
	$node['area'] =$area;
	$node['active'] =$active;
	$jsonArray[$test]["floorArray"][$area]['nodeList'][$pointID] = $node;
	$myfile = fopen("config.json", "w");
	chmod("config.json",0777);
	fwrite($myfile, json_encode($jsonArray));
	fclose($myfile);


}



	
?>

