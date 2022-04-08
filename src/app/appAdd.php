<?php
session_start();

if(!isset($_SESSION['user'])) {
	// user is not logged in, do something like redirect to login.php
	header("Location: login.php");
	die();
}
    include("../db/doConn.php");
    $svr = $_GET["svr"];
    $swid = $_GET["app"];
    $path = $_GET["path"];
    $q = "INSERT INTO sw_inv (id, swid, path) VALUES ('{$svr}', '{$swid}', '{$path}')";
    $r = @mysql_query($q) or die(mysql_error());
    mysql_close();
?>