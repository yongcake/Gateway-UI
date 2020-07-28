<?php


$testID =  $_POST["test"]; //TestX
$infoID =  $_POST["infoID"]; //nodeInfoX
if (file_exists('./config.json')){

	$json= file_get_contents('./config.json');//encoded json
	$jsonArray = json_decode($json,true);
	foreach($jsonArray as $testNo =>$test){ // Loop through all the test
		if ($testNo != "shutdown"){	
			if($testID == $testNo && !$test['testCompleted'] ){
				foreach($test['floorArray'] as $floor =>$floorNode){ //loop all the floors
					foreach($floorNode['nodeList'] as $pointNo =>$point){
						if($point["infoID"] == $infoID){
							$jsonArray[$testNo]['floorArray'][$floor]['nodeList'][$pointNo]['active'] ="false";
						}	
					}		
				}
			}
		}
	}
	$myfile = fopen("./config.json", "w");
	fwrite($myfile, json_encode($jsonArray));
	fclose($myfile);
}

/*if (file_exists('./trace.json')){
	$json= file_get_contents('./trace.json');//encoded json
	$traceJsonArray = json_decode($json,true);
	//$infoID = "nodeInfo0";
	//$testID = "Test1";
	foreach($traceJsonArray as $testNo =>$test){ // Loop through all the test
		if($testID == $testNo ){
			foreach($test['nodes'] as $nodeInfo =>$node){ //loop all the floors
				//echo($traceJsonArray[$testNo]['nodes'][$nodeInfo]['active']);
				if($nodeInfo == $infoID){
				   //echo(json_encode($node));
				   $traceJsonArray[$testNo]['nodes'][$nodeInfo]["active"] =false;	
				   //echo(json_encode($traceJsonArray[$testNo]['nodes'][$nodeInfo]));
				   echo($nodeInfo." has been set to false\n");

				}
				
			}
		}
		
	}
	$myfile = fopen("./trace.json", "w");
	fwrite($myfile, json_encode($traceJsonArray));
	fclose($myfile); 
	//echo "trace Found";

}*/
//echo(json_encode($traceJsonArray));


	
?>

