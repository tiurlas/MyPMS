<?php
/*
	$user = $_POST['uname'];
	$apwd = trim($_POST['opwd']);
	$npwd = "{MD5}" . base64_encode(pack("H*",md5(trim($_POST['npwd']))));
	$ldapSvr = "ldapsvr";
	$ds = ldap_connect($ldapSvr);
	$search = ldap_search($ds, "dc=com", "uid=$user");
	$info = ldap_get_entries($ds, $search);
	$bind = @ldap_bind($ds, $info[0][dn], $apwd);
	if (!$bind) {
		$response = array("success" => false, "msg" => "Your current password does not match!");
		echo json_encode($response);
	} else {
		if (ldap_mod_replace($ds, $info[0][dn], array('userpassword' => $npwd))) {
			$response = array("success" => true, "msg" => "Your password has been changed!");
			echo json_encode($response);
		} else {
			$response = array("success" => false, "msg" => "Failed to change your password");
			echo json_encode($response);
		}
	}
	*/
?>

