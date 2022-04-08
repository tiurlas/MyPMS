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
        $q = "UPDATE servidores SET host = '{$arrDec[0]->Hosts->host}', ip = '{$arrDec[0]->Hosts->ip}', 
        serial = '{$arrDec[0]->Hosts->serial}', os = '{$arrDec[0]->Hosts->oid}', tipo = '{$arrDec[0]->Hosts->tid}',
        ambiente = '{$arrDec[0]->Hosts->aid}', modulo = '{$arrDec[0]->Hosts->mid}', projeto = '{$arrDec[0]->Hosts->projid}',
        cliente = '{$arrDec[0]->Hosts->clid}', local = '{$arrDec[0]->Hosts->local}', status = '{$arrDec[0]->Hosts->sid}'
        WHERE id = {$arrDec[0]->Hosts->id};";
        echo $q;
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "UPDATE servidores SET host = '{$arrDec[0]->Hosts->host}', ip = '{$arrDec[0]->Hosts->ip}', 
            serial = '{$arrDec[0]->Hosts->serial}', os = '{$arrDec[0]->Hosts->oid}', tipo = '{$arrDec[0]->Hosts->tid}',
            ambiente = '{$arrDec[0]->Hosts->aid}', modulo = '{$arrDec[0]->Hosts->mid}', projeto = '{$arrDec[0]->Hosts->projid}',
            cliente = '{$arrDec[0]->Hosts->clid}', local = '{$arrDec[0]->Hosts->local}', status = '{$arrDec[0]->Hosts->sid}'
            WHERE id = {$arrDec[0]->Hosts[$i]->id};";
            $r = @mysql_query($q) or die(mysql_error());
        }
    }

    mysql_close();
    //echo '{"Groups":"success"'}';
?>