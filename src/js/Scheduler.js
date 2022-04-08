Scheduler = function() {
    var Jobs = new Ext.data.Store({
	proxy: new Ext.data.HttpProxy({
		url: './app/queryJobs.php',
		method: 'POST'
		}),
	reader: new Ext.data.JsonReader({   
	  root: 'Jobs'
	},[
	    {name: 'id', type: 'int', mapping: 'jobid'},
	    {name: 'jobname', type: 'string', mapping: 'jobname'},
	    {name: 'dateExec', type: 'date', dateFormat:'Y-m-d', mapping: 'dateExec'},
	    {name: 'nextRun', type: 'date', dateFormat:'Y-m-d', mapping: 'nextRun'},
	    {name: 'enable', type: 'int', mapping: 'enable'},
	    {name: 'rndPwd', type: 'int', mapping: 'rndPwd'},
	    {name: 'strPwd', type: 'string', mapping: 'strPwd'},
	    {name: 'rInt', type: 'string', mapping: 'rInt'},
	    {name: 'rType', type: 'string', mapping: 'rType'},
	    {name: 'rCType', type: 'string', mapping: 'rCType'},
	    {name: 'status', type: 'int', mapping: 'status'}
	])
    });
    var Svr = new Ext.data.Store({
	id: 'Svr',
	proxy: new Ext.data.HttpProxy({
	    url: './app/queryJobParams.php?action=svr',
	    method: 'GET'
	}),
	reader: new Ext.data.JsonReader({  
	    root: 'JobParams'
	},
	[
	    {name: 'id', type: 'int', mapping: 'id'},
	    {name: 'display', type: 'string', mapping: 'display'}
	])
    })
    var Ambiente = new Ext.data.Store({
	id: 'Ambiente',
	proxy: new Ext.data.HttpProxy({
	    url: './app/queryJobParams.php?action=amb',
	    method: 'GET'
	}),
	reader: new Ext.data.JsonReader({  
	    root: 'JobParams'
	},
	[
	    {name: 'id', type: 'int', mapping: 'id'},
	    {name: 'display', type: 'string', mapping: 'display'}
	])
    })
    var Model = new Ext.data.Store({
	id: 'Model',
	proxy: new Ext.data.HttpProxy({
	    url: './app/queryJobParams.php?action=mod',
	    method: 'GET'
	}),
	reader: new Ext.data.JsonReader({  
	    root: 'JobParams'
	},
	[
	    {name: 'id', type: 'int', mapping: 'id'},
	    {name: 'display', type: 'string', mapping: 'display'}
	])
    })
    var Users = new Ext.data.Store({
	id: 'Users',
	proxy: new Ext.data.HttpProxy({
	    url: './app/queryJobParams.php?action=usr',
	    method: 'GET'
	}),
	reader: new Ext.data.JsonReader({  
	    root: 'JobParams'
	},
	[
	    {name: 'display', type: 'string', mapping: 'display'}
	])
    })
    var JobDS = new Ext.data.Store({
	id: 'JobDS',
	proxy: new Ext.data.HttpProxy({
	    url: './app/queryJobParams.php',
	    method: 'GET'
	}),
	reader: new Ext.data.JsonReader({  
	    root: 'JobParams'
	},
	[
	    {name: 'strtype', type: 'string', mapping: 'strtype'},
	    {name: 'strval', type: 'string', mapping: 'strval'},
	    {name: 'exUsrs', type: 'int', mapping: 'exUsrs'}
	])
    })
    var rDS = new Ext.data.ArrayStore({
	fields: ['value', 'display'],
	data: [['Day', 'Day'], ['Week', 'Week'], ['Month', 'Month'], ['Year', 'Year']],
	autoLoad: true
    });
    
    Jobs.load();
    Ambiente.load();
    Svr.load();
    Model.load();
    Users.load();
    function pad(n){return n<10 ? '0'+n : n}
    
    var opnConfig = function(newJob, jobId) {
	svrArr = [];
	ambienteArr = [];
	modArr = [];
	usrArr = [];
	usrExArr = '';
	if (!newJob) {
	    JobDS.each(function(r) {
		if (r.get('strtype') == 'svr')
		    svrArr.push(r.get('strval'));
		if (r.get('strtype') == 'amb')
		    ambArr.push(r.get('strval'));
		if (r.get('strtype') == 'mod')
			modArr.push(r.get('strval'));
		if (r.get('strtype') == 'usr') {
		    usrArr.push(r.get('strval'));
		    usrExArr = r.get('exUsrs');
		}
	    })
	}
	var configJob = new Ext.form.FormPanel({
	    frame: true,
	    width: 720,
	    height: 450,
	    deferredRender: true,
	    items: [
		{
		    layout: 'column',
		    labelWidth: 70,
		    items: [
			{
			    columnWidth: .4,
			    layout: 'form',
			    items: [
				{
				    xtype:'textfield',
				    fieldLabel: 'Job Name',
				    id: 'jname',
				    name: 'jname',
				    disabled: false,
				    emptyText: '',
				    allowBlank: false
				},
				{
				    xtype: 'fieldset',
				    width: 235,
				    title: 'Random Password',
				    defaultType: 'radio',
				    layout: 'column',
				    items: [
					{
					    columnWidth: .2,
					    boxLabel: 'Yes',
					    hideLabel: true,
					    checked: true,
					    name: 'rndpwdradio',
					    inputValue: '1',
					    id: 'rnd1',
					    listeners: {
						check: function(cb, value) {
						    if (value) {
							Ext.getCmp("strrndpwd").allowBlank = true;
							Ext.getCmp("strrndpwd").setValue('');
							Ext.getCmp("strrndpwd").disable();
						    }
						}
					    }
					},
					{
					    columnWidth: .2,
					    boxLabel: 'No',
					    hideLabel: true,
					    checked: false,
					    name: 'rndpwdradio',
					    inputValue: '0',
					    id: 'rnd0',
					    listeners: {
						check: function(cb, value) {
						    if (value) {
							Ext.getCmp("strrndpwd").allowBlank = false;
							Ext.getCmp("strrndpwd").enable();
						    }
						}
					    }
					},
					{
					    columnWidth: .6,
					    xtype: 'textfield',
					    id: 'strrndpwd',
					    disabled: true,
					    emptyText: 'password'
					}
				    ]
				},{
				    xtype: 'fieldset',
				    width: 235,
				    title: 'Execution date',
				    layout: 'column',
				    height: 60,
				    items: [
					{
					    columnWidth: .5,
					    xtype: 'datefield',
					    allowBlank: false,
					    id: 'dtexec',
					    format: 'd/m/Y',
					    minValue: new Date().format('d/m/Y')
					}
				    ]
				},
				{
				    xtype: 'fieldset',
				    width: 235,
				    title: 'Schedule Config',
				    defaultType: 'radio',
				    layout: 'vbox',
				    height: 200,
				    items: [
					{
					    boxLabel: 'Once',
					    hideLabel: true,
					    checked: true,
					    name: 'repeatconf',
					    inputValue: 'once',
					    id: 'once'
					},
					{
					    boxLabel: 'Daily',
					    hideLabel: true,
					    checked: false,
					    name: 'repeatconf',
					    inputValue: 'daily',
					    id: 'daily'
					},
					{
					    boxLabel: 'Weekly',
					    hideLabel: true,
					    checked: false,
					    name: 'repeatconf',
					    inputValue: 'weekly',
					    id: 'weekly'
					},
					{
					    boxLabel: 'Monthly',
					    hideLabel: true,
					    checked: false,
					    name: 'repeatconf',
					    inputValue: 'monthly',
					    id: 'monthly'
					},
					{
					    boxLabel: 'Yearly',
					    hideLabel: true,
					    checked: false,
					    name: 'repeatconf',
					    inputValue: 'yearly',
					    id: 'yearly'
					},
					{
					    boxLabel: 'Custom',
					    hideLabel: true,
					    checked: false,
					    name: 'repeatconf',
					    inputValue: 'custom',
					    id: 'custom',
					    listeners: {
						check: function(cb, value) {
						    if (value) {
							Ext.getCmp('rnum').enable();
							Ext.getCmp('rCmb').enable();
							Ext.getCmp("rnum").allowBlank = false;
							Ext.getCmp("rCmb").allowBlank = false;
						    } else {
							Ext.getCmp('rnum').disable();
							Ext.getCmp('rCmb').disable();
							Ext.getCmp('rnum').setValue('');
							Ext.getCmp('rCmb').reset();
							Ext.getCmp("rnum").allowBlank = true;
							Ext.getCmp("rCmb").allowBlank = true;
						    }
						}
					    }
					},
					{
					    xtype: 'container',
					    width: 235,
					    layout: 'column',
					    items: [
						{
						    columnWidth: .11,
						    xtype: 'numberfield',
						    id: 'rnum',
						    disabled: true,
						    emptyText: '',
						    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '3'},
						    maxLength: 3,
						    maskRe: /^\d{1,2}$/,
						    regex: /^(1?[1-9]?[0-9]|[0-2][0-9][0-9]|3[0-5][0-9]|36[0-5])$/,
						    regexText:'Only numbers allowed from 1 to 365'
						},
						{
						    columnWidth: .05,
						    xtype: 'label',
						    html: '&nbsp;'
						},
						{
						    columnWidth: .4,
						    xtype: 'combo',
						    id: 'rCmb',
						    mode: 'local',
						    triggerAction: 'all',
						    editable: false,
						    store: rDS,
						    displayField: 'display',
						    valueField: 'value',
						    disabled: true
						}
					    ]
					}
				    ]
				}
			    ]
			},
			{
			    columnWidth: .6,
			    xtype: 'fieldset',
			    title: 'Job Parameters',
			    autoHeight: true,
			    layout: 'form',
			    items: [
				{
				    xtype: 'fieldset',
				    checkboxToggle: true,
				    id: 'svrjob',
				    checkboxName:'svrbox',
				    title: 'Server',
				    autoHeight: true,
				    defaultType: 'textfield',
				    collapsed: true,
				    listeners: {
					expand: function() {
					    if (svrArr.length == 0) {
						Ext.getCmp('svrCmb').reset();
						Ext.getCmp('ambjob').collapse(true);
						Ext.getCmp('modjob').collapse(true);
						Ext.getCmp('usrjob').collapse(true);
					    }
					    Ext.getCmp('ambjob').disable();
					    Ext.getCmp('modjob').disable();
					    Ext.getCmp("svrCmb").allowBlank = false;
					    Ext.getCmp("ambCmb").allowBlank = true;
					    Ext.getCmp("modCmb").allowBlank = true;
					    Ext.getCmp("usrCmb").allowBlank = true;
					},
					collapse: function() {
					    if (svrArr.length == 0) {
						Ext.getCmp("svrCmb").allowBlank = true;
						Ext.getCmp('ambjob').enable();
						Ext.getCmp('modjob').enable();
					    }
					}
				    },
				    items :[
					{
					    allowBlank: true,
					    msgTarget: 'title',
					    id: 'svrCmb',
					    xtype: 'superboxselect',
					    fieldLabel: 'Ambiente',
					    hideLabel: true,
					    resizable: false,
					    height: 30,
					    name: 'svrs[]',
					    anchor:'100%',
					    store: Svr,
					    mode: 'local',
					    displayField: 'display',
					    displayFieldTpl: '{display}',
					    valueField: 'id',
					    navigateItemsWithTab: false,
					    listeners: {
						additem: function() {
						    if (svrArr.length == 0) {
							Ext.getCmp('modjob').collapse(true);
							Ext.getCmp('usrjob').collapse(true);
						    }
						},
						removeitem: function() {
						    if (svrArr.length == 0) {
							Ext.getCmp('modjob').collapse(true);
							Ext.getCmp('usrjob').collapse(true);
						    }
						},
						clear: function() {
						    if (svrArr.length == 0) {
							Ext.getCmp('modjob').collapse(true);
							Ext.getCmp('usrjob').collapse(true);
						    }
						},
					    }
					}
				    ]
				},
				{
				    xtype: 'fieldset',
				    checkboxToggle: true,
				    id: 'ambjob',
				    checkboxName:'ambbox',
				    title: 'Ambiente',
				    autoHeight: true,
				    defaultType: 'textfield',
				    collapsed: true,
				    listeners: {
					expand: function() {
					    if (ambArr.length == 0) {
						Ext.getCmp('ambCmb').reset();
						Ext.getCmp('svrjob').collapse(true);
						Ext.getCmp('modjob').collapse(true);
						Ext.getCmp('usrjob').collapse(true);
					    }
					    Ext.getCmp('svrjob').disable();
					    Ext.getCmp("svrCmb").allowBlank = true;
					    Ext.getCmp("ambCmb").allowBlank = false;
					    Ext.getCmp("modCmb").allowBlank = true;
					    Ext.getCmp("usrCmb").allowBlank = true;
					},
					collapse: function() {
					    if (ambArr.length == 0) {
						Ext.getCmp("ambCmb").allowBlank = true;
						Ext.getCmp('svrjob').enable();
					    }
					}
				    },
				    items :[
					{
					    allowBlank: true,
					    msgTarget: 'title',
					    id: 'ambCmb',
					    xtype: 'superboxselect',
					    fieldLabel: 'Ambiente',
					    hideLabel: true,
					    resizable: false,
					    height: 30,
					    name: 'ambs[]',
					    anchor:'100%',
					    store: Ambiente,
					    mode: 'local',
					    displayField: 'display',
					    displayFieldTpl: '{display}',
					    valueField: 'id',
					    navigateItemsWithTab: false,
					    listeners: {
						additem: function() {
						    if (ambArr.length == 0) {
							Ext.getCmp('modjob').collapse(true);
							Ext.getCmp('usrjob').collapse(true);
						    }
						},
						removeitem: function() {
						    if (ambArr.length == 0) {
							Ext.getCmp('modjob').collapse(true);
							Ext.getCmp('usrjob').collapse(true);
						    }
						},
						clear: function() {
						    if (ambArr.length == 0) {
							Ext.getCmp('modjob').collapse(true);
							Ext.getCmp('usrjob').collapse(true);
						    }
						}
					    }
					}
				    ]
				},
				{
				    xtype: 'fieldset',
				    checkboxToggle: true,
				    id: 'modjob',
				    checkboxName:'modbox',
				    title: 'Model',
				    autoHeight: true,
				    defaultType: 'textfield',
				    collapsed: true,
				    listeners: {
					expand: function() {
					    if (modArr.length == 0) {
						Ext.getCmp("modCmb").allowBlank = false;
						Ext.getCmp('modCmb').reset();
					    }
					},
					collapse: function() {
					    if (modArr.length == 0) {
						Ext.getCmp("modCmb").allowBlank = true;
					    }
					}
				    },
				    items :[
					{
					    allowBlank: true,
					    msgTarget: 'title',
					    id: 'modCmb',
					    xtype: 'superboxselect',
					    autoScroll: true,
					    fieldLabel: 'Model',
					    hideLabel: true,
					    resizable: false,
					    name: 'mods[]',
					    anchor:'100%',
					    store: Model,
					    mode: 'local',
					    displayField: 'display',
					    displayFieldTpl: '{display}',
					    valueField: 'id',
					    navigateItemsWithTab: false
					}
				    ]
				},
				{
				    xtype: 'fieldset',
				    checkboxToggle: true,
				    id: 'usrjob',
				    checkboxName:'usrbox',
				    title: 'Users',
				    autoHeight: true,
				    defaultType: 'textfield',
				    collapsed: true,
				    layout: 'column',
				    listeners: {
					expand: function() {
					    Ext.getCmp("usrCmb").allowBlank = false;
					    Ext.getCmp('usrCmb').reset();
					    Users.baseParams = {ServerList:Ext.getCmp('svrCmb').getValue(),AmbienteList:Ext.getCmp('ambCmb').getValue()};
					    Users.load();
					    Users.on('load', function() {
						if (usrArr.length > 0) {
						    Ext.getCmp('usrCmb').setValue(usrArr);
						    Ext.getCmp('usr'+usrExArr).setValue(true);
						    usrArr = [];
						}
					    })
					},
					collapse: function() {
					    Ext.getCmp("usrCmb").allowBlank = true;
					}
				    },
				    items :[
					{
					    columnWidth: .3,
					    xtype: 'radio',
					    boxLabel: 'These users',
					    hideLabel: true,
					    checked: true,
					    name: 'exUsr',
					    inputValue: '0',
					    id: 'usr0'
					},
					{
					    columnWidth: .7,
					    xtype: 'radio',
					    boxLabel: 'Excepet these users',
					    hideLabel: true,
					    checked: false,
					    name: 'exUsr',
					    inputValue: '1',
					    id: 'usr1'
					},
					{
					    columnWidth: 1,
					    allowBlank: true,
					    msgTarget: 'title',
					    id: 'usrCmb',
					    xtype: 'superboxselect',
					    fieldLabel: 'Users',
					    hideLabel: true,
					    resizable: false,
					    name: 'usrs[]',
					    anchor:'100%',
					    store: Users,
					    mode: 'local',
					    displayField: 'display',
					    displayFieldTpl: '{display}',
					    valueField: 'display',
					    navigateItemsWithTab: false
					}
				    ]
				}
			    ]
			}
		    ],
		    listeners: {
			afterlayout: function() {
			    if (!newJob && svrArr.length > 0) {
				Ext.getCmp('svrjob').expand();
				Ext.getCmp('svrCmb').setValue(svrArr);
				svrArr = [];
			    }
			    if (!newJob && ambArr.length > 0) {
				Ext.getCmp('ambjob').expand();
				Ext.getCmp('ambCmb').setValue(ambArr);
				ambArr = [];
			    }
			    if (!newJob && modArr.length > 0) {
				Ext.getCmp('modjob').expand();
				Ext.getCmp('modCmb').setValue(modArr);
				modArr = [];
			    }
			    if (!newJob && usrArr.length > 0)
				Ext.getCmp('usrjob').expand();
			    if (!newJob) {
				var selectedRow = Ext.getCmp('schedGrid').getSelectionModel().getSelectedIndex();
				var rData = Ext.getCmp('schedGrid').getStore().getAt(selectedRow);
				Ext.getCmp('jname').setValue(rData.get('jobname'));
				Ext.getCmp('dtexec').setValue(rData.get('dateExec'));
				Ext.getCmp(rData.get('rType')).setValue(true);
				Ext.getCmp('njobid').setValue(rData.get('id'));
				if (rData.get('rType') == "custom") {
				    Ext.getCmp('rnum').setValue(rData.get('rInt'));
				    Ext.getCmp('rCmb').setValue(rData.get('rCType'));
				}
				Ext.getCmp('rnd'+rData.get('rndPwd')).setValue(true);
				if (rData.get('rndPwd') == 0)
				    Ext.getCmp('strrndpwd').setValue(rData.get('strPwd'));
				    if (rData.get('enable') == 0)
					Ext.getCmp('disjob').setText('Enable Job');
				
			    }
			}
		    }
		}
	    ],
	    buttons: [
		{
		    text: 'Save',
		    id: 'savejob',
		    disabled: false,
		    handler: function(){
			if (Ext.getCmp('svrjob').collapsed && Ext.getCmp('ambjob').collapsed && Ext.getCmp('modjob').collapsed && Ext.getCmp('usrjob').collapsed) {
			    Ext.Msg.show({
				title: 'Missing parameters',
				msg: 'You must set at least one job parameter!',
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR
			    })
			} else {
			    if(configJob.getForm().isValid()){
				if (Ext.getCmp('njobid').getValue() == '')
				    var urlSubmit = 'writeJobs.php';
				else
				    var urlSubmit = 'writeJobs.php?jobId='+Ext.getCmp('njobid').getValue();
				configJob.getForm().submit({
				    url: './app/'+urlSubmit,
				    method: 'GET',
				    success: function(formPanel, action) {
					var data = Ext.decode(action.response.responseText);
					Ext.getCmp('njobid').setValue(data.value);
				    }
				})
				Ext.Msg.show({
				    title: 'Status',
				    msg: 'Job saved!<br>Do you want to continue editing?',
				    buttons: Ext.Msg.YESNO,
				    icon: Ext.MessageBox.QUESTION,
				    fn: function(sResp){
					if (sResp == "no")
					    configJobWindow.close();
					else
					    Ext.getCmp('disjob').enable();
				    }
				})
			    }
			}
		    }
		},
		{
		    text: 'Close',
		    id: 'canceljob',
		    disabled: false,
		    handler: function() {
			configJobWindow.close();
		    }
		},
		{
		    text: 'Disable Job',
		    id: 'disjob',
		    disabled: false,
		    handler: function() {
			var id = Ext.getCmp('njobid').getValue();
			if (this.text == "Disable Job") {
			    this.setText('Enable Job');
			    var en = 0;
			    Ext.ux.Toast.msg('Status', 'Job has been disabled');
			    Ext.Ajax.request({
				url:'./app/deleteJobs.php?action=enable&enable='+en+'&jobID='+id,
				method : 'GET'
			    })
			} else {
			    var DtEmpty = false;
			    if (Ext.getCmp('dtexec').getValue() != '') {
				var curDt = new Date().format('Y-m-d');
				var curDtTm = Date.parse(curDt) / 1000;
				var recDt = Ext.getCmp('dtexec').getValue().format('Y-m-d');
				var recDtTm = Date.parse(recDt) / 1000;
			    } else {
				var DtEmpty = true;
			    }
			    if (recDtTm < curDtTm || DtEmpty) {
				Ext.Msg.show({
				    title: 'Cannot enable',
				    msg: 'Execution date MUST be equal or greater than <b>'+new Date().format('d/m/Y')+'</b><br>You can enable this job after set a new date',
				    buttons: Ext.MessageBox.OK,
				    icon: Ext.MessageBox.ERROR
				})
				this.disable();
			    } else {
				this.setText('Disable Job');
				var en = 1;
				Ext.getCmp('savejob').handler.call(Ext.getCmp('savejob').scope);
				Ext.ux.Toast.msg('Status', 'Job has been enabled');
				Ext.Ajax.request({
				    url:'./app/deleteJobs.php?action=enable&enable='+en+'&jobID='+id,
				    method : 'GET'
				})
			    }
			}
		    },
		    listeners: {
			render: function() {
			    if (newJob)
				this.disable();
			}
		    }
		},
		{
		    xtype: 'textfield',
		    id: 'njobid',
		    hidden: true
		}
	    ]
	});
	var configJobWindow = new Ext.Window({
	    id: 'schedconfwin',
	    title: 'Job Config',
	    closable: true,
	    border: true,
	    plain: true,
	    layout: 'fit',
	    modal: true,
	    draggable: true,
	    frame: true,
	    resizable: false,
	    constrain: true,
	    deferredRender: true,
	    items: [configJob],
	    listeners: {
		close: function() {
		    Jobs.reload();
		},
	    }
	})
	configJobWindow.show();
    }
    
    function formatDate(r){ return r ? r.dateFormat('d/m/Y') : '-'; }
    function EnDisBtn() {
	if (!Ext.getCmp('schedGrid').getSelectionModel().hasSelection()) {
	    Ext.getCmp('rmSched').disable();
	    Ext.getCmp('editSched').disable();
	} else {
	    Ext.getCmp('rmSched').enable();
	    Ext.getCmp('editSched').enable();
	}
    }
    function chkStatus(r) {
	switch(r) {
	    case 0:
		var img = '<img src="images/green.png" width="14" height="14" Ext: qtip="Status [Success]">';
		break;
	    case 1:
		var img = '<img src="images/red.png" width="14" height="14" Ext: qtip="Status [Completed with errors]">';
		break;
	    case 2:
		var img = '<img src="images/loading_icon.gif" width="14" height="14" Ext: qtip="Status [Running]">';
		break;
	    case 99:
		var img = '<img src="images/yellow.png" width="14" height="14" Ext: qtip="Status [Waiting first run]">';
		break;
	}
	return img;
    }
    function chkEnable(r) {
	switch(r) {
	    case 0:
		var img = '<img src="images/icon_disabled.gif" width="14" height="14" Ext: qtip="Disabled">';
		break;
	    case 1:
		var img = '<img src="images/icon_enabled.gif" width="14" height="14" Ext: qtip="Enabled">';
		break;
	}
	return img;
    }
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: id
    })
    
    var refreshTask = {
	run: function() {
	    Jobs.load();
	},
	interval: 60000
    }
    
    Scheduler.superclass.constructor.call(this, {
	id: 'schedPanel',
	//title: 'Configured Jobs',
	layout: 'fit',
	width: 500,
	height: 315,
	items: [
	    {
		xtype: 'grid',
		id: 'schedGrid',
		store: Jobs,
		selModel: ChkBx,
		columns: [
		    ChkBx,
		    {id: 'id', header: 'Job ID', width: 45, menuDisabled: true, dataIndex: 'id'},
		    {id: 'jobname', header: 'Job Name', width: 160, menuDisabled: true, dataIndex: 'jobname'},
		    {id: 'schedDate', header: 'Schedule Date', width: 105, menuDisabled: true, dataIndex: 'dateExec', renderer: formatDate},
		    {id: 'nextRun', header: 'Next Run', width: 105, menuDisabled: true, dataIndex: 'nextRun', renderer: formatDate},
		    {id: 'status', header: '', width: 25, menuDisabled: true, dataIndex: 'status', align: 'center', renderer: chkStatus},
		    {id: 'enable', header: '', width: 25, menuDisabled: true, dataIndex: 'enable', align: 'center', renderer: chkEnable},
		    {id: 'rInt', hidden: true, dataIndex: 'rInt'},
		    {id: 'rType', hidden: true, dataIndex: 'rType'},
		    {id: 'rCType', hidden: true, dataIndex: 'rCType'},
		    {id: 'rndPwd', hidden: true, dataIndex: 'rndPwd'},
		    {id: 'strPwd', hidden: true, dataIndex: 'strPwd'}
		],
		tbar: [
		    {
			id: 'newSched',
			text: 'Add',
			iconCls: 'icon-add',
			handler:function() {
			    opnConfig(1,0);
			}
		    },
		    {
			id: 'rmSched',
			text: 'Remove',
			iconCls: 'icon-remove',
			handler:function() {
			    var selectedRow = Ext.getCmp('schedGrid').getSelectionModel().getSelectedIndex();
			    var rData = Ext.getCmp('schedGrid').getStore().getAt(selectedRow);
			    Ext.Msg.show({
				title: 'Confirm',
				msg: 'Are you sure you want to remove job <b>' + rData.get('jobname') + '</b>?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(sResp) {
				    if (sResp == "yes") {
					Ext.Ajax.request({
					    url:'./app/deleteJobs.php?action=delete&jobID='+rData.get('id'),
					    method: 'GET'
					})
					Ext.ux.Toast.msg('Status', 'Job <b>'+rData.get('jobname')+'</b> has been removed');
					var s = Ext.getCmp('schedGrid').getSelectionModel().getSelections();
					Ext.getCmp('schedGrid').store.remove(s[0]);
				    }
				}
			    })
			}
		    },
		    {
			id: 'editSched',
			text: 'Edit',
			iconCls: 'icon-edit',
			handler:function() {
			    var selectedRow = Ext.getCmp('schedGrid').getSelectionModel().getSelectedIndex();
			    var rData = Ext.getCmp('schedGrid').getStore().getAt(selectedRow);
			    opnConfig(0, rData.get('id'));
			}
		    }
		],
		listeners: {
		    render: function() {
			EnDisBtn();
			Ext.TaskMgr.start(refreshTask);
		    },
		    click: function() {
			EnDisBtn();
			if (Ext.getCmp('schedGrid').getSelectionModel().hasSelection()) {
			    var selectedRow = Ext.getCmp('schedGrid').getSelectionModel().getSelectedIndex();
			    var rData = Ext.getCmp('schedGrid').getStore().getAt(selectedRow);
			    JobDS.baseParams = {action:'all',jobID:rData.get('id')};
			    JobDS.load();
			}
		    }
		}
	    }
	]
    })
}
Ext.extend(Scheduler, Ext.Panel);