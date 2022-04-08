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
        $q = "INSERT INTO ip (id,addr,addrnat,tipo) VALUES ('{$_GET['id']}','{$arrDec[0]->IP->addr}','{$arrDec[0]->IP->addrnat}','{$arrDec[0]->IP->tid}')";
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "INSERT INTO ip (id,addr,addrnat,tipo) VALUES ('{$_GET['id']}','{$arrDec[0]->IP[$i]->addr}','{$arrDec[0]->IP[$i]->addrnat}','{$arrDec[0]->IP[$i]->tid}')";
            $r = @mysql_query($q) or die(mysql_error());
        }
    }

    mysql_close();
    //echo '{"Groups":"success"'}';
?>