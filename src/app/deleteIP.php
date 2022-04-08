<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
    $cntArr = count($arrDec[0]->IP);
    if ($cntArr == 0) {
        $q = "DELETE FROM ip WHERE sid = {$_POST['IP']}";
        echo $q;
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "DELETE FROM ip WHERE sid = '{$arrDec[0]->IP[$i]}'";
            echo $q;
            $r = @mysql_query($q) or die(mysql_error());
        }
    }

    mysql_close();
    //echo '{"Groups":"success"'}';
?>