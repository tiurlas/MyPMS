<?php
    session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
    $filter = $_POST['filter'];
    $sort = $_POST['sort'];
    $dir = $_POST['dir'];
    
    if ($_POST['env'] != 'All') {
        $env[] = json_decode(stripslashes($_POST['env']), true);
        $c = count($ambiente[0]);
        if ($c > 1) {
            for ($i = 0; $i < $c; $i++) {
                $eFilter .= "env = '{$env[0][$i]}'";
                if ($i < $c-1)
                    $eFilter .= " OR ";
            }
        } else {
            if ($env[0][0] == 'All')
                $eFilter = "";
            else
                $eFilter = "env = '{$env[0][0]}'";
        }
    } else {
        $eFilter = "";
    }
    
    if ($_POST['state'] != 'All Status') {
        if ($_POST['state'] == 'Success')
            $sFilter = "chgpwd_status = 0";
        elseif ($_POST['state'] == 'Failure')
            $sFilter = "chgpwd_status > 2";
        else
            $sFilter = "chgpwd_status = 2";
    } else {
        $sFilter = "";
    }
    
    if ($filter != "NO_FILTER") {
        $fields[] = json_decode(stripslashes($_POST['fields']), true);
        $c = count($fields[0]);
        if ($c > 1) {
            for ($i = 0; $i < $c; $i++) {
                $qFilter .= "{$fields[0][$i]} LIKE '%{$filter}%'";
                if ($i < $c-1)
                    $qFilter .= " OR ";
            }
        } else {
            $qFilter = "{$fields[0][0]} LIKE '%{$filter}%'";
        }
        if ($eFilter != "") {
            if ($sFilter != "")
                $FullFilter = " WHERE ({$qFilter}) AND ({$eFilter}) AND ({$sFilter})";
            else
                $FullFilter = " WHERE ({$qFilter}) AND ({$eFilter})";
        } else {
            if ($sFilter != "")
                $FullFilter = " WHERE ({$qFilter}) AND ({$sFilter})";
            else
                $FullFilter = " WHERE ({$qFilter})";
        }
    } else {
        if ($eFilter != "") {
            if ($sFilter != "")
                $FullFilter = " WHERE ({$eFilter}) AND ({$sFilter}) AND chgpwd = 1";
            else
                $FullFilter = " WHERE ({$eFilter}) AND chgpwd = 1";
        } else {
            if ($sFilter != "")
                $FullFilter = " WHERE ({$sFilter}) AND chgpwd = 1";
            else
                $FullFilter = " WHERE chgpwd = 1";
        }
    }
    
    $q = "SELECT COUNT(*) AS total FROM vw_pwd_audit". $FullFilter;
    $r = @mysql_query($q) or die(mysql_error());
    $totalrec = mysql_result($r,0,"total");
    
    if ($sort) {
        $FullFilter .= " ORDER BY host,{$sort} {$dir}";
    } else {
        $FullFilter .= " ORDER BY host,user ASC";
    }
    $q = "SELECT * FROM vw_pwd_audit" . $FullFilter . " LIMIT " . $_POST['start'] . ", " . $_POST['limit'];
    $r = @mysql_query($q) or die(mysql_error());
    $num=mysql_numrows($r);
    mysql_close();
    $i = 0;
    if ($num > 0) {
        while ($i < $num) {
            $dArray[$i]["host"] = mysql_result($r,$i,"host");
            $dArray[$i]["chgpwd"] = mysql_result($r,$i,"chgpwd");
            $dArray[$i]["chgpwd_msg"] = mysql_result($r,$i,"chgpwd_msg");
            $dArray[$i]["chgpwd_status"] = mysql_result($r,$i,"chgpwd_status");
            $dArray[$i]["chgpwd_last"] = mysql_result($r,$i,"chgpwd_last");
            $dArray[$i]["chgpwd_next"] = mysql_result($r,$i,"chgpwd_next");
            $dArray[$i]["user"] = mysql_result($r,$i,"user");
            $dArray[$i]["amb"] = mysql_result($r,$i,"ambiente");
            $dArray[$i]["ico"] = mysql_result($r,$i,"iconAction");
            $i++;
        }
    } else {
        $dArray = false;
        $totalrec = 0;
    }
    echo '{"ChgPwd":'.json_encode($dArray).',"Count": "'.$totalrec.'"}';
?>