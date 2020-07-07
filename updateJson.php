<?php
$oldNodeName = $_POST["oldNodeName"];
$oldLocation = $_POST["oldLocation"];
$nodeName = $_POST["nodeName"];
$markerID = $_POST["markerID"];
$nodeID = $_POST["nodeID"];
$infoID = $_POST["infoID"];
$posLeft =  $_POST["posLeft"];
$posTop = $_POST["posTop"];
$location =  $_POST["location"];
$area =  $_POST["area"];
$test =  $_POST["test"];
$pointID = $_POST["pointID"];
$active =  $_POST["active"];
$nodeJson= file_get_contents('./nodeSetting.json');
$nodeArray = json_decode($nodeJson,true);

if (file_exists('./config.json')){
	$json= file_get_contents('./config.json');//encoded json
	$jsonArray = json_decode($json,true);
}
else{
	$jsonArray = array();
}
if(isset($active)) {
	$jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID]['active'] = $active;
}
else{
	$jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID]['posTop'] = $posTop;
	$jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID]['posLeft'] = $posLeft;
}

$myfile = fopen("nodeSetting.json", "w");
fwrite($myfile, json_encode($nodeArray));
fclose($myfile);

$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);


	
?>