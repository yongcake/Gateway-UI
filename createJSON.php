<?php
$nodeName = htmlspecialchars($_GET["nodeName"]);
$txPower = htmlspecialchars($_GET["txPower"]);
$sf = htmlspecialchars($_GET["SF"]);
$rssi = htmlspecialchars($_GET["RSSI"]);
$snr =  htmlspecialchars($_GET["SNR"]);
$json= file_get_contents('./config.json');//encoded json
$jsonArray = json_decode($json,true);
if(!file_exists("nodeinfo")){
  mkdir("./nodeinfo", 0777);

}
else{

}
$infoFile = fopen('./nodeinfo/'.$nodeName.'Info.txt', "a"); //Used to find user input & The name that changes
fwrite($infoFile, "~~~~Packet $sf"."_TX$txPower Recieved~~~~ \n");
fwrite($infoFile, "TX Power: $txPower \n");
fwrite($infoFile, "SF: $sf \n");
fwrite($infoFile, "RSSI: $rssi \n");
fwrite($infoFile, "SNR: $snr \n");
fwrite($infoFile, "Signal Strength: ". calculateSignalStrength($rssi) ."\n");
fwrite($infoFile, "~~~~End of Packet~~~~~~~~~~\n\n");
if(isset($jsonArray[$nodeName])){
	$jsonArray[$nodeName]['signal'] =calculateSignalStrength($rssi);
	$jsonArray[$nodeName]['status'] ="Connected";
	//fwrite($infoFile, "\n new signal Strength: ". $jsonArray[$nodeName]['signal']."\n");
}
else{
	$jsonArray[$nodeName] =array('markerID'=>null,'nodeID'=>null,
	'infoID'=>null,'signal' =>calculateSignalStrength($rssi),'status'=>"Connected",
	'nodeName'=>$nodeName, 'posLeft'=>null,'posTop'=>null,'location'=> null,'area' =>null);
	//fwrite($infoFile, "\n Number of Nodes: ".count($jsonArray)."\n");
	//fwrite($infoFile, "\n New ID Created: ".$nodeName."\n");
}


fclose($infoFile);
$myfile = fopen("config.json", "w");
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);

function calculateSignalStrength($rssIndicator){
	$signalStrength = 0;
	if($rssIndicator >30){
		$signalStrength =5;
	}
	else if ($rssIndicator >25)
	{
		$signalStrength =4;
	}
	else if ($rssIndicator >20){
		$signalStrength =3;
	}
	else if ($rssIndicator >10){
		$signalStrength =2;
	}
	else if ($rssIndicator >0){
		$signalStrength =1;
	}
	
	return $signalStrength;
}
	
?>
