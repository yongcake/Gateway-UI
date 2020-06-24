<?php
$json= file_get_contents('./config.json');//encoded json
$jsonArray = json_decode($json,true);
foreach($jsonArray as $test){ // Loop through all the test
    if($test['testCompleted']){
        $testNo = $test['testNo']
        unset($jsonArray[$testNo]);
    }
    else{
        foreach($test['floorArray'] as $floor){ //loop all the floors
            $activeNodeOnFloor = false;
            foreach($floor['nodeList'] as $point){ //losp all point
                if(!$point['active']){ 
                   unset($point); //Remove if point is not active
                }
                else{
                    $activeNodeOnFloor = true;
                }
            }
            if(!$activeNodeOnFloor){
                unset($floor);       
            }
        }
    }
}
$myfile = fopen("configActive.json", "w"); //debugging only
fwrite($myfile, json_encode($jsonArray));
fclose($myfile);
echo("reading config done");
echo(json_encode($jsonArray));
?>