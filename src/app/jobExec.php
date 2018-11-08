<?php
	session_start();

    if(!isset($_SESSION['user'])) {
        // user is not logged in, do something like redirect to login.php
        header("Location: login.php");
        die();
    }
   $handler = php_sapi_name();
	if ($handler !== "cli") {
		echo "Must run from command line!";
		return FALSE;
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
	function changePasswd($host, $user, $passwd, $newpasswd, $dateExec, $strInterval) {
		if (@ping($host)) {
			$cmd = "/mypms/bin/ChgPwd.sh {$host} {$user} {$passwd} {$newpasswd}; echo $?";
			$out = exec($cmd);
			switch ($out) {
					case "0":
							$pwd = base64_encode($newpasswd);
							$passwdbkp = base64_encode($passwd);
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval},
							chgpwd_status = 0, passwd = '{$pwd}', chgpwd_msg = 'Password successfully changed' WHERE host = '{$host}' AND user = '{$user}'";
							$qBKP = "UPDATE vw_pwd_audit SET passwdbkp = '{$passwdbkp}' WHERE host = '{$host}' AND user = '{$user}'";
							$doBKP = @mysql_query($qBKP) or die(mysql_error());
							$runStatus = 0;
							break;
					case "3":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 3, 
							chgpwd_msg = 'Failed to change password. Unknown error' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 3;
							break;
					case "10":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 10, 
							chgpwd_msg = 'Connection to host refused' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 10;
							break;
					case "11":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 11, 
							chgpwd_msg = 'Connection closed by host' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 11;
							break;
					case "12":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 12, 
							chgpwd_msg = 'Could not reach host' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 12;
							break;
					case "13":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 13, 
							chgpwd_msg = 'Unknown hostname' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 13;
							break;
					case "14":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 14, 
							chgpwd_msg = 'Current password do not match' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 14;
							break;
					case "15":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 15, 
							chgpwd_msg = 'Cannot find an available prompt' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 15;
							break;
					case "16":
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 16, 
							chgpwd_msg = 'Connection time out' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 16;
							break;
					default:
							$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 3, 
							chgpwd_msg = 'Failed to change password. Unknown error' WHERE host = '{$host}' AND user = '{$user}'";
							$runStatus = 99;
			}
		} else {
			$q = "UPDATE vw_pwd_audit SET chgpwd_last = '{$dateExec}', chgpwd_next = {$strInterval}, chgpwd_status = 12, 
			chgpwd_msg = 'Could not reach host' WHERE host = '{$host}' AND user = '{$user}'";
			$runStatus = 1;
		}
		$run = @mysql_query($q) or die(mysql_error());
		$response = array("success" => true, "value" => $runStatus);
		echo json_encode($response);
	}
	
	$curDate = date('Y-m-d', time());
	
	$q = "SELECT jobid FROM jobs WHERE dateExec = '{$curDate}' AND enabled = 1";
	$r = @mysql_query($q) or die(mysql_error());
	$num = mysql_numrows($r);
	$i = 0;
	while ($i < $num) {
		$jID = mysql_result($r,$i,"jobid");
		$q = "SELECT * FROM jobs WHERE jobid = {$jID}";
		$res = mysql_query($q) or die(mysql_error());
		$q = "UPDATE jobs SET status = 2 WHERE jobid = {$jID}";
		mysql_query($q) or die(mysql_error());
		$interval = mysql_result($res,0,"repeatType");
		$randPwd = mysql_result($res,0,"rndpwd");
		$strPwd = mysql_result($res,0,"strpwd");
		switch ($interval) {
			case "once":
				$nRun = "NULL";
				$nRun2 = "NULL";
				break;
			case "daily":
				$nRun = "DATE_ADD('{$curDate}', INTERVAL 1 DAY)";
				$nRun2 = "DATE_ADD('{$curDate}', INTERVAL 2 DAY)";
				break;
			case "weekly":
				$nRun = "DATE_ADD('{$curDate}', INTERVAL 1 WEEK)";
				$nRun2 = "DATE_ADD('{$curDate}', INTERVAL 2 WEEK)";
				break;
			case "monthly":
				$nRun = "DATE_ADD('{$curDate}', INTERVAL 1 MONTH)";
				$nRun2 = "DATE_ADD('{$curDate}', INTERVAL 2 MONTH)";
				break;
			case "yearly":
				$nRun = "DATE_ADD('{$curDate}', INTERVAL 1 YEAR)";
				$nRun2 = "DATE_ADD('{$curDate}', INTERVAL 2 YEAR)";
				break;
			case "custom":
				$rnum = mysql_result($res,0,"repeatInt");
				$ctype = mysql_result($res,0,"repeatCustomType");
				$nRun = "DATE_ADD('{$curDate}', INTERVAL {$rnum} {$ctype})";
				$nRun2 = "DATE_ADD(DATE_ADD('{$curDate}', INTERVAL {$rnum} {$ctype}), INTERVAL {$rnum} {$ctype})";
				break;
		}
		
		$q = "SELECT s.host,u.user,u.passwd FROM usuarios u
		INNER JOIN servidores s ON u.svr = s.id
		INNER JOIN ambiente e ON s.ambiente = e.id
		INNER JOIN modules g ON s.modulo = g.id
		WHERE u.type = 1
		AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jID} AND paramType = 'ambiente') > 0,
		e.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'ambiente'), 1=1)
		AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jID} AND paramType = 'svr') > 0,
		s.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'svr'), 1=1)
		AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jID} AND paramType = 'grp') > 0,
		g.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'grp'), 1=1)
		AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jID} AND paramType = 'usr') > 0,
		IF ((SELECT usrExcept FROM jobsParam WHERE jobid = {$jID} AND paramType = 'usr' LIMIT 0,1) = 1,
		u.user NOT IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'usr'),
		u.user IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'usr')),
		1=1)
		AND u.chgpwd = 1
		ORDER BY s.host";
		
		$res = @mysql_query($q) or die(mysql_error());
		$nRows = mysql_numrows($res);
		$j = 0;
		while ($j < $nRows) {
			$userExec = mysql_result($res,$j,"user");
			$hostExec = mysql_result($res,$j,"host");
			$pwdTmp = mysql_result($res,$j,"passwd");
			$pwdExec = base64_decode($pwdTmp);
			if ($randPwd == "1")
				$newPwdExec = generateRandomString(8);
			else
				$newPwdExec = $strPwd;
			echo "\n\nchangePasswd({$hostExec}, {$userExec}, {$pwdExec}, {$newPwdExec}, {$curDate}, {$nRun})\n";
			changePasswd($hostExec, $userExec, $pwdExec, $newPwdExec, $curDate, $nRun);
			$j++;
		}
		
		
		$q = "SELECT COUNT(*) AS count FROM usuarios u
		INNER JOIN servidores s ON u.svr = s.id
		INNER JOIN ambiente e ON s.ambiente = e.id
		INNER JOIN modules g ON s.modulo = g.id
		WHERE u.type = 1
		AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jID} AND paramType = 'ambiente') > 0,
		e.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'ambiente'), 1=1)
		AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jID} AND paramType = 'svr') > 0,
		s.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'svr'), 1=1)
		AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jID} AND paramType = 'grp') > 0,
		g.id IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'grp'), 1=1)
		AND IF ((SELECT count(*) FROM jobsParam WHERE jobid = {$jID} AND paramType = 'usr') > 0,
		IF ((SELECT usrExcept FROM jobsParam WHERE jobid = {$jID} AND paramType = 'usr' LIMIT 0,1) = 1,
		u.user NOT IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'usr'),
		u.user IN (SELECT paramvalue FROM jobsParam WHERE jobid = {$jID} AND paramType = 'usr')),
		1=1)
		AND u.chgpwd = 1 AND u.chgpwd_status = 0";
		$result = mysql_query($q) or die(mysql_error());
		$sucCount = mysql_result($result,0,"count");
		if ($sucCount == $nRows)
			$status = 0;
		else
			$status = 1;
		
		if ($interval == "once")
			$q = "UPDATE jobs SET dateExec = {$nRun}, nextRun = {$nRun2}, status = {$status}, enabled = 0 WHERE jobid = {$jID}";
		else
			$q = "UPDATE jobs SET dateExec = {$nRun}, nextRun = {$nRun2}, status = {$status} WHERE jobid = {$jID}";
		mysql_query($q) or die(mysql_error());
		$i++;
	}
	mysql_close();
?>