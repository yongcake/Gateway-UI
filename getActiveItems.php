<?php
 header("Access-Control-Allow-Origin: *");
$json= file_get_contents('./config.json');//encoded json
$jsonArray = json_decode($json,true);

foreach($jsonArray as $testNo =>$test){ // Loop through all the test
	if($testNo != "shutdown"){
		if($test['testCompleted']){
			unset($jsonArray[$testNo]);
		}
		else{
			foreach($test['floorArray'] as $floor){ //loop all the floors
				$activeNodeOnFloor = false;
				$currentFloor = $floor['floor'];
				//echo($floor['floor']."<hr></hr>");
				foreach($floor['nodeList'] as $pointID =>$point){
					if($point['active']=="false"){ 
					   //echo($pointID."Removed <hr></hr>");
					   unset($jsonArray[$testNo]['floorArray'][$currentFloor]['nodeList'][$pointID]); //Remove if point is not active
					}
					else{
						//echo($pointID."True <hr></hr>");
						$activeNodeOnFloor = true;
					}
				}
				if(!$activeNodeOnFloor){
					unset($jsonArray[$testNo]['floorArray'][$currentFloor]); //Remove floor if no node active at all in this floor       
				}
					
			}
		}
	}
   
}

/* 
$myfile = fopen("configActive.json", "w"); //debugging only
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);
*/
echo(json_encode($jsonArray));
//echo("reading config done");
?>
