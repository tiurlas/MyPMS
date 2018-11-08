<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
    $cntArr = count($arrDec[0]->Hosts);
    if ($cntArr == 0) {
        $q = "DELETE FROM servidores WHERE id = {$_POST['Hosts']}";
        $r = @mysql_query($q) or die(mysql_error());
        $q = "DELETE FROM usuarios WHERE svr = {$_POST['Hosts']}";
        $r = @mysql_query($q) or die(mysql_error());
        $q = "DELETE FROM hw_inv WHERE svr = {$_POST['Hosts']}";
        $r = @mysql_query($q) or die(mysql_error());
        $q = "DELETE FROM hw_inv_dsk WHERE id = {$_POST['Hosts']}";
        $r = @mysql_query($q) or die(mysql_error());
        $q = "DELETE FROM hw_inv_nic WHERE id = {$_POST['Hosts']}";
        $r = @mysql_query($q) or die(mysql_error());
        $q = "DELETE FROM sw_inv WHERE id = {$_POST['Hosts']}";
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "DELETE FROM servidores WHERE id = '{$arrDec[0]->Hosts[$i]}'";
            $r = @mysql_query($q) or die(mysql_error());
            $q = "DELETE FROM usuarios WHERE svr = '{$arrDec[0]->Hosts[$i]}'";
            $r = @mysql_query($q) or die(mysql_error());
            $q = "DELETE FROM hw_inv WHERE svr = '{$arrDec[0]->Hosts[$i]}'";
            $r = @mysql_query($q) or die(mysql_error());
            $q = "DELETE FROM hw_inv_dsk WHERE id = '{$arrDec[0]->Hosts[$i]}'";
            $r = @mysql_query($q) or die(mysql_error());
            $q = "DELETE FROM hw_inv_nic WHERE id = '{$arrDec[0]->Hosts[$i]}'";
            $r = @mysql_query($q) or die(mysql_error());
            $q = "DELETE FROM sw_inv WHERE id = '{$arrDec[0]->Hosts[$i]}'";
            $r = @mysql_query($q) or die(mysql_error());
        }
    }
    mysql_close();
    //echo '{"Groups":"success"'}';
?>