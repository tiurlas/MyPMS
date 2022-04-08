<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $q = "SELECT i.sid AS sid, i.id AS id, i.addr AS addr, i.addrnat AS addrnat, i.tipo AS tid, t.tipo AS tipo FROM ip i LEFT JOIN tipo_ip t ON i.tipo = t.id WHERE i.id = {$_GET['id']}";
    $r = @mysql_query($q) or die(mysql_error());
    $num=mysql_numrows($r);
    mysql_close();
    $i = 0;
    while ($i < $num) {
        $dArray[$i]["id"] = mysql_result($r,$i,"sid");
        $dArray[$i]["sid"] = mysql_result($r,$i,"id");
        $dArray[$i]["tid"] = mysql_result($r,$i,"tid");
        $dArray[$i]["addr"] = mysql_result($r,$i,"addr");
        $dArray[$i]["addrnat"] = mysql_result($r,$i,"addrnat");
        $dArray[$i]["tipo"] = mysql_result($r,$i,"tipo");
        $i++;
    }
    echo '{"IP":'.json_encode($dArray).'}';
?>