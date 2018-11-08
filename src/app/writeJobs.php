<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $svr = $_GET["svrbox"];
    $amb = $_GET["ambbox"];
    $mod = $_GET["modbox"];
    $usr = $_GET["usrbox"];
    $usrExclude = $_GET["exUsr"];
    $jName = $_GET["jname"];
    $jRndPwd = $_GET["rndpwdradio"];
    $jPwd = $_GET["strrndpwd"];
    if (!$jPwd) $jPwd = "NULL";
    $jDtExec = $_GET["dtexec"];
    $tmpDt = implode('-', array_reverse(explode('/', $jDtExec)));
    $jDt = "{$tmpDt}";
    $insertID = $_GET["jobId"];
    $repeat = $_GET["repeatconf"];
    switch ($repeat) {
        case "once":
            $rnum = 0;
            $rtype = "once";
            $nRun = "NULL";
            break;
        case "daily":
            $rnum = 0;
            $rtype = "daily";
            $nRun = "DATE_ADD('{$jDt}', INTERVAL 1 DAY)";
            break;
        case "weekly":
            $rnum = 0;
            $rtype = "weekly";
            $nRun = "DATE_ADD('{$jDt}', INTERVAL 1 WEEK)";
            break;
        case "monthly":
            $rnum = 0;
            $rtype = "monthly";
            $nRun = "DATE_ADD('{$jDt}', INTERVAL 1 MONTH)";
            break;
        case "yearly":
            $rnum = 0;
            $rtype = "yearly";
            $nRun = "DATE_ADD('{$jDt}', INTERVAL 1 YEAR)";
            break;
        case "custom":
            $rnum =  $_GET["rnum"];
            $ctype = $_GET["rCmb"];
            $rtype = "custom";
            $nRun = "DATE_ADD('{$jDt}', INTERVAL {$rnum} {$ctype})";
            break;
    }
    if ($insertID) {
        $q = "UPDATE jobs SET dateExec = '{$jDt}', rndpwd = '{$jRndPwd}', strpwd = '{$jPwd}', 
        jobname = '{$jName}', nextRun = {$nRun}, repeatInt = '{$rnum}', repeatType = '{$rtype}', repeatCustomType = '{$ctype}' WHERE jobid = {$insertID}";
        mysql_query($q) or die(mysql_error());
        $q = "DELETE FROM jobsParam WHERE jobid = {$insertID}";
        mysql_query($q) or die(mysql_error());
    } else {
        $q = "INSERT INTO jobs (dateExec, rndpwd, strpwd, jobname, nextRun, repeatInt, repeatType, repeatCustomType)
        VALUES ('{$jDt}', '{$jRndPwd}', '{$jPwd}', '{$jName}', {$nRun}, '{$rnum}', '{$rtype}', '{$ctype}')";
        mysql_query($q) or die(mysql_error());
        $insertID = mysql_insert_id();
    }
    if ($svr == "on") {
        $svrs = $_GET["svrs"];
        foreach ($svrs as $svrVal) {
            $q = "INSERT INTO jobsParam (jobid, paramtype, paramvalue, usrExcept) VALUES ({$insertID}, 'svr', '{$svrVal}', 0)";
            mysql_query($q) or die(mysql_error());
        }
    }
    if ($amb == "on") {
        $ambs = $_GET["ambs"];
        foreach ($ambs as $ambVal) {
            $q = "INSERT INTO jobsParam (jobid, paramtype, paramvalue, usrExcept) VALUES ({$insertID}, 'amb', '{$ambVal}', 0)";
            mysql_query($q) or die(mysql_error());
        }
    }
    if ($mod == "on") {
        $mods = $_GET["mods"];
        foreach ($mods as $modVal) {
            $q = "INSERT INTO jobsParam (jobid, paramtype, paramvalue, usrExcept) VALUES ({$insertID}, 'mod', '{$modVal}', 0)";
            mysql_query($q) or die(mysql_error());
        }
    }
    if ($usr == "on") {
        $usrs = $_GET["usrs"];
        foreach ($usrs as $usrVal) {
            $q = "INSERT INTO jobsParam (jobid, paramtype, paramvalue, usrExcept) VALUES ({$insertID}, 'usr', '{$usrVal}', '{$usrExclude}')";
            mysql_query($q) or die(mysql_error());
        }
    }
    mysql_close();
    $response = array("success" => true, "value" => "{$insertID}");
    echo json_encode($response);
?>