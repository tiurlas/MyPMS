<?php
      
      $dbHostname = "HOSTBANCO";
      $dbUsername = "USERBANCO";
      $dbPassword = "SENHABANCO";
      $dbName     = "NOMEBANCO";
     
      $dblink = MYSQL_CONNECT($dbHostname, $dbUsername, $dbPassword);
      if (!$dblink) {
		die('Erro ao conectar ao banco: ' . mysql_error());
	  }

      // Select the database name to be used or else print error message if unsuccessful*/
      $dbselect = mysql_select_db($dbName) or die( "Unable to select database ".$dbName); 
      mysql_set_charset('utf8',$dblink); 

?>