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
    if ($cntArr == 1) {
        $q = "UPDATE ip SET addr = '{$arrDec[0]->IP->addr}', addrnat = '{$arrDec[0]->IP->addrnat}', tipo = '{$arrDec[0]->IP->tid}' WHERE sid = {$arrDec[0]->IP->id}";
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "UPDATE ip SET addr = '{$arrDec[0]->IP[$i]->addr}', addrnat = '{$arrDec[0]->IP[$i]->addrnat}', tipo = '{$arrDec[0]->IP[$i]->tid}' WHERE sid = {$arrDec[0]->IP[$i]->id}";
            $r = @mysql_query($q) or die(mysql_error());
        }
    }
    mysql_close();
    //echo '{"Groups":"success"'}';
?>