<?php
function authenticate($user, $password) {
	if(empty($user) || empty($password)) return false;

	// active airectory server
	$ldap_host = "IP do AD:389";

	// active directory DN (base location of ldap search)
	$ldap_dn = "cn=users,DC=com,DC=br";
	
	
	// active directory user group suporte Client1
	$ldap_user_cliente1 = "Client1 Group Name";

	// active directory user group suporte Client2
	$ldap_user_cliente2 = "Client2 Group Name";

	// active directory user group suporte Client3
	$ldap_user_cliente3 = "Client3 Group Name";

	// active directory user group suporte Client4
	$ldap_user_cliente4 = "Client4 Group Name";

	// active directory user group suporte Client5
	$ldap_user_cliente5 = "Client5 Group Name";
	
	// active directory user group name
	$ldap_user_group = "User Group Name";

	// active directory manager group name
	$ldap_manager_group = "Manager Group Name";

	// domain, for purposes of constructing $user
	$ldap_usr_dom = '@dominio.com.br';

	// connect to active directory
	$ldap = ldap_connect($ldap_host);

	// configure ldap params
	ldap_set_option($ldap,LDAP_OPT_PROTOCOL_VERSION,3);
	ldap_set_option($ldap,LDAP_OPT_REFERRALS,0);

	// verify user and password
	if($bind = @ldap_bind($ldap, $user.$ldap_usr_dom, $password)) {
		// valid
		// check presence in groups
		$filter = "(sAMAccountName=".$user.")";
		$attr = array("memberof");
		$result = ldap_search($ldap, $ldap_dn, $filter, $attr) or exit("Unable to search LDAP server");
		$entries = ldap_get_entries($ldap, $result);
		ldap_unbind($ldap);

		// check groups
		foreach($entries[0]['memberof'] as $grps) {
			// is manager, break loop
			if(strpos($grps, $ldap_manager_group)) { 
				$access = 1;
				$adm = 1;
				$grupos = administrador;
				break; }

			// is user teste
			if(strpos($grps, $ldap_user_group)) {
				$access = 1;
				$adm = 2;
				$grupos = usuario;
				break; }

			// is suporte cliente1
			if(strpos($grps, $ldap_user_cliente1)) {
				$access = 1;
				$adm = 0;
				$grupos = cliente1;
				break; }
			
			// is suporte cliente2
			if(strpos($grps, $ldap_user_cliente2)) {
				$access = 1;
				$adm = 0;
				$grupos = cliente2;
				break; }
			
			// is suporte cliente3
			if(strpos($grps, $ldap_user_cliente3)) {
				$access = 1;
				$adm = 0;
				$grupos = cliente3;
				break; }
				
			// is suporte cliente4
			if(strpos($grps, $ldap_user_cliente4)) {
				$access = 1;
				$adm = 0;
				$grupos = cliente4;
				break; }
				
			// is cliente5
			if(strpos($grps, $ldap_user_cliente5)) {
				$access = 1;
				$adm = 2;
				$grupos = cliente5;
				break; }
			

		}

		if($access != 0) {
			// establish session variables
			$_SESSION['user'] = $user;
			$_SESSION['access'] = $access;
			$_SESSION['adm'] = $adm;
			$_SESSION['grupos'] = $grupos;
			return true;
		} else {
			// user has no rights
			return false;
		}

	} else {
		// invalid name or password
		return false;
	}
}
?>