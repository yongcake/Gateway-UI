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
/*$nodeJson= file_get_contents('./nodeSetting.json');
$nodeArray = json_decode($nodeJson,true);*/



if (file_exists('./config.json')){
	$json= file_get_contents('./config.json');//encoded json
	$jsonArray = json_decode($json,true);
}
else{
	$jsonArray = array();
}

$jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID]['posTop'] = $posTop;
$jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID]['posLeft'] = $posLeft;

/* if(isset($jsonArray[$oldNodeName])){
	if($nodeName != $oldNodeName){
		$jsonArray[$nodeName] = $jsonArray[$oldNodeName];
		$jsonArray[$nodeName]['nodeName'] = $nodeName;
		$jsonArray[$nodeName]['posLeft'] = $posLeft;
		$jsonArray[$nodeName]['posTop'] = $posTop;
		$jsonArray[$nodeName]['location'] = $location;
		unset($jsonArray[$oldNodeName]);
		
		$nodeArray[$nodeName] = $nodeArray[$oldNodeName];
		$nodeArray[$nodeName]['location'] = $location;
		unset($nodeArray[$oldNodeName]);
	}
	//else if($nodeName == $oldNodeName && $location == $oldLocation){
	//	return;
	//}
	else{
		$jsonArray[$nodeName]['posLeft'] = $posLeft;
		$jsonArray[$nodeName]['posTop'] = $posTop;
		$jsonArray[$nodeName]['location'] = $location;
		
		$nodeArray[$nodeName]['location'] = $location;
	}
	}
else{
	$jsonArray[$nodeName] =array('markerID'=>$markerID,'nodeID'=>$nodeID,
	'infoID'=>$infoID,'signal' =>1,'status'=>"Not Connected",
	'nodeName'=>$nodeName, 'posLeft'=>$posLeft,'posTop'=>$posTop,'location' =>$location,'area' =>$area);
}
 
}*//*
$myfile = fopen("nodeSetting.json", "w");
fwrite($myfile, json_encode($nodeArray));
fclose($myfile);*/

$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);


	
?>
