<?php
    $pNumber = $_POST['p'];
    $cmd = "sudo /app/stopTerm.sh {$pNumber}";
    $rNumber = exec($cmd);
    $response = array("success" => true, "value" => "{$rNumber}");
    echo json_encode($response);
?>