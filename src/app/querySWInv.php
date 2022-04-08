<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $start = $_GET['start'];
    $limit = $_GET['limit'];
    $filter = $_GET['filter'];
    /*
    $q = "SELECT COUNT(*) AS total
        FROM sw_inv i INNER JOIN sw_name a ON i.swid = a.id
        INNER JOIN servidores s ON s.id = i.id
        WHERE s.host LIKE '%{$filter}%' OR a.swname LIKE '%{$filter}%'";
    $r = @mysql_query($q) or die(mysql_error());
    $totalrec = mysql_result($r,0,"total");
    */
    $q = "SELECT s.host,a.swname
        FROM sw_inv i INNER JOIN sw_name a ON i.swid = a.id
        INNER JOIN servidores s ON s.id = i.id
        WHERE s.host LIKE '%{$filter}%' OR a.swname LIKE '%{$filter}%'";
        //LIMIT {$start},{$limit}";
    $r = @mysql_query($q) or die(mysql_error());
    $num = mysql_numrows($r);
    mysql_close();
    $i = 0;
    while ($i < $num) {
        $dArray[$i]["host"] = mysql_result($r,$i,"host");
        $dArray[$i]["swname"] = mysql_result($r,$i,"swname");
        $i++;
    }
    //echo '{"SWInv":'.json_encode($dArray).',"Count": "'.$totalrec.'"}';
    echo '{"SWInv":'.json_encode($dArray).'}';
?>