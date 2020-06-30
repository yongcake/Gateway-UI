<?php
$nodeName = htmlspecialchars($_POST["nodeName"]);
$txPower = htmlspecialchars($_POST["txPower"]);
$sf = htmlspecialchars($_POST["SF"]);
$rssi = htmlspecialchars($_POST["RSSI"]);
$snr =  htmlspecialchars($_POST["SNR"]);

$activeJson= file_get_contents('http://127.0.0.1/getActiveItems.php');//encoded json
$json= file_get_contents('./config.json'); //encoded json
$nodeJson= file_get_contents('./packetInfo.json');

$nodeArray = json_decode($nodeJson,true);
$jsonArray = json_decode($json,true);
$activeJsonArray = json_decode($activeJson,true);

if(!file_exists("nodeinfo")){
  mkdir("./nodeinfo", 0777);

}
else{

}
//$sigStrength =calculateSignalStrength($rssi);
$infoFile = fopen('./nodeinfo/'.$nodeName.'2Info.txt', "a"); 			//Used to find user input & The name that changes
$sigStrength =calculateSignalStrength($rssi);
fwrite($infoFile, "~~~~Packet $sf"."_TX$txPower Recieved~~~~ \n");
$a = ($sf == 12);
$b = ($snr >=(-20));
fwrite($infoFile, "A SF: $a , B SNR: $b \n");
fwrite($infoFile, "TX Power: $txPower \n");
fwrite($infoFile, "SF: $sf \n");
fwrite($infoFile, "RSSI: $rssi \n");
fwrite($infoFile, "SNR: $snr \n");
fwrite($infoFile, "Signal Strength: ". $sigStrength ."\n");
fwrite($infoFile, "~~~~End of Packet~~~~~~~~~~\n\n");
fclose($infoFile);
if(count($activeJsonArray)>0){
	foreach($activeJsonArray as $testNo =>$test){ // Loop through all the test
		foreach($test['floorArray'] as $floor =>$floorNode){ //loop all the floors
			$currentFloor = $floor;
			//echo($floor['floor']."<hr></hr>");
			foreach($floorNode['nodeList'] as $pointNo =>$point){
				if($point['nodeName']==$nodeName){
					$point['signal'] =$sigStrength;
					$point['status'] ="Connected";
					/*if($nodeArray[$nodeName]['strength'] <= $sigStrength){
						$nodeArray[$nodeName]['TX'] = $txPower;
						$nodeArray[$nodeName]['SF'] = $sf;
						$nodeArray[$nodeName]['strength'] = $sigStrength;
					}
					//echo($pointID."Removed <hr></hr>");*/
					$jsonArray[$testNo]['floorArray'][$currentFloor]['nodeList'][$pointNo] = $point; 
				}
			}		
		}
	}
}

/*
foreach($jsonArray as $key['testComplete'] => $value) {
	if($value){
		if(isset($key['floorArray'][])){		
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
}*/



$myfile = fopen("packetInfo.json", "w");
fwrite($myfile, json_encode($nodeArray));
fclose($myfile);

$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);

function calculateSignalStrength($rssIndicator){
	$signalStrength = 0;
	$snrReachedMin = false;
	if($snr > (-20) && $sf == 12){
		$snrReachedMin = true;
	}
	else if ($snr > (-17.5) && $sf == 11)
	{
		$snrReachedMin = true;
	}
	else if ($snr > (-15) && $sf == 10){
		$snrReachedMin = true;
	}
	else if ($snr > (-12.5) && $sf == 9){
		$snrReachedMin = true;
	}
	else if ($snr > (-10) && $sf == 8){
		$snrReachedMin = true;
	}
	else if ($snr > (-7.5) && $sf == 7){
		$snrReachedMin = true;
	}
	
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
	/*if(!$snrReachedMin && $signalStrength >2){
		$signalStrength =1;
	}*/
	return $signalStrength;
}
	
?>
