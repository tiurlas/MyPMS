<?php
/*
session_start();

if(!isset($_SESSION['user'])) {
	// user is not logged in, do something like redirect to login.php
	header("Location: login.php");
	die();
}
   ini_set("session.gc_maxlifetime", "86400");
   function chkAcl($adm, $grpadm, $grp) {
      if ($_SESSION["adm"] == 1) {
         $fail = 0;
      } else {
         $fail = 0;
         if ($adm == 1) {
            if ($_SESSION["adm"] != 1)
               $fail++;
         }
         if ($grpadm == 1) {
            if ($_SESSION["grpadm"] != 1)
               $fail++;
         }
      }
      if ($fail > 0)
         return false;
      else
         return true;
   }
   */
?>