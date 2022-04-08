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
        if ($arrDec[0]->Users->chg == 1) $chg = "1"; else $chg = "0";
        $pwd = base64_encode($arrDec[0]->Users->passwd);
        if ($arrDec[0]->Users->chg == 1) {
            $q = "UPDATE usuarios SET adm = '{$adm}', type = '{$arrDec[0]->Users->type}', grp = '{$arrDec[0]->Users->grp}', user = '{$arrDec[0]->Users->user}',
            passwd = '{$pwd}', app = '{$arrDec[0]->Users->app}', acesso = '{$arrDec[0]->Users->acesso}', chgpwd = '1', chgpwd_next = DATE_ADD(CURDATE(),INTERVAL 1 DAY), icon = '{$icon}'
            WHERE id = {$arrDec[0]->Users->id}";
        } else {
            $q = "UPDATE usuarios SET adm = '{$adm}', type = '{$arrDec[0]->Users->type}', grp = '{$arrDec[0]->Users->grp}', user = '{$arrDec[0]->Users->user}',
            passwd = '{$pwd}', app = '{$arrDec[0]->Users->app}', acesso = '{$arrDec[0]->Users->acesso}', chgpwd = '0', chgpwd_next = NULL, icon = '{$icon}'
            WHERE id = {$arrDec[0]->Users->id}";
        }
        $r = @mysql_query($q) or die(mysql_error());
    } else {
        for ($i = 0; $i < $cntArr; $i++) {
            if ($arrDec[0]->Users[$i]->os == 0) $icon = "icon-link"; else $icon = "icon-ssh";
            if ($arrDec[0]->Users[$i]->adm == 1) $adm = "1"; else $adm = "0";
            $pwd = base64_encode($arrDec[0]->Users[$i]->passwd);
            if ($arrDec[0]->Users[$i]->chg == 1) {
                $q = "UPDATE usuarios SET adm = '{$adm}', type = '{$arrDec[0]->Users[$i]->type}', grp = '{$arrDec[0]->Users[$i]->grp}', user = '{$arrDec[0]->Users[$i]->user}',
                passwd = '{$pwd}', app = '{$arrDec[0]->Users[$i]->app}', acesso = '{$arrDec[0]->Users[$i]->acesso}', chgpwd = '1', chgpwd_next = DATE_ADD(CURDATE(),INTERVAL 1 DAY), icon = '{$icon}'
                WHERE id = {$arrDec[0]->Users[$i]->id}";
            } else {
                $q = "UPDATE usuarios SET adm = '{$adm}', type = '{$arrDec[0]->Users[$i]->type}', grp = '{$arrDec[0]->Users[$i]->grp}', user = '{$arrDec[0]->Users[$i]->user}',
                passwd = '{$pwd}', app = '{$arrDec[0]->Users[$i]->app}', acesso = '{$arrDec[0]->Users[$i]->acesso}', chgpwd = '0', chgpwd_next = NULL, icon = '{$icon}'
                WHERE id = {$arrDec[0]->Users[$i]->id}";
            }
            $r = @mysql_query($q) or die(mysql_error());
        }
    }
    mysql_close();
    //echo '{"Groups":"success"'}';
?>