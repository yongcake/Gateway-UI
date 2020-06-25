<?php
$nodeName = htmlspecialchars($_GET["nodeName"]);
$txPower = htmlspecialchars($_GET["txPower"]);
$sf = htmlspecialchars($_GET["SF"]);
$rssi = htmlspecialchars($_GET["RSSI"]);
$snr =  htmlspecialchars($_GET["SNR"]);

$activeJson= file_get_contents('http://127.0.0.1/getActiveItems.php');//encoded json
$json= file_get_contents('./config.json') //encoded json
$nodeJson= file_get_contents('./packetInfo.json');

$nodeArray = json_decode($nodeJson,true);
$jsonArray = json_decode($json,true);
$activeJsonArray = json_decode($activeJson,true);

if(!file_exists("nodeinfo")){
  mkdir("./nodeinfo", 0777);

}
else{

}
$sigStrength =calculateSignalStrength($rssi);
/*$infoFile = fopen('./nodeinfo/'.$nodeName.'Info.txt', "a"); 			//Used to find user input & The name that changes
fwrite($infoFile, "~~~~Packet $sf"."_TX$txPower Recieved~~~~ \n");
fwrite($infoFile, "TX Power: $txPower \n");
fwrite($infoFile, "SF: $sf \n");
fwrite($infoFile, "RSSI: $rssi \n");
fwrite($infoFile, "SNR: $snr \n");
fwrite($infoFile, "Signal Strength: ". $sigStrength ."\n");
fwrite($infoFile, "~~~~End of Packet~~~~~~~~~~\n\n");
fclose($infoFile);*/
foreach($activeJsonArray as $testNo =>$test){ // Loop through all the test
    if($test['testCompleted']){
        unset($activeJsonArray[$testNo]);
    }
    else{
        foreach($test['floorArray'] as $floor){ //loop all the floors
            $activeNodeOnFloor = false;
            $currentFloor = $floor['floor'];
            //echo($floor['floor']."<hr></hr>");
            foreach($floor['nodeList'] as $pointID =>$point){
                if($point['active']=="false"){ 
                   //echo($pointID."Removed <hr></hr>");
                   jsonArray[$testNo]['floorArray'][$currentFloor]['nodeList'][$pointID]); //Remove if point is not active
                }
                else{
                    //echo($pointID."True <hr></hr>");
                    $activeNodeOnFloor = true;
                }
                
            }
            if(!$activeNodeOnFloor){
                jsonArray[$testNo]['floorArray'][$currentFloor]); //Remove floor if no node active at all in this floor       
            }
                
        }
    }
}

foreach($jsonArray as $key['testComplete'] => $value) {
	if($value){
		foreach($key['floorArray'] as $) {

		}
		if(isset($key['floorArray'][])){
			$jsonArray[$nodeName]['signal'] =$sigStrength;
			$jsonArray[$nodeName]['status'] ="Connected";
			if($nodeArray[$nodeName]['strength'] <= $sigStrength){
				$nodeArray[$nodeName]['TX'] = $txPower;
				$nodeArray[$nodeName]['SF'] = $sf;
				$nodeArray[$nodeName]['strength'] = $sigStrength;
			}
			
		}
		else{
			$jsonArray[$nodeName] =array('markerID'=>null,'nodeID'=>null,
			'infoID'=>null,'signal' =>calculateSignalStrength($rssi),'status'=>"Connected",
			'nodeName'=>$nodeName, 'posLeft'=>null,'posTop'=>null,'location'=> null,'area' =>null);
			if($nodeArray[$nodeName]['strength'] <= $sigStrength){
				$nodeArray[$nodeName]['TX'] = $txPower;
				$nodeArray[$nodeName]['SF'] = $sf;
				$nodeArray[$nodeName]['location'] = "";
				$nodeArray[$nodeName]['strength'] = $sigStrength;
				$nodeArray[$nodeName]['area'] = "";
			}
	}
}



$myfile = fopen("packetInfo.json", "w");
fwrite($myfile, json_encode($nodeArray));
fclose($myfile);

$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);

function calculateSignalStrength($rssIndicator){
	$signalStrength = 0;
	if($rssIndicator >60){
		$signalStrength =5;
	}
	else if ($rssIndicator >50)
	{
		$signalStrength =4;
	}
	else if ($rssIndicator >40){
		$signalStrength =3;
	}
	else if ($rssIndicator >35){
		$signalStrength =2;
	}
	else if ($rssIndicator >0){
		$signalStrength =1;
	}
	
	return $signalStrength;
}
	
?>
