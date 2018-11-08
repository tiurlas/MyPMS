<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $q = "SELECT * FROM tipo_ip ORDER BY tipo";
    $r = @mysql_query($q) or die(mysql_error());
    $num=mysql_numrows($r);
    mysql_close();
    $i = 0;
    while ($i < $num) {
        $dArray[$i]["id"] = mysql_result($r,$i,"id");
        $dArray[$i]["tipo"] = mysql_result($r,$i,"tipo");
        $i++;
    }
    echo '{"IpType":'.json_encode($dArray).'}';
?>