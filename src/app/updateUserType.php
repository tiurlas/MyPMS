<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
    $cntArr = count($arrDec[0]->UserType);
    if ($cntArr == 1) {
        $q = "UPDATE tipo_usuario SET tipo = '{$arrDec[0]->UserType->tipo}', display = '{$arrDec[0]->UserType->display}' WHERE id = {$arrDec[0]->UserType->id}";
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "UPDATE tipo_usuario SET tipo = '{$arrDec[0]->UserType[$i]->tipo}', display = '{$arrDec[0]->UserType[$i]->display}' WHERE id = {$arrDec[0]->UserType[$i]->id}";
            $r = @mysql_query($q) or die(mysql_error());
        }
    }
    mysql_close();
    //echo '{"Groups":"success"'}';
?>