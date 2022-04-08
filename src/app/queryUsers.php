<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    if ($_POST['adm'] != 0) {
        $q = "SELECT u.id, u.adm, u.app, u.type, u.user, u.passwd, u.acesso, u.icon, u.grp, u.chgpwd, t.tipo AS os
        FROM usuarios u INNER JOIN tipo_usuario t ON u.type = t.id
        WHERE svr = {$_POST['svr']} ORDER BY type, user";
    /*} elseif ($_POST['grpadm'] == 1) {
        $q = "SELECT u.id, u.adm, u.app, u.type, u.user, u.passwd, u.acesso, u.icon, u.grp, u.chgpwd, t.tipo AS os
        FROM usuarios u INNER JOIN tipo_usuario t ON u.type = t.id
        WHERE svr = {$_POST['svr']} AND u.adm != 1 ORDER BY type, user";*/
    } else {
        $q = "SELECT u.id, u.adm, u.app, u.type, u.user, u.passwd, u.acesso, u.icon, u.grp, u.chgpwd, t.tipo AS os
        FROM usuarios u INNER JOIN tipo_usuario t ON u.type = t.id
        WHERE u.svr = {$_POST['svr']} AND u.adm = 0 ORDER BY type, user";
        /*
        $q = "SELECT u.id, u.adm, u.app, u.type, u.user, u.passwd, u.acesso, u.icon, u.grp, u.chgpwd, t.tipo AS os
        FROM usuarios u INNER JOIN tipo_usuario t ON u.type = t.id
        WHERE svr = {$_POST['svr']} AND u.adm != 1 AND u.grp = {$_POST['dpto']} ORDER BY type, user";
        */
    }
    if ($_GET[all] == "true") {
        $q = "SELECT DISTINCT user FROM usuarios WHERE type = 1 ORDER BY user";
        $r = @mysql_query($q) or die(mysql_error());
        $num=mysql_numrows($r);
        mysql_close();
        $i = 0;
        while ($i < $num) {
            $dArray[$i]["user"] = mysql_result($r,$i,"user");
            $i++;
        }
    } else {
        $r = @mysql_query($q) or die(mysql_error());
        $num=mysql_numrows($r);
        mysql_close();
        $i = 0;
        if ($num == 0) {
            $dArray = false;
        } else {
            while ($i < $num) {
                $dArray[$i]["id"] = mysql_result($r,$i,"id");
                $dArray[$i]["adm"] = mysql_result($r,$i,"adm");
                $dArray[$i]["type"] = mysql_result($r,$i,"type");
                $dArray[$i]["os"] = mysql_result($r,$i,"os");
                $dArray[$i]["grp"] = mysql_result($r,$i,"grp");
                $dArray[$i]["app"] = mysql_result($r,$i,"app");
                $dArray[$i]["user"] = mysql_result($r,$i,"user");
                $dArray[$i]["chg"] = mysql_result($r,$i,"chgpwd");
                $dArray[$i]["passwd"] = base64_decode(mysql_result($r,$i,"passwd"));
                $dArray[$i]["acesso"] = mysql_result($r,$i,"acesso");
                $dArray[$i]["icon"] = mysql_result($r,$i,"icon");
                $i++;
            }
        }
    }
    echo '{"Users":'.json_encode($dArray).'}';
?>
