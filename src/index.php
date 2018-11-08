<?php
// initialize session
session_start();

if(!isset($_SESSION['user'])) {
	// user is not logged in, do something like redirect to login.php
	header("Location: login.php");
	die();
}

/*if($_SESSION['access'] != 2) {
	// another example...
	// user is logged in but not a manager, let's stop him
	die("Access Denied");
}*/
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<LINK REL="SHORTCUT ICON" HREF="images/silk/lock.png">
	<title>MyPMS</title>
	<link rel="stylesheet" type="text/css" href="extjs3/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="extjs3/examples/shared/examples.css" />
	<link rel="stylesheet" type="text/css" href="extjs3/examples/ux/css/RowEditor.css" />
	<link rel="stylesheet" type="text/css" href="extjs3/examples/ux/css/MultiSelect.css" />
	<link rel="stylesheet" type="text/css" href="js/external/rowactions/css/Ext.ux.grid.RowActions.css">
	<link rel="stylesheet" type="text/css" href="js/external/SuperBox/superboxselect.css" />
	<link rel="stylesheet" type="text/css" href="js/external/codeMirror/codemirror.css" />
	<script type="text/javascript" src="extjs3/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="js/external/rowactions/js/Ext.ux.util.js"></script>
	<script type="text/javascript" src="extjs3/ext-all.js"></script>
	<script type="text/javascript" src="extjs3/examples/ux/RowEditor.js"></script>
	<script type="text/javascript" src="extjs3/examples/ux/MultiSelect.js"></script>
	<script type="text/javascript" src="extjs3/examples/ux/ItemSelector.js"></script>
	<script type="text/javascript" src="js/external/rowactions/js/Ext.ux.grid.RowActions.js"></script>
	<script type="text/javascript" src="js/external/rowactions/js/Ext.ux.Toast.js"></script>
	<script type="text/javascript" src="js/external/rowactions/js/RowExpander.js"></script>
	<script type="text/javascript" src="js/external/gridsearch/js/Ext.ux.grid.Search.js"></script>
    <script type="text/javascript" src="js/external/SuperBox/SuperBoxSelect.js"></script>
	<script type="text/javascript" src="js/external/codeMirror/codemirror.js"></script>
    <script type="text/javascript" src="js/external/codeMirror/shell.js"></script>
    <script type="text/javascript" src="js/external/codeMirror/matchbrackets.js"></script>
	<script type="text/javascript" src="js/external/codeMirror/active-line.js"></script>
	<script type="text/javascript" src="js/OSPanel.js"></script>
	<script type="text/javascript" src="js/ModPanel.js"></script>
	<script type="text/javascript" src="js/ProjPanel.js"></script>
	<script type="text/javascript" src="js/ClientPanel.js"></script>
	<script type="text/javascript" src="js/StatPanel.js"></script>
	<script type="text/javascript" src="js/AppPanel.js"></script>
	<script type="text/javascript" src="js/AmbPanel.js"></script>	
	<script type="text/javascript" src="js/UserTypePanel.js"></script>
	<script type="text/javascript" src="js/IpTypePanel.js"></script>
	<script type="text/javascript" src="js/UsersGrid.js"></script>
	<script type="text/javascript" src="js/IpGrid.js"></script>
	<script type="text/javascript" src="js/ChgPwdPanel.js"></script>
	<script type="text/javascript" src="js/Scheduler.js"></script>
	<script type="text/javascript" src="js/ScriptEditorPanel.js"></script>
	<script type="text/javascript" src="SUPBARLINK/supbar/ext.ux.menu.storemenu.js"></script>
	<script type="text/javascript" src="SUPBARLINK/supbar/supbar.js"></script>
	<script type="text/javascript" src="js/selApp.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
	<style>
		.x-selectable, .x-selectable * {
			-moz-user-select: text!important;
			-khtml-user-select: text!important;
		}
		body {
			/*background-image: url(images/Fondos/fractal1.jpg);*/
			background-repeat: no-repeat;
			background-size: cover;
			-webkit-background-size: cover; /* SAFARI / CHROME */
			-moz-background-size: cover; /* FIREFOX */
			-ms-background-size: cover; /* IE */
			-o-background-size: cover; /* OPERA */
		}
		div.x-grid-cell-rowbody {
		    marging-left : 50px;
		}
		.x-form-radio-group .x-panel-body { background-color: transparent; }
		span.pwdSel::selection {
			background: #C8C8C8;
		}
		span.pwdSel::-moz-selection {
			background: #C8C8C8;
		}
		::-webkit-scrollbar {
		    width: 10px;
		}
		::-webkit-scrollbar-track {
		    background: #FFF;
		    -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1);
		}
		::-webkit-scrollbar-thumb {
		    background: #CCC;
		    -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
		}
		::-webkit-scrollbar-thumb:hover {
		    background: #AAA;
		}
		::-webkit-scrollbar-thumb:active {
		    background: #888;
		    -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
		}
		.exit-button {
			text-align: right;
		}
	</style>
</head>
<body>	
	<div id="toolbar" style="height: auto; width: auto"></div>
	<div id="mypms" style="height: auto; width: auto"></div>
	<div id="gcom" style="height: auto; width: auto"></div>
	<input type="hidden" id="admin" name="admin" value="<?php echo $_SESSION['adm'] ?>"></input>
	<input type="hidden" id="username" name="username" value="<?php echo $_SESSION['user'] ?>"></input>
	<input type="hidden" id="name" name="name" value="<?php echo $_SESSION['user'] ?>"></input>
	<input type="hidden" id="grupos" name="grupos" value="<?php echo $_SESSION['grupos'] ?>"></input>
</body>
</html>
