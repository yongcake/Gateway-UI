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



if (file_exists('./config.json')){
	$json= file_get_contents('./config.json');//encoded json
	$jsonArray = json_decode($json,true);
}
else{
	$jsonArray = array();
}

if(isset($jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID])){
	unset($jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID]);
}


$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);


	
?>
