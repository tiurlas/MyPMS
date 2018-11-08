<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
    $cntArr = count($arrDec[0]->Users);
    
    if ($cntArr == 1) {
        if ($arrDec[0]->Users->os == 0) $icon = "icon-link"; else $icon = "icon-ssh";
        if ($arrDec[0]->Users->adm == 1) $adm = "1"; else $adm = "0";
        $pwd = base64_encode($arrDec[0]->Users->passwd);
        if ($arrDec[0]->Users->chg == 1) $chg = "1"; else $chg = "0";
        if ($chg == 1) {
            $q = "INSERT INTO usuarios (svr,adm,type,grp,user,passwd,app,acesso,chgpwd,chgpwd_status,chgpwd_next,icon,iconAction)
            VALUES ('{$_GET['svr']}','{$adm}','{$arrDec[0]->Users->type}','{$arrDec[0]->Users->grp}','{$arrDec[0]->Users->user}','{$pwd}','{$arrDec[0]->Users->app}','{$arrDec[0]->Users->acesso}','{$chg}',2,DATE_ADD(CURDATE(),INTERVAL 1 DAY),'{$icon}', 'icon-run')";
        } else {
            $q = "INSERT INTO usuarios (svr,adm,type,grp,user,passwd,app,acesso,chgpwd,chgpwd_status,icon,iconAction)
            VALUES ('{$_GET['svr']}','{$adm}','{$arrDec[0]->Users->type}','{$arrDec[0]->Users->grp}','{$arrDec[0]->Users->user}','{$pwd}','{$arrDec[0]->Users->app}','{$arrDec[0]->Users->acesso}','{$chg}',2,'{$icon}', 'icon-run')";
        }
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            if ($arrDec[0]->Users[$i]->os == 0) $icon = "icon-link"; else $icon = "icon-ssh";
            if ($arrDec[0]->Users[$i]->adm == 1) $adm = "1"; else $adm = "0";
            $pwd = base64_encode($arrDec[0]->Users[$i]->passwd);
            if ($arrDec[0]->Users[$i]->chg == 1) $chg = "1"; else $chg = "0";
            if ($chg == 1) {
                $q = "INSERT INTO usuarios (svr,adm,type,grp,user,passwd,app,acesso,chgpwd,chgpwd_status,chgpwd_next,icon,iconAction)
                VALUES ('{$_GET['svr']}','{$adm}','{$arrDec[0]->Users[$i]->type}','{$arrDec[0]->Users[$i]->grp}','{$arrDec[0]->Users[$i]->user}','{$pwd}','{$arrDec[0]->Users[$i]->app}','{$arrDec[0]->Users[$i]->acesso}','{$chg}',2,DATE_ADD(CURDATE(),INTERVAL 1 DAY),'{$icon}', 'icon-run')";
            } else {
                $q = "INSERT INTO usuarios (svr,adm,type,grp,user,passwd,app,acesso,chgpwd,chgpwd_status,icon,iconAction)
                VALUES ('{$_GET['svr']}','{$adm}','{$arrDec[0]->Users[$i]->type}','{$arrDec[0]->Users[$i]->grp}','{$arrDec[0]->Users[$i]->user}','{$pwd}','{$arrDec[0]->Users[$i]->app}','{$arrDec[0]->Users[$i]->acesso}','{$chg}',2,'{$icon}', 'icon-run')";
            }
            $r = @mysql_query($q) or die(mysql_error());
        }
    }
    mysql_close();
    //echo '{"Groups":"success"'}';
?>