<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $jobID = $_GET["jobID"];
    $action = $_GET["action"];
    $enable = $_GET["enable"];
    if ($action == "enable") {
        $q = "UPDATE jobs SET enabled = {$enable} WHERE jobid = {$jobID}";
        mysql_query($q) or die(mysql_error());
    } elseif ($action == "delete") {
        $q = "DELETE FROM jobs WHERE jobid = {$jobID}";
        mysql_query($q) or die(mysql_error());
        $q = "DELETE FROM jobsParam WHERE jobid = {$jobID}";
        mysql_query($q) or die(mysql_error());
    }
    $q = "UPDATE usuarios u 
        INNER JOIN servidores s ON u.svr = s.id
        INNER JOIN ambiente e ON s.ambiente = e.id
        INNER JOIN modules g ON s.modulo = g.id
        SET u.chgpwd_next = NULL
        WHERE u.type = 1
        AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'ambiente') > 0,
        e.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'ambiente'), 1=1)
        AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'svr') > 0,
        s.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'svr'), 1=1)
        AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'grp') > 0,
        g.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'grp'), 1=1)
        AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'usr') > 0,
        IF ((SELECT usrExcept FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'usr' LIMIT 0,1) = 1,
        u.user NOT IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'usr'),
        u.user IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jobID} AND paramType = 'usr')),
        1=1)
        AND u.chgpwd = 1";
    mysql_query($q) or die(mysql_error());
    mysql_close();
?>