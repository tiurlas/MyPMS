<?php
   session_start();

   if(!isset($_SESSION['user'])) {
       // user is not logged in, do something like redirect to login.php
       header("Location: login.php");
       die();
   }
   include("../db/doConn.php");
   function validateLogin() {
      if (isset($_SESSION["logged"]) && isset($_SESSION["nome"]))
         return true;
      else
         return false;
   }
?>