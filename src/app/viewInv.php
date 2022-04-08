<?php
ob_start();
error_reporting(E_ERROR | E_PARSE);
session_start();

if(!isset($_SESSION['user'])) {
    // user is not logged in, do something like redirect to login.php
    header("Location: login.php");
    die();
}
include("../db/doConn.php");
//require("checkAccess.php");
require_once("getInv.php");
    
$h = $_GET["host"];
$q = "SELECT id FROM servidores WHERE host = '{$h}'";
$r = @mysql_query($q) or die(mysql_error());
//$sid = mysql_result($r,"id");

$num = mysql_numrows($r);
$i = 0;
while ($i < $num) {
    $dArray[$i][id] = mysql_result($r,$i,"id");
    $sid = mysql_result($r,$i,"id");
    $i++;
}
?>

<html>
    <style>
        .bf {
            margin-left: 0;
            padding-left: 0;
            clear: left;
        }
        .bl {
            margin-right: 0;
            padding-right: 0;
            margin-right: 0;
        }
        .box {
            background: #FFFFFF;
            margin:1px;
            font: bold 12px "Trebuchet MS", Verdana, Arial, Helvetica,sans-serif;
            padding: 2px;
            border: 1 solid black;
            float: left;
            margin-right: 3px;
        }
        .header {
            background: #585858;
            color: white;
            text-align: center;
        }
        .title {
            background: #303030;
            color: white;
            text-align: center;
        }
        .h1 {
            width: 640px;
        }
        .h2 {
            width: 406px;
        }
        .h3 {
            width: 207px;
        }
        .h4 {
            width: 315px;
        }
        .b1 {
            width: 240px;
        }
        .b2 {
            width: 90px;
        }
        .b3 {
            width: 415px;
        }
        .b4 {
            width: 215px;
        }
        .b5 {
            width: 110px;
        }
        .b6 {
            width: 165px;
        }
        .tb1 {
                width: 232px;
                background: transparent url('./images/bg.jpg') no-repeat;
                color : #747862;
                height: 30px;
                border: 0;
                padding: 4px 8px;
                margin-bottom: 0px;
                font: italic 12px "Trebuchet MS", Verdana, Arial, Helvetica,sans-serif;
        }
    </style>
    <body>
        <div id="main<?php echo $h; ?>" class="box" style="width: 99%;">
            <br>
        <?php
        /*
            if (!chkAcl(0, 1, 0)) {
                echo "<span style='bold 16px Trebuchet MS, Verdana, Arial, Helvetica,sans-serif; color: red'> You are not authorized to access this page!</span>";
                exit;
            }
        */
            $q = "SELECT * FROM hw_inv WHERE svr = {$sid}";
            $r = @mysql_query($q) or die(mysql_error());
            $num = mysql_numrows($r);
            if ($num == 0 || $_GET["update"] == "true") {
                if (!updtInv($h)) {
                    echo "<span style='bold 12px Trebuchet MS, Verdana, Arial, Helvetica,sans-serif;color: red'><br>Failed to load server info<br></span>";
                    return false;
                } else {
                    $r = @mysql_query($q) or die(mysql_error());
                }
            }
            $os = mysql_result($r,0,"os");
            $mem = mysql_result($r,0,"mem");
            $swap = mysql_result($r,0,"swap");
            $cpu = mysql_result($r,0,"cpu");
            $clock = mysql_result($r,0,"clock");
            $dt = mysql_result($r,0,"date");
        ?>
        <div class="box h1 bf bl title">
            Last Hardware Update [<?php echo date("d-m-Y H:i", strtotime($dt)); ?>] &nbsp; <a href="javascript: updateInv('<?php echo $h; ?>')"><img Ext: qtip='Update hardware info' id="refreshImg<?php echo $sid; ?>" src='./images/refresh.png' width='14' height='14' style='vertical-align:middle'></a>
        </div>
        <div class="box bf b1 header">
            Operational System
        </div>
        <div class="box b2 header">
            Memory
        </div>
        <div class="box b2 header">
            Swap
        </div>
        <div class="box b2 header">
            CPU #
        </div>
        <div class="box b2 bl header">
            Clock
        </div>
        <div class="box bf b1">
            <?php echo $os; ?>
        </div>
        <div class="box b2">
            <?php echo $mem; ?>
        </div>
        <div class="box b2">
            <?php echo $swap; ?>
        </div>
        <div class="box b2">
            <?php echo $cpu; ?>
        </div>
        <div class="box b2 bl">
            <?php echo $clock; ?>
        </div>
        <div class="box bf b3">
            <div class="box bf b5 header">
                NIC
            </div>
            <div class="box b6 header">
                MAC Address
            </div>
            <div class="box b5 bl header">
                IP
            </div>
                <?php
                    $q = "SELECT * FROM hw_inv_nic WHERE id = {$sid}";
                    $r = @mysql_query($q) or die(mysql_error());    
                    $num = mysql_numrows($r);
                    $i = 0;
                    while ($i < $num) {
                        if (mysql_result($r,$i,"macaddr") == '')
                            $mac = '-';
                        else
                            $mac = mysql_result($r,$i,"macaddr");
                        echo "<div class='box bf b5'>".mysql_result($r,$i,"nic")."</div>\n";
                        echo "<div class='box b6'>".$mac."</div>\n";
                        echo "<div class='box b5 bl'>".mysql_result($r,$i,"ip")."</div>\n";
                        $i++;
                    }
                ?>
        </div>
        <div class="box b4 bl">
            <div class="box h3 bf bl header">
                Disks
            </div>
                <?php
                    $q = "SELECT * FROM hw_inv_dsk WHERE id = {$sid}";
                    $r = @mysql_query($q) or die(mysql_error());    
                    $num = mysql_numrows($r);
                    $i = 0;
                    while ($i < $num) {
                        echo "<div class='box h3 bf bl'>".mysql_result($r,$i,"dsk")."</div>\n";
                        $i++;
                    }
                ?>
        </div>
        <div class="box h1 bf bl title">
            Installed Software &nbsp; <a href="javascript: toggleApp('<?php echo $sid; ?>');"><img Ext: qtip='Add new application' id="addImg<?php echo $sid; ?>" src='./images/add_app.png' width='14' height='14' style='vertical-align:middle'></a>
        </div>
        <div class='box h4 bf header'>Application</div>
        <div class='box h4 bl header'>Path</div>
        <div id="selApp<?php echo $sid; ?>" class="box h1 bf bl" style="height: auto;display: none;">
            <select class="tb1" id="appList<?php echo $sid; ?>">
            </select>
            <input id="pathApp<?php echo $sid; ?>" class="tb1" type="text" value="App Path" onFocus="if (value == 'App Path') {value=''}" onBlur="if (value== '') {value='App Path'}">
            <a href="javascript: saveNewApp('<?php echo $sid; ?>')">
                <img Ext: qtip='Save' src="./images/save_app.png" width='16' height='16' style='vertical-align:middle'>
            </a>
        </div>
        <span id="div<?php echo $sid; ?>"></span>
        <?php
            $q = "SELECT s.swid,s.path,n.swname FROM sw_inv s INNER JOIN sw_name n ON s.swid = n.id WHERE s.id = {$sid}";
            $r = @mysql_query($q) or die(mysql_error());    
            $num = mysql_numrows($r);
            $i = 0;
            while ($i < $num) {
                $d = mysql_result($r,$i,"swid");
                $pt = mysql_result($r,$i,"path");
                echo "<div id='div{$sid}_{$d}' class='box h4 bf'><a href=javascript:delApp('{$sid}','{$d}');>
                <img Ext: qtip='Remove application' src='./images/rm_app.png' width='12' height='12' style='vertical-align:middle'></a> &nbsp;".mysql_result($r,$i,"swname")."</div>\n";
                echo "<div id='div{$d}_{$sid}' class='box h4 bl'>{$pt}</div>\n";
                $i++;
            }
        ?>
        <div class="box h1 bf bl" style="visibility: hidden;">&nbsp;</div>
        </div>
    </body>
</html>