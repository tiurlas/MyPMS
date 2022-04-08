<?php
    session_start();
    if (!isset($_SESSION['user']) && !isset($_SESSION['logged'])) {
        $dArray = false;
        $totalrec = 0;
        $success = "0";
        $_SESSION['sourceurl'] = "/";
        echo '{"success":' . $success . ',"Hosts":'.json_encode($dArray).',"Count": "'.$totalrec.'"}';
    } else {
        $success = "1";
        include("../db/doConn.php");
        $grupos = $_SESSION['grupos'];
        $filter = trim($_POST['filter']);
        $sort = $_POST['sort'];
        $dir = $_POST['dir'];
        switch($grupos) {
            case "administrador" :
                $query = "WHERE clid != 0 ";
            break;
            case "usuario" :
                $query = "WHERE clid != 0 ";
            break;
            case "cliente1" :
                $query = " WHERE clid = 1 ";
            break;
            case "cliente2" :
                $query = " WHERE clid = 2 AND aid != 4 ";
            break;
            case "cliente3" :
                $query = " WHERE clid = 2 AND aid = 4 ";
            break;
            case "cliente4" :
                $query = " WHERE clid = 5 AND aid != 4 ";
            break;
            case "cliente5" :
                $query = " WHERE clid = 5 AND aid = 4 ";
            break;
            default: "echo 'Olá, você não tem nenhum acesso liberado'";
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
            
            $FullFilter = " AND ({$qFilter})";
            
        } else {
            $FullFilter = "";
        }
        //echo $FullFilter;
    
        
      /*  if (!isset($query) && isset($FullFilter)) {
            $query=" WHERE ";
        } 
        echo $query; */

        $q = "SELECT DISTINCT hid FROM vw_server " . $query . $FullFilter;
        $r = @mysql_query($q) or die(mysql_error());
        $num = mysql_numrows($r);
        $totalrec = $num;
        if ($sort) {
            $FullFilter .= " ORDER BY {$sort} {$dir}";
        } else {
            $FullFilter .= " ORDER BY host ASC";
        }
        //$q = "SELECT * FROM vw_server" . $FullFilter . " LIMIT " . $_POST['start'] . ", " . $_POST['limit'];
        //$q = "SELECT DISTINCT s.* FROM vw_server s LEFT JOIN acl_server h ON s.hid = h.svr LEFT JOIN acl_user u ON h.grp = u.grp " . $FullFilter . " LIMIT " . $_POST['start'] . ", " . $_POST['limit'];
        $q = "SELECT DISTINCT * FROM vw_server " . $query . $FullFilter . " LIMIT " . $_POST['start'] . ", " . $_POST['limit'];
        $r = @mysql_query($q) or die(mysql_error());
        $num = mysql_numrows($r);
        mysql_close();
        $i = 0;
        if ($num > 0) {
            while ($i < $num) {
                $dArray[$i]["id"] = mysql_result($r,$i,"hid");
                $dArray[$i]["host"] = mysql_result($r,$i,"host");
                $dArray[$i]["ip"] = mysql_result($r,$i,"ip");
                $dArray[$i]["serial"] = mysql_result($r,$i,"serial");
                $dArray[$i]["oid"] = mysql_result($r,$i,"oid");
                $dArray[$i]["os"] = mysql_result($r,$i,"os");
                $dArray[$i]["tid"] = mysql_result($r,$i,"tid");
                $dArray[$i]["tipo"] = mysql_result($r,$i,"tipo");
                $dArray[$i]["aid"] = mysql_result($r,$i,"aid");
                $dArray[$i]["ambiente"] = mysql_result($r,$i,"ambiente");
                $dArray[$i]["mid"] = mysql_result($r,$i,"mid");
                $dArray[$i]["modulo"] = mysql_result($r,$i,"modulo");
                $dArray[$i]["projid"] = mysql_result($r,$i,"projid");
                $dArray[$i]["projeto"] = mysql_result($r,$i,"projeto");
                $dArray[$i]["clid"] = mysql_result($r,$i,"clid");
                $dArray[$i]["cliente"] = mysql_result($r,$i,"cliente");                
                $dArray[$i]["local"] = mysql_result($r,$i,"local");
                $dArray[$i]["sid"] = mysql_result($r,$i,"sid");
                $dArray[$i]["status"] = mysql_result($r,$i,"status");;
                $i++;
            }
        }else{
            $dArray = false;
            $totalrec = 0;
        }
        echo '{"success":' . $success . ',"Hosts":'.json_encode($dArray).',"Count": "'.$totalrec.'"}';
    }
?>
