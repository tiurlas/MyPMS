<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
    $cntArr = count($arrDec[0]->Tipo);
    if ($cntArr == 1) {
        $q = "UPDATE tipo SET tipo = '{$arrDec[0]->Tipo->tipo}' WHERE id = {$arrDec[0]->Tipo->id}";
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "UPDATE tipo SET tipo = '{$arrDec[0]->Tipo[$i]->tipo}' WHERE id = {$arrDec[0]->Tipo[$i]->id}";
            $r = @mysql_query($q) or die(mysql_error());
        }
    }
    mysql_close();
    //echo '{"Groups":"success"'}';
?>