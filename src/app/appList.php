<?php
session_start();

if(!isset($_SESSION['user'])) {
	// user is not logged in, do something like redirect to login.php
	header("Location: login.php");
	die();
}
    include("../db/doConn.php");
    $action = $_GET["action"];
    $do = $_GET["do"];
    $svr = $_GET["svr"];
    if ($action == "json") {
        if ($do == "read") {
            $q = "SELECT * FROM sw_name ORDER BY swname";
            $r = @mysql_query($q) or die(mysql_error());    
            $num = mysql_numrows($r);
            $i = 0;
            while ($i < $num) {
                $dArray[$i][id] = mysql_result($r,$i,"id");
                $dArray[$i][app] = mysql_result($r,$i,"swname");
                $i++;
            }
            echo '{"App":'.json_encode($dArray).'}';
        } elseif ($do == "update") {
            $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
            $cntArr = count($arrDec[0]->App);
            if ($cntArr == 1) {
                $q = "UPDATE sw_name SET swname = '{$arrDec[0]->App->app}' WHERE id = {$arrDec[0]->App->id}";
                mysql_query($q) or die(mysql_error());
            } else {
                for ($i = 0; $i < $cntArr; $i++) {
                    $q = "UPDATE sw_name SET swname = '{$arrDec[0]->App[$i]->app}' WHERE id = {$arrDec[0]->App[$i]->id}";
                    mysql_query($q) or die(mysql_error());
                }
            }
        } elseif ($do == "delete") {
            $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
            $cntArr = count($arrDec[0]->App);
            if ($cntArr == 0) {
                $q = "DELETE FROM sw_name WHERE id = {$_POST['App']}";
                mysql_query($q) or die(mysql_error());
            } else {
                for ($i = 0; $i < $cntArr; $i++) {
                    $q = "DELETE FROM sw_name WHERE id = '{$arrDec[0]->App[$i]}'";
                    mysql_query($q) or die(mysql_error());
                }
            }
        } elseif ($do == "add") {
            $arrDec[] = json_decode($HTTP_RAW_POST_DATA);
            $cntArr = count($arrDec[0]->App);
            if ($cntArr == 1) {
                $q = "INSERT INTO sw_name (swname) VALUES ('{$arrDec[0]->App->app}')";
                mysql_query($q) or die(mysql_error());
            } else {
                for ($i = 0; $i < $cntArr; $i++) {
                    $q = "INSERT INTO sw_name (swname) VALUES ('{$arrDec[0]->App[$i]->app}')";
                    mysql_query($q) or die(mysql_error());
                }
            }
        }
    } else {
        $q = "SELECT * FROM sw_name WHERE id NOT IN (SELECT swid FROM sw_inv WHERE id = {$svr}) ORDER BY swname";
        $r = @mysql_query($q) or die(mysql_error());    
        $num = mysql_numrows($r);
        $i = 0;
        echo "<option value=''>Select an application</option>\n";
        while ($i < $num) {
            echo "<option value='".mysql_result($r,$i,"id")."'>".mysql_result($r,$i,"swname")."</option>\n";
            $i++;
        }
    }
    mysql_close();
?>