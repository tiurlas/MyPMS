<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
    $cntArr = count($arrDec[0]->Modul);
    if ($cntArr == 0) {
        $q = "DELETE FROM modules WHERE id = {$_POST['Modules']}";
        $r = @mysql_query($q) or die(mysql_error());
        /*$q = "DELETE FROM acl_server WHERE grp = '{$_POST['Groups']}'";
        @mysql_query($q) or die(mysql_error());
        $q = "DELETE FROM acl_user WHERE grp = '{$_POST['Groups']}'";
        @mysql_query($q) or die(mysql_error());*/
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            $q = "DELETE FROM modules WHERE id = '{$arrDec[0]->Modul[$i]}'";
            $r = @mysql_query($q) or die(mysql_error());
            /*$q = "DELETE FROM acl_server WHERE grp = '{$arrDec[0]->Groups[$i]}'";
            @mysql_query($q) or die(mysql_error());
            $q = "DELETE FROM acl_user WHERE grp = '{$arrDec[0]->Groups[$i]}'";
            @mysql_query($q) or die(mysql_error());*/
        }
    }

    mysql_close();
    //echo '{"Groups":"success"'}';
?>