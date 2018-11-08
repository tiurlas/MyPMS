<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $do = $_GET["action"];
    $id = $_GET["jobID"];
    $sList = $_GET["ServerList"];
    $eList = $_GET["AmbienteList"];
    $gList = $_GET["ModulList"];
    switch ($do) {
        case "svr":
            $q = "SELECT id, host AS display FROM servidores ORDER BY host";
            break;
        case "ambiente":
            $q = "SELECT id, ambiente AS display FROM ambiente ORDER BY ambiente";
            break;
        case "grp":
            $q = "SELECT id, modulo AS display FROM modules ORDER BY modulo";
            break;
        case "usr":
            if ($sList != "") {
                $q = "SELECT DISTINCT user AS display FROM usuarios WHERE type = 1 AND svr IN ({$sList}) AND chgpwd = 1 ORDER BY user";
            } else {
                if ($eList != "" && $gList != "")
                    $q = "SELECT DISTINCT u.user AS display FROM usuarios u
                    INNER JOIN servidores s ON u.svr = s.id
                    WHERE type = 1 AND s.ambiente IN ({$eList}) AND u.grp IN ({$gList}) AND chgpwd = 1 ORDER BY u.user";
                elseif ($eList != "" && $gList == "")
                    $q = "SELECT DISTINCT u.user AS display FROM usuarios u
                    INNER JOIN servidores s ON u.svr = s.id
                    WHERE type = 1 AND s.ambiente IN ({$eList}) AND chgpwd = 1 ORDER BY u.user";
                elseif ($eList == "" && $gList != "")
                    $q = "SELECT DISTINCT user AS display FROM usuarios WHERE type = 1 AND grp IN ({$gList}) AND chgpwd = 1 ORDER BY user";
                else
                    $q = "SELECT DISTINCT user AS display FROM usuarios WHERE type = 1 AND chgpwd = 1 ORDER BY user";
            }
            break;
        case "all":
            $q = "SELECT * FROM jobsParam WHERE jobid = {$id}";
            break;
    }
    $r = @mysql_query($q) or die(mysql_error());
    $num = mysql_numrows($r);
    mysql_close();
    $i = 0;
    while ($i < $num) {
        if ($id) {
            $dArray[$i]["strtype"] = mysql_result($r,$i,"paramtype");
            $dArray[$i]["strval"] = mysql_result($r,$i,"paramvalue");
            $dArray[$i]["exUsrs"] = mysql_result($r,$i,"usrExcept");
        } else {
            if ($do != "usr")
                $dArray[$i]["id"] = mysql_result($r,$i,"id");
            $dArray[$i]["display"] = mysql_result($r,$i,"display");
        }
        $i++;
    }
    echo '{"JobParams":'.json_encode($dArray).'}';
?>