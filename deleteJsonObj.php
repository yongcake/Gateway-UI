<?php
$area =  $_POST["area"];
$test =  $_POST["test"];
$pointID =  $_POST["pointID"];
$infoID = $_POST["nodeInfoID"];


if (file_exists('./config.json')){
	$json= file_get_contents('./config.json');//encoded json
	$jsonArray = json_decode($json,true);
	
	if(isset($jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID])){
		unset($jsonArray[$test]["floorArray"][$area]["nodeList"][$pointID]);
	}
}

if (file_exists('./trace.json')){
	$json= file_get_contents('./trace.json');//encoded json
	$traceJsonArray = json_decode($json,true);
	foreach($traceJsonArray as $testNo =>$test){ // Loop through all the test
		if($test == $testNo){
			foreach($test['nodes'] as $nodeInfo =>$node){ //loop all the floors
				//echo($traceJsonArray[$testNo]['nodes'][$nodeInfo]['active']);
				if($infoID == $nodeInfo){
					$traceJsonArray[$testNo]['nodes'][$nodeInfo]['active'] = false;	
				}
				//echo($nodeInfo." has been set to false \n");
			}
		}
	}
	//echo "trace Found";
}



$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);

$myfile = fopen("trace.json", "w");
fwrite($myfile, json_encode($traceJsonArray));
fclose($myfile);
	
?>
