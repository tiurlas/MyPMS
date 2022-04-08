<?php
/*
session_start();

if(!isset($_SESSION['user'])) {
	// user is not logged in, do something like redirect to login.php
	header("Location: login.php");
	die();
}
   include("../db/doConn.php");
   session_start();
   function checkLogin() {
      $surl=$_SERVER['REQUEST_URI'];
      if (!isset($_SESSION["logged"]) && !isset($_SESSION["nome"])) {
         $_SESSION['sourceurl']=$surl;
         header("Location: /logon/authenticate.php");
         exit;
      } else {
         $q = "SELECT adm FROM groups WHERE id = {$_SESSION["dptoid"]}";
         $r = @mysql_query($q) or die(mysql_error());
         $_SESSION["grpadm"] = mysql_result($r,"id");
         mysql_close();
      }
   }*/
?>