<?php
	session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
    include("../db/doConn.php");
	function ping($host,$port=22,$timeout=2)
	{
			$fsock = fsockopen($host, $port, $errstr, $timeout);
			if ( ! $fsock ) {
					return FALSE;
			} else {
					fclose($fsock);
					return TRUE;
			}
	}
	function updtInv($h) {
		$__DIR = "/mypms/bin/";
		//$h = $_GET["host"];
		$q = "select h.id,h.host,u.user,u.passwd from servidores h inner join usuarios u on h.id = u.svr where u.type = 1 and h.host = '{$h}'";
		$r = @mysql_query($q) or die(mysql_error());
		$num = mysql_numrows($r);
		if ($num < 1) {
			echo "<span style='bold 12px Trebuchet MS, Verdana, Arial, Helvetica,sans-serif;color: red'>Could not authenticate on {$h}<br></span>";
			return false;
		}
		$num1 = mysql_numrows($r);
            $i = 0;
            while ($i < $num1) {
                $dArray[$i][id] = mysql_result($r,$i,"id");
                $sid = mysql_result($r,$i,"id");
                $i++;
            }
		$j = 0;
		if (@ping($h)) {
				while ($j < $num) {
						$usr = mysql_result($r,$j,"user");
						$pwd = base64_decode(mysql_result($r,$j,"passwd"));
						$cmd = "/mypms/bin/SO.sh {$usr} {$h} {$pwd}";
						$out = exec($cmd);
						switch ($out) {
								case "Linux":
										$script = "Linux.sh";
										$ok = 0;
										break 2;
								case "AIX":
										$script = "AIX.sh";
										$ok = 0;
										break 2;
								case "SunOS":
										$script = "Solaris.sh";
										$ok = 0;
										break 2;
								default:
										$ok = 1;
						}
						$j++;
				}
				$cmd = "sshpass -p {$pwd} scp {$__DIR}/{$script} {$usr}@{$h}:/tmp";
				$out = exec($cmd,$out,$ret);
				if ($ret == 0) {
						$cmd = "sshpass -p {$pwd} ssh -q -o StrictHostKeyChecking=no {$usr}@{$h} /tmp/{$script} sys";
						$sys = trim(shell_exec($cmd));
						$cmd = "sshpass -p {$pwd} ssh -q -o StrictHostKeyChecking=no {$usr}@{$h} /tmp/{$script} cpu";
						$cpu = trim(shell_exec($cmd));
						$cmd = "sshpass -p {$pwd} ssh -q -o StrictHostKeyChecking=no {$usr}@{$h} /tmp/{$script} cpuphy";
						$cpuphy = trim(shell_exec($cmd));
						$cmd = "sshpass -p {$pwd} ssh -q -o StrictHostKeyChecking=no {$usr}@{$h} /tmp/{$script} mem";
						$mem = trim(shell_exec($cmd));
						$cmd = "sshpass -p {$pwd} ssh -q -o StrictHostKeyChecking=no {$usr}@{$h} /tmp/{$script} dsk";
						$dsk = trim(shell_exec($cmd));
						$cmd = "sshpass -p {$pwd} ssh -q -o StrictHostKeyChecking=no {$usr}@{$h} /tmp/{$script} swap";
						$swap = trim(shell_exec($cmd));
						$cmd = "sshpass -p {$pwd} ssh -q -o StrictHostKeyChecking=no {$usr}@{$h} /tmp/{$script} nic";
						$nic = trim(shell_exec($cmd));
						$cmd = "sshpass -p {$pwd} ssh -q -o StrictHostKeyChecking=no {$usr}@{$h} rm -f /tmp/{$script}";
						shell_exec($cmd);
				} else {
						$ok = 3;
				}
		} else {
				$ok = 2;
		}
		switch ($ok) {
				case 0:
						$q = "SELECT id FROM hw_inv WHERE svr = {$sid}";
						$r = @mysql_query($q) or die(mysql_error());
						$num = mysql_numrows($r);
						if ($num > 0) {
								$q = "UPDATE hw_inv SET os = '{$sys}', cpu = '{$cpuphy}', clock = '{$cpu}', mem = '{$mem}', swap = '{$swap}', date = NOW() WHERE svr = '{$sid}'";
								$r = @mysql_query($q) or die(mysql_error());
								$q = "DELETE FROM hw_inv_nic WHERE id = '{$sid}'";
								$r = @mysql_query($q) or die(mysql_error());
								$q = "DELETE FROM hw_inv_dsk WHERE id = '{$sid}'";
								$r = @mysql_query($q) or die(mysql_error());
								
								$tmp = preg_replace('/\s+/', '_', trim($dsk));
								$dsks = explode("_", $tmp);
								for ($i = 0; $i < count($dsks); $i++) {
										$q = "INSERT INTO hw_inv_dsk (id, dsk) VALUES ('{$sid}', '{$dsks[$i]}')";
										$r = @mysql_query($q) or die(mysql_error());
								}
								
								$tmp = preg_replace('/\s+/', '_', trim($nic));
								$nics = explode("_", $tmp);
								for ($i = 0; $i < count($nics); $i++) {
										$nics_ex = explode("&", $nics[$i]);
										$q = "INSERT INTO hw_inv_nic (id, nic, ip, macaddr) VALUES ('{$sid}', '{$nics_ex[0]}', '{$nics_ex[1]}', '{$nics_ex[2]}')";
										$r = @mysql_query($q) or die(mysql_error());
								}
						} else {
								$q = "INSERT INTO hw_inv (svr, os, cpu, clock, mem, swap, date) VALUES ('{$sid}', '{$sys}', '{$cpuphy}', '{$cpu}', '{$mem}', '{$swap}', NOW())";
								$r = @mysql_query($q) or die(mysql_error());
								$tmp = preg_replace('/\s+/', '_', trim($dsk));
								$dsks = explode("_", $tmp);
								for ($i = 0; $i < count($dsks); $i++) {
										$q = "INSERT INTO hw_inv_dsk (id, dsk) VALUES ('{$sid}', '{$dsks[$i]}')";
										$r = @mysql_query($q) or die(mysql_error());
								}
								
								$tmp = preg_replace('/\s+/', '_', trim($nic));
								$nics = explode("_", $tmp);
								for ($i = 0; $i < count($nics); $i++) {
										$nics_ex = explode("&", $nics[$i]);
										$q = "INSERT INTO hw_inv_nic (id, nic, ip, macaddr) VALUES ('{$sid}', '{$nics_ex[0]}', '{$nics_ex[1]}', '{$nics_ex[2]}')";
										$r = @mysql_query($q) or die(mysql_error());
								}
						}
						return true;
						break;
				case 1:
						echo "<span style='bold 12px Trebuchet MS, Verdana, Arial, Helvetica,sans-serif;color: red'>Could not authenticate on {$h}<br></span>";
						return false;
						break;
				case 2:
						echo "<span style='bold 12px Trebuchet MS, Verdana, Arial, Helvetica,sans-serif;color: red'>Could not reach host {$h}<br></span>";
						return false;
						break;
				case 3:
						echo "<span style='bold 12px Trebuchet MS, Verdana, Arial, Helvetica,sans-serif;color: red'>Could not retrieve hardware information from {$h}<br></span>";
						return false;
						break;
		}
		mysql_close();
	}
?>