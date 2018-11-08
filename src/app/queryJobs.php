<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $q = "SELECT * FROM jobs ORDER BY jobid";
    $r = @mysql_query($q) or die(mysql_error());
    $num=mysql_numrows($r);
    mysql_close();
    $i = 0;
    while ($i < $num) {
        $dArray[$i]["jobid"] = mysql_result($r,$i,"jobid");
        $dArray[$i]["jobname"] = mysql_result($r,$i,"jobname");
        $dArray[$i]["dateExec"] = mysql_result($r,$i,"dateExec");
        $dArray[$i]["nextRun"] = mysql_result($r,$i,"nextRun");
        $dArray[$i]["status"] = mysql_result($r,$i,"status");
        $dArray[$i]["enable"] = mysql_result($r,$i,"enabled");
        $dArray[$i]["rInt"] = mysql_result($r,$i,"repeatInt");
        $dArray[$i]["rType"] = mysql_result($r,$i,"repeatType");
        $dArray[$i]["rCType"] = mysql_result($r,$i,"repeatCustomType");
        $dArray[$i]["rndPwd"] = mysql_result($r,$i,"rndpwd");
        $dArray[$i]["strPwd"] = mysql_result($r,$i,"strpwd");
        $i++;
    }
    echo '{"Jobs":'.json_encode($dArray).'}';
?>