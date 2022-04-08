<?php
// initialize session
session_start();

include("ldapconf.php");

// check to see if user is logging out
if(isset($_GET['out'])) {
	// destroy session
	session_unset();
	$_SESSION = array();
	unset($_SESSION['user'],$_SESSION['access']);
	session_destroy();
}

// check to see if login form has been submitted
if(isset($_POST['login'])){
	// run information through authenticator
	if(authenticate($_POST['login'],$_POST['password']))
	{
		// authentication passed
		header("Location: index.php");
		die();
	} else {
		// authentication failed
		$error = 1;
	}
}
?>
<!doctype html>
<html>
<head>
<!--Import Google Icon Font-->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
      <link type="text/css" rel="stylesheet" href="materialize/css/materialize.min.css"  media="screen,projection"/>

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
       
	<meta charset="utf-8" />
	<link rel="shortcut icon" href="/mypms/logon/images/silk/lock.png" type="image/x-icon"/>
	<title>MyPMS</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	
	<title>Login - MyPMS</title>


</head>
	<body style="background: url(/mypms/logon/images/Fondos/teladelogin1.png) no-repeat center center fixed;
background-size: cover;
-webkit-background-size: cover; /* SAFARI / CHROME */
-moz-background-size: cover; /* FIREFOX */
-ms-background-size: cover; /* IE */
-o-background-size: cover; /* OPERA */
">
	<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
      <script type="text/javascript" src="materialize/js/materialize.min.js"></script>
      
	<div class="container">
	<div class="row">
	 <div class="col s12">
	<div class="col s6 offset-s3">
	<div class="card-panel">
	<?php
        if(isset($error)) echo "<p style='text-align: center; color: red';>Falha de Login: Usuário ou Senha incorretas, ou acesso não autorizado.</p><br />";
		// output logout success
		if(isset($_GET['out'])) echo "<p style='text-align: center';>Logout successful</p>";
	?>
	<h5 class="center-align">Bem-vindo - Faça o Login</h5>
		<form action="login.php" method="POST">
		      <div class="row">
        <div class="input-field col s12">
		<i class="material-icons prefix">account_circle</i>
          <input id="usuario" type="text" name="login" class="validate" required="required">
          <label for="usuario">Usuário:</label>
        </div>
      </div>
		      <div class="row">
        <div class="input-field col s12">
		<i class="material-icons prefix">vpn_key</i>		
          <input id="password" type="password" name="password" class="validate" required="required">
          <label for="senha">Senha:</label>
        </div>
	
				<div class="center-align">
				  <button class="btn waves-effect waves-light" type="submit" name="action">Entrar
    <i class="material-icons right">send</i>
  </button></div>
				
			<!--	<tr>
					<td><input type="submit" value="Entrar"></td>
				</tr> 
			</table>-->
		</form>
		</div>
		</div>
		</div>
		</div>
	</div>
	</body>
</html>