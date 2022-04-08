<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    if ($_POST["updateIcon"] == "true") {
        $q = "UPDATE vw_pwd_audit SET iconAction = '{$_POST["icon"]}' WHERE host = '{$_POST["host"]}' AND user = '{$_POST["user"]}'";
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
        $cntArr = count($arrDec[0]->ChgPwd);
        if ($cntArr == 1) {
            if ($arrDec[0]->ChgPwd->chgpwd_next != "") {
                $q = "UPDATE vw_pwd_audit SET chgpwd_next = '{$arrDec[0]->ChgPwd->chgpwd_next}' WHERE host = '{$arrDec[0]->ChgPwd->host}' AND user = '{$arrDec[0]->ChgPwd->user}'";
            } else {
                $q = "UPDATE vw_pwd_audit SET chgpwd_next = NULL WHERE host = '{$arrDec[0]->ChgPwd->host}' AND user = '{$arrDec[0]->ChgPwd->user}'";
            }
            $r = @mysql_query($q) or die(mysql_error());
        } else {
            for ($i = 0; $i < $cntArr; $i++) {
                if ($arrDec[0]->ChgPwd->chgpwd_next != "") {
                    $q = "UPDATE vw_pwd_audit SET chgpwd_next = '{$arrDec[0]->ChgPwd[$i]->chgpwd_next}' WHERE host = '{$arrDec[0]->ChgPwd[$i]->host}' AND user = '{$arrDec[0]->ChgPwd[$i]->user}'";
                } else {
                    $q = "UPDATE vw_pwd_audit SET chgpwd_next = NULL WHERE host = '{$arrDec[0]->ChgPwd[$i]->host}' AND user = '{$arrDec[0]->ChgPwd[$i]->user}'";
                }
                $r = @mysql_query($q) or die(mysql_error());
            }
        }
    }
    mysql_close();
    echo '{"ChgPwd":"success"}';
?>