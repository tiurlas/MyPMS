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
    function generateRandomString($length = 8) {
        $chars[0] = "0123456789";
        $chars[1] = "abcdefghijklmnopqrstuvwxyz";
        $chars[2] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $chars[3] = "!@#$%.-=";
        $randomString = "";
        $arrLength = count($chars);
        for ($i = $arrLength; $i < $length; $i++) {
            $j = rand(0, $arrLength - 1);
            $chars[$i] = $chars[$j];
        }
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $chars[$i][rand(0, strlen($chars[$i]) - 1)];
        }
        return $randomString;
    }
	function changePasswd($host, $user, $passwd, $newpasswd) {
		if (@ping($host)) {
			$cmd = "/bin/ChgPwd.sh {$host} {$user} {$passwd} {$newpasswd}; echo $?";
			$out = exec($cmd);
			switch ($out) {
					case "0":
							$pwd = base64_encode($newpasswd);
							$passwdbkp = base64_encode($passwd);
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(),
							chgpwd_status = 0, passwd = '{$pwd}', chgpwd_msg = 'Password successfully changed' WHERE host = '{$host}' AND user = '{$user}'";
							$qBKP = "UPDATE vw_pwd_audit SET passwdbkp = '{$passwdbkp}' WHERE host = '{$host}' AND user = '{$user}'";
							$doBKP = @mysql_query($qBKP) or die(mysql_error());
							break;
					case "3":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 3, 
							chgpwd_msg = 'Failed to change password. Unknown error' WHERE host = '{$host}' AND user = '{$user}'";
							break;
					case "10":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 10, 
							chgpwd_msg = 'Connection to host refused' WHERE host = '{$host}' AND user = '{$user}'";
							break;
					case "11":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 11, 
							chgpwd_msg = 'Connection closed by host' WHERE host = '{$host}' AND user = '{$user}'";
							break;
					case "12":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 12, 
							chgpwd_msg = 'Could not reach host' WHERE host = '{$host}' AND user = '{$user}'";
							break;
					case "13":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 13, 
							chgpwd_msg = 'Unknown hostname' WHERE host = '{$host}' AND user = '{$user}'";
							break;
					case "14":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 14, 
							chgpwd_msg = 'Current password do not match' WHERE host = '{$host}' AND user = '{$user}'";
							break;
					case "15":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 15, 
							chgpwd_msg = 'Cannot find an available prompt' WHERE host = '{$host}' AND user = '{$user}'";
							break;
					case "16":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 16, 
							chgpwd_msg = 'Connection time out' WHERE host = '{$host}' AND user = '{$user}'";
							break;
					default:
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 3, 
							chgpwd_msg = 'Failed to change password. Unknown error' WHERE host = '{$host}' AND user = '{$user}'";
			}
		} else {
			$q = "UPDATE vw_pwd_audit SET chgpwd_last = CURDATE(), chgpwd_status = 12, 
			chgpwd_msg = 'Could not reach host' WHERE host = '{$host}' AND user = '{$user}'";
		}
		$run = @mysql_query($q) or die(mysql_error());
		$response = array("success" => true, "value" => "OK");
		echo json_encode($response);
	}
	
   $handler = php_sapi_name();
	if ($handler === "cli") {
		$m = "[ERROR] Missing parameters\n\nUsage: ${argv[0]} -h [false|hostname] -u [false|username] -d [false|dd/mm/yyyy] -a [true|false]\n";
		$m .= "\t-h\thostname to change passwords; false means that other option will be used\n";
		$m .= "\t-u\tchange password of 'username'; if used combined with -h will change password of user 'username' on host 'hostname';\n\t\t false means that other option will be used\n";
		$m .= "\t-d\twill change all password of date 'date'; false means that other option will be used\n";
		$m .= "\t-a\tauto change - gets hostnames and users from database; false means that other option will be used\n";
        $m .= "\nAll arguments are mandatory! See example:\n";
        $m .= "\nRun password change on all hosts schedule as 'auto' for current date:\n";
        $m .= "\t${argv[0]} -h false -u false -d false -a true\n\n";
		$options = getopt("h:u:d:a:");
		if ($argc != 9) {
			echo $m;
			return false;
		} else {
			foreach ($options as $opt => $value) {
				switch($opt) {
					case 'h':
						$host = $value;
                        $argumentHost = true;
						break;
					case 'u':
						$user = $value;
                        $argumentUser = true;
						break;
					case 'd':
						$dateExec = $value;
                        $argumentDate = true;
						break;
					case 'a':
						$auto = $value;
                        $argumentAuto = true;
						break;
					default:
						echo $m;
						return false;
				}
			}
            if (!($argumentAuto && $argumentDate && $argumentHost && $argumentUser)) {
                echo $m;
            } else {
                echo $host . "\n";
                echo $user . "\n";
                echo $dateExec . "\n";
                echo $auto . "\n";
            }
		}
	} else {
		$host = $_POST["host"];
		$user = $_POST["user"];
		$dateExec = $_POST["dtExec"];
		$auto = $_POST["auto"];
	}
	if ($auto == "true") {
		$q = "SELECT * FROM vw_pwd_audit WHERE chgpwd_next = CURDATE() AND chgpwd = 1";
	} elseif ($dateExec != "false") {
		$q = "SELECT * FROM vw_pwd_audit WHERE chgpwd_next = $dateExec AND chgpwd = 1";
	} elseif ($host != "false") {
		if ($user != "false")
			$q = "SELECT * FROM vw_pwd_audit WHERE host = '{$host}' AND user = '{$user}'";
		else
			$q = "SELECT * FROM vw_pwd_audit WHERE host = '{$host}'";
	} elseif ($user != "false" && $host == "false") {
		$q = "SELECT * FROM vw_pwd_audit WHERE user = '{$user}'";
	}
	$r = @mysql_query($q) or die(mysql_error());
	$num = mysql_numrows($r);
	while ($i < $num) {
		$userExec = mysql_result($r,$i,"user");
		$hostExec = mysql_result($r,$i,"host");
		$pwdTmp = mysql_result($r,$i,"passwd");
		$pwdExec = base64_decode($pwdTmp);
		$newPwdExec = generateRandomString(8);
		changePasswd($hostExec, $userExec, $pwdExec, $newPwdExec);
		$i++;
	}
	mysql_close();
?>