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
    
    if ($cntArr == 1) {
        $q = "INSERT INTO servidores (host, ip, serial, os, tipo, ambiente, modulo, projeto, cliente, local, status)
        VALUES ('{$arrDec[0]->Hosts->host}', '{$arrDec[0]->Hosts->ip}', '{$arrDec[0]->Hosts->serial}', '{$arrDec[0]->Hosts->oid}', 
        '{$arrDec[0]->Hosts->tid}', '{$arrDec[0]->Hosts->aid}', '{$arrDec[0]->Hosts->mid}', '{$arrDec[0]->Hosts->projid}',
        '{$arrDec[0]->Hosts->clid}', '{$arrDec[0]->Hosts->local}', '{$arrDec[0]->Hosts->sid}')";
        //echo $q;
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "INSERT INTO servidores (host, ip, serial, os, tipo, ambiente, modulo, projeto, cliente, local, status)
            VALUES ('{$arrDec[0]->Hosts->host}', '{$arrDec[0]->Hosts->ip}', '{$arrDec[0]->Hosts->serial}', '{$arrDec[0]->Hosts->oid}', 
            '{$arrDec[0]->Hosts->tid}', '{$arrDec[0]->Hosts->aid}', '{$arrDec[0]->Hosts->mid}', '{$arrDec[0]->Hosts->projid}',
            '{$arrDec[0]->Hosts->clid}', '{$arrDec[0]->Hosts->local}', '{$arrDec[0]->Hosts->sid}')";
            $r = @mysql_query($q) or die(mysql_error());
        }
    }

    mysql_close();
    //echo '{"Groups":"success"'}';
?>