<?php
    $pNumber = rand(42000, 42100);
    $cmd = "sudo startTerm.sh {$_POST['ip']} {$_POST['user']} {$_POST['passwd']} {$pNumber} > /tmp/{$pNumber}.tmp 2>/dev/null && cat /tmp/{$pNumber}.tmp && rm /tmp/{$pNumber}.tmp";
    $rNumber = exec($cmd);
    $response = array("success" => true, "value" => "{$rNumber}");
    echo json_encode($response);
?>