Ext.onReady(function () {
	Ext.QuickTips.init();
	//Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	Ext.Ajax.timeout = 120000;
	AjaxRowExpander = function(config, previewURL){
		AjaxRowExpander.superclass.constructor.call(this, config, previewURL);
		this.previewURL = previewURL;
		this.enableCaching = true;
	}
	Ext.extend(AjaxRowExpander, Ext.grid.RowExpander, {
		getBodyContent: function(record, index){
			var param = record.get('host');
			Ext.Ajax.request({
				url: this.previewURL + param,
				disableCaching: true,
				success: function(response, options) {
					Ext.getDom("inv-" + param).innerHTML = response.responseText;
				},
				failure: function(error) {
					alert(DWRUtil.toDescriptiveString(error, 3));
				},
				objId: record.id
			});
			var body = '<div id="inv-'+param+'" class="x-selectable"><img src="images/loading.gif"></div>';
			return body;
		},
		beforeExpand : function(record, body, rowIndex){
			if(this.fireEvent('beforeexpand', this ,record, body, rowIndex) !== false) {
				body.innerHTML = this.getBodyContent(record, rowIndex);
				return true;
			} else {
				return false;
			}
		}
	});
	var expander = new AjaxRowExpander({}, './app/viewInv.php?host=');
	
	var proxy = new Ext.data.HttpProxy({
		api: {
			read : './app/queryServer.php?adm=' + document.getElementById('admin').value,
			create : './app/addServer.php',
			update: './app/updateServer.php',
			destroy: './app/deleteServer.php'
		},
		actionMethods: {
			create: 'POST',
		    read: 'POST',
		    update: 'POST',
		    destroy: 'POST'
		}
	})
	
	var Server = Ext.data.Record.create([
		{name: 'id', type: 'int', mapping: 'id'},
		{name: 'host', type: 'string', mapping: 'host'},
		{name: 'ip', type: 'string', mapping: 'ip'},
		{name: 'status', type: 'string', mapping: 'status'},
		{name: 'sid', type: 'int', mapping: 'sid'},
		{name: 'projid', type: 'int', mapping: 'projid'},
		{name: 'clid', type: 'int', mapping: 'clid'},		
		{name: 'mid', type: 'int', mapping: 'mid'},
		{name: 'oid', type: 'int', mapping: 'oid'},
		{name: 'tid', type: 'int', mapping: 'tid'},
		{name: 'os', type: 'string', mapping: 'os'},
		{name: 'modulo', type: 'string', mapping: 'modulo'},
		{name: 'tipo', type: 'string', mapping: 'tipo'},
		{name: 'aid', type: 'int', mapping: 'aid'},
		{name: 'ambiente', type: 'string', mapping: 'ambiente'},
		{name: 'serial', type: 'string', mapping: 'serial'},
		{name: 'local', type: 'string', mapping: 'local'},
		{name: 'projeto', type: 'string', mapping: 'projeto'},
		{name: 'cliente', type: 'string', mapping: 'cliente'}
	])
	
	var reader = new Ext.data.JsonReader({
		root: 'Hosts',
		totalProperty: 'Count'
	},
	Server)
	
	var writer = new Ext.data.JsonWriter({
		encode: false,
		writeAllFields: true
	})
	
	var store = new Ext.data.Store({
		id: 'store',
		proxy: proxy,
		reader: reader,
		writer: writer,
		autoSave: false,
		remoteSort: true,
		baseParams: {filter:'NO_FILTER',start:'0',limit:'30'},
		listeners: {
			load: function(store, records, successful) {
				if (store.reader.jsonData.success != "1")
					window.location = 'index.php';
			}
		}
	})
	
	var Modul = new Ext.data.Store({
		id: 'Modul',
		sortInfo:{field: 'modulo', direction: "ASC"},
		proxy: new Ext.data.HttpProxy({
			url: './app/queryMod.php',
			method: 'GET'
		}),
		reader: new Ext.data.JsonReader({  
			root: 'Modul'
		},
		[
			{name: 'mid', type: 'int', mapping: 'id'},
			{name: 'modulo', type: 'string', mapping: 'modulo'}
		])
	})
	
	var OS = new Ext.data.Store({
		id: 'OS',
		sortInfo:{field: 'os', direction: "ASC"},
		proxy: new Ext.data.HttpProxy({
			url: './app/queryOS.php',
			method: 'GET'
		}),
		reader: new Ext.data.JsonReader({  
			root: 'OS'
		},
		[
			{name: 'oid', type: 'int', mapping: 'id'},
			{name: 'os', type: 'string', mapping: 'os'}
		])
	})
	
	var Ambiente = new Ext.data.Store({
		id: 'Ambiente',
		sortInfo:{field: 'ambiente', direction: "ASC"},
		proxy: new Ext.data.HttpProxy({
			url: './app/queryAmb.php',
			method: 'GET'
		}),
		reader: new Ext.data.JsonReader({  
			root: 'Ambiente'
		},
		[
			{name: 'aid', type: 'int', mapping: 'id'},
			{name: 'ambiente', type: 'string', mapping: 'ambiente'}
		])
	})

	var Proj = new Ext.data.Store({
		id: 'Proj',
		sortInfo:{field: 'projeto', direction: "ASC"},
		proxy: new Ext.data.HttpProxy({
			url: './app/queryProj.php',
			method: 'Proj'
		}),
		reader: new Ext.data.JsonReader({  
			root: 'Proj'
		},
		[
			{name: 'projid', type: 'int', mapping: 'id'},
			{name: 'projeto', type: 'string', mapping: 'projeto'}
		])
	})
	
	var Client = new Ext.data.Store({
		id: 'Client',
		sortInfo:{field: 'cliente', direction: "ASC"},
		proxy: new Ext.data.HttpProxy({
			url: './app/queryClient.php',
			method: 'GET'
		}),
		reader: new Ext.data.JsonReader({  
			root: 'Client'
		},
		[
			{name: 'clid', type: 'int', mapping: 'id'},
			{name: 'cliente', type: 'string', mapping: 'cliente'}
		])
	})
	
	var Stat = new Ext.data.Store({
		id: 'Stat',
		sortInfo:{field: 'status', direction: "ASC"},
		proxy: new Ext.data.HttpProxy({
			url: './app/queryStat.php',
			method: 'GET'
		}),
		reader: new Ext.data.JsonReader({  
			root: 'Stat'
		},
		[
			{name: 'sid', type: 'int', mapping: 'id'},
			{name: 'status', type: 'string', mapping: 'status'}
		])
	})
	
	var Tipo = new Ext.data.Store({
		id: 'Tipo',
		sortInfo:{field: 'tipo', direction: "ASC"},
		proxy: new Ext.data.HttpProxy({
			url: './app/queryTipo.php',
			method: 'GET'
		}),
		reader: new Ext.data.JsonReader({  
			root: 'Tipo'
		},
		[
			{name: 'tid', type: 'int', mapping: 'id'},
			{name: 'tipo', type: 'string', mapping: 'tipo'}
		])
	})
	
    var SWInv = new Ext.data.GroupingStore({
	    id: 'SWInv',
	    groupField: 'host',
	    sortInfo:{field: 'host', direction: "DEC"},
	    proxy: new Ext.data.HttpProxy({
			url: './app/querySWInv.php',
			method: 'GET'
		}),
	    reader: new Ext.data.JsonReader({
			root: 'SWInv',
			totalProperty: 'Count'
		},
		[
			{name: 'host', type: 'string', mapping: 'host'},
			{name: 'swname', type: 'string', mapping: 'swname'}
		]),
	    remoteSort: true,
	    baseParams: {filter:'',start:'0',limit:'100'}
    })
	
	var prCombo = new Ext.form.ComboBox({
		allowBlank: false,
		store: Proj,
		displayField: 'projeto',
		valueField: 'projid',
		triggerAction: 'all',
	    editable: false
	})

	var clCombo = new Ext.form.ComboBox({
		allowBlank: false,
		store: Client,
		displayField: 'cliente',
		valueField: 'clid',
		triggerAction: 'all',
	    editable: false
	})

	var sCombo = new Ext.form.ComboBox({
		allowBlank: false,
		store: Stat,
		displayField: 'status',
		valueField: 'sid',
		triggerAction: 'all',
	    editable: false
	})
	
	var gCombo = new Ext.form.ComboBox({
		allowBlank: false,
		store: Modul,
		displayField: 'modulo',
		valueField: 'mid',
		triggerAction: 'all',
		editable: false
	})
	
	var eCombo = new Ext.form.ComboBox({
		allowBlank: false,
		store: Ambiente,
		displayField: 'ambiente',
		valueField: 'aid',
		triggerAction: 'all',
		editable: false
	})
	
	var oCombo = new Ext.form.ComboBox({
		allowBlank: false,
		store: OS,
		displayField: 'os',
		valueField: 'oid',
		triggerAction: 'all',
	    editable: false
	})
	
	var tCombo = new Ext.form.ComboBox({
		allowBlank: false,
		store: Tipo,
		displayField: 'tipo',
		valueField: 'tid',
		triggerAction: 'all',
	    editable: false
	})
	
	var f = new Ext.form.Checkbox({disabled: true, checked: true});
	
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
		dataIndex: 'id',
		editor: f
    })

	var editor = new Ext.ux.grid.RowEditor({
		saveText: 'OK',
		clicksToEdit: 0,
		listeners: {
			afteredit: function() {
				Ext.getCmp('savebtn').enable();
			}
		}
	})
	
	//Country.load();
	Proj.load();
	Client.load();
	Stat.load();
	Modul.load();
	Ambiente.load();
	OS.load();
	Tipo.load();
	
	Ext.grid.RowSelectionModel.override ({
		getSelectedIndex : function(){
			return this.grid.store.indexOf( this.selections.itemAt(0) );
			// para usar:
			// var x = grid.getSelectionModel().getSelectedIndex();
		}
	})
	
	var gsearch = new Ext.ux.grid.Search({
		position: 'top',
		align: 'right',
		width: 200,
		iconCls:'icon-search',
		mode:'remote',
		disableIndexes:['id'],
		minChars:2,
		autoFocus:true,
		menuStyle:'checkbox',
		searchText: '',
		onTriggerSearch:function() {
			store.load();
		}
	})
	
	function showIP(hid, host){
		var IPWindow = new Ext.Window({
			id: 'IPWin',
			title: 'IP Address list of ' + host + ' server',
			closable:true,
			width: 400,
			height: 320,
			border: true,
			plain: true,
			modal: true,
			draggable: true,
			frame: true,
			resizable: false,
			layout: 'vbox',
			constrain: true,
			items: [new IPGrid(hid, host)]
		})
		IPWindow.show();
	}
	
    var IPs = new Ext.ux.grid.RowActions({
	header: '',
	align: 'center',
	width: 25,
	autoWidth: false,
	keepSelection: true,
	actions:[{
		iconCls: 'icon-ips',
		align: 'center'
		//tooltip: 'IP List'
       }]
    });
	
    IPs.on({
		action:function(grid, record, action, row) {
			if (action == 'icon-ips') {
				showIP(record.get('id'), record.get('host'));
			}
		}
	})
	
    store.on('beforeload', function(myStore){
		var fields = [];
		gsearch.menu.items.each(function(item) {
			if(item.checked) {
				fields.push(item.dataIndex);
			}
		})
		var f = Ext.encode(fields);
		var filter = gsearch.field.getValue();
		if ( filter == '' ) {
			myStore.baseParams = {filter:'NO_FILTER',start:'0',limit:'30'};
		} else {
			myStore.baseParams = {filter:filter,fields:f,start:'0',limit:'30'};
		}
    })
	
	function disableBtn(adm) {
		//this.getTopToolbar().hide(); // Hide ToolBar
		grid.getColumnModel().setHidden(0, false);
		if (adm == 0) {
			//grid.getColumnModel().setHidden(0, true);
			Ext.getCmp('admbtn').hide();
			Ext.getCmp('tbsAdm').hide();
			Ext.getCmp('swinvbtn').show();
			Ext.getCmp('tbsSW').show();
			if (!grid.getSelectionModel().hasSelection()) {
				Ext.getCmp('tbsOpen').hide();
				Ext.getCmp('tbsRemove').hide();
				Ext.getCmp('tbsEdit').hide();
				Ext.getCmp('tbsSave').hide();
				Ext.getCmp('openbtn').hide();
				Ext.getCmp('removebtn').hide();
				Ext.getCmp('addbtn').hide();
				Ext.getCmp('savebtn').hide();
				Ext.getCmp('editbtn').hide();
			} else {
				Ext.getCmp('openbtn').show();
			}
		} else if (adm == 2) {
			Ext.getCmp('admbtn').hide();
			Ext.getCmp('tbsAdm').hide();
			Ext.getCmp('swinvbtn').show();
			Ext.getCmp('tbsSW').show();
			if (!grid.getSelectionModel().hasSelection()) {
				Ext.getCmp('tbsOpen').hide();
				Ext.getCmp('openbtn').hide();
				Ext.getCmp('editbtn').disable();
				Ext.getCmp('removebtn').disable();
			} else {
				Ext.getCmp('openbtn').hide();
				Ext.getCmp('tbsOpen').hide();
				Ext.getCmp('editbtn').enable();
				Ext.getCmp('removebtn').enable();
			}
		} else {
			if (!grid.getSelectionModel().hasSelection()) {
				Ext.getCmp('tbsOpen').hide();
				Ext.getCmp('openbtn').hide();
				Ext.getCmp('editbtn').disable();
				Ext.getCmp('removebtn').disable();
			} else {
				Ext.getCmp('openbtn').hide();
				Ext.getCmp('tbsOpen').hide();
				Ext.getCmp('editbtn').enable();
				Ext.getCmp('removebtn').enable();
			}
		}
	}
	
	var showWin = function(){
		var selRow = grid.getSelectionModel().getSelectedIndex();
		var RowData = grid.getStore().getAt(selRow);
		var UsersWindow = new Ext.Window({
			id: 'UsersWin',
			title: 'Information about ' + RowData.get('host') + ' server',
			closable:true,
			width:835,
			height:500,
			border:true,
			plain:true,
			modal: true,
			draggable: true,
			frame: true,
			resizable: false,
			layout: 'vbox',
			constrain: true,
			items: [new UsersGrid(RowData.get('id'), RowData.get('host'))]
		})
		UsersWindow.show();
	}
	
	var nTB = new Ext.Toolbar({
		id: 'ntoolbar',
		width: 900
	})
	
	var grid = new Ext.grid.GridPanel({
		store: store,
		trackMouseOver: false,
        region:'center',
        margins: '0 5 5 5',
		selModel: ChkBx,
		delay: 200,
		columns: [
			expander,
			ChkBx,
			IPs,
			{id: 'host', header: 'Hostname', align: 'left', width: 150, sortable: true, menuDisabled: true, dataIndex: 'host', editor: { xtype: 'textfield', allowBlank: false }},
			{id: 'ip', header: 'IP Addr', align: 'left', width: 100, sortable: true, menuDisabled: true, dataIndex: 'ip', editor: { xtype: 'textfield', allowBlank: false }},
			{id: 'serial', header: 'Serial #', align: 'left', width: 100, sortable: true, menuDisabled: true, dataIndex: 'serial', editor: { xtype: 'textfield', allowBlank: true }},
			{id: 'os', header: 'OS', align: 'left', width: 80, sortable: true, menuDisabled: true, dataIndex: 'oid', editor: oCombo, renderer: function (value) { var record = oCombo.findRecord(oCombo.valueField, value); return record ? record.get(oCombo.displayField) : oCombo.valueNotFoundText; }},
			{id: 'tipo', header: 'Type', align: 'left', width: 80, sortable: true, menuDisabled: true, dataIndex: 'tid', editor: tCombo, renderer: function (value) { var record = tCombo.findRecord(tCombo.valueField, value); return record ? record.get(tCombo.displayField) : tCombo.valueNotFoundText; }},
			{id: 'ambiente', header: 'Environment', align: 'left', width: 100, sortable: true, menuDisabled: true, dataIndex: 'aid', editor: eCombo, renderer: function (value) { var record = eCombo.findRecord(eCombo.valueField, value); return record ? record.get(eCombo.displayField) : eCombo.valueNotFoundText; }},
			{id: 'modulo', header: 'Module', align: 'left', width: 150, sortable: true, menuDisabled: true, dataIndex: 'mid', editor: gCombo, renderer: function (value) { var record = gCombo.findRecord(gCombo.valueField, value); return record ? record.get(gCombo.displayField) : gCombo.valueNotFoundText; }},
			{id: 'projeto', header: 'Project', align: 'left', width: 100, sortable: true, menuDisabled: true, dataIndex: 'projid', editor: prCombo, renderer: function (value) { var record = prCombo.findRecord(prCombo.valueField, value); return record ? record.get(prCombo.displayField) : prCombo.valueNotFoundText; }},
			{id: 'cliente', header: 'Client', align: 'left', width: 80, sortable: true, menuDisabled: true, dataIndex: 'clid', editor: clCombo, renderer: function (value) { var record = clCombo.findRecord(clCombo.valueField, value); return record ? record.get(clCombo.displayField) : clCombo.valueNotFoundText; }},
			{id: 'local', header: 'Site Location', align: 'left', sortable: true, menuDisabled: true, dataIndex: 'local', editor: { xtype: 'textfield', allowBlank: true }},
			{id: 'status', header: 'Status', align: 'left', width: 80, sortable: true, menuDisabled: true, dataIndex: 'sid', editor: sCombo, renderer: function (value) { var record = sCombo.findRecord(sCombo.valueField, value); return record ? record.get(sCombo.displayField) : sCombo.valueNotFoundText; }}
		],
		autoExpandColumn: 'local',
		loadMask: true,
		stripeRows: false,
		frame: false,
		//height: 650,
		//width: 1300,
		autoHeight: true,
		autoWidth: true,
		title: '<img id="titleIMG" src="images/title.png" width="900" height="50" />',
		stateful: true,
		stateId: 'grid',
		tbar:[
			{
				id: 'addbtn',
				text: 'Add',
				iconCls: 'icon-add',
				handler:function() {
					if(!Ext.ux.grid.RowActions.prototype.getEditor) Ext.ux.grid.RowActions.prototype.getEditor = Ext.emptyFn;
					var e = new Server({
						host: 'Hostname',
						ip: 'xxx.xxx.xxx.xxx',
						serial: 'XXXXX-XX',
						oid: '1',
						tid: '1',
						aid: '1',
						mid: '1',
						projid: '1',
						clid: '1',
						local: 'Site Location',
						sid: '1'
					})
					editor.stopEditing();
					store.insert(0, e);
					grid.getView().refresh();
					grid.getSelectionModel().selectRow(0);
					editor.startEditing(0);
					editor.on({
						canceledit: function() {
							alert('x');
							//grid.store.remove(0);
						}
					})
				},
				scope: this
			},
			{ id: 'tbsRemove', xtype: 'tbseparator'},
			{
				id: 'removebtn',
				text: 'Remove',
				iconCls: 'icon-remove',
				handler: function(){
					var selRow = grid.getSelectionModel().getSelectedIndex();
					var RowData = grid.getStore().getAt(selRow);
					Ext.Msg.show({
						title: 'Confirm',
						msg: 'Are you sure you want to remove ' + RowData.get('host') + '?',
						buttons: Ext.Msg.YESNO,
						icon: Ext.MessageBox.QUESTION,
						fn: function(sResp){
								 if (sResp=="yes"){
									editor.stopEditing();
									var s = grid.getSelectionModel().getSelections();
									Ext.getCmp('savebtn').enable();
									for(var i = 0, r; r = s[i]; i++)
										grid.store.remove(r);
								}
						}
					})
				},
				scope: this
			},
			{ id: 'tbsEdit', xtype: 'tbseparator'},
			{
				id: 'editbtn',
				text: 'Edit',
				iconCls: 'icon-edit',
				handler: function(){
					if(!Ext.ux.grid.RowActions.prototype.getEditor) Ext.ux.grid.RowActions.prototype.getEditor = Ext.emptyFn;
					var s = grid.getSelectionModel().getSelections();
					editor.startEditing(s[0]);
				},
				scope: this
			},
			{ id: 'tbsSave', xtype: 'tbseparator'},
			{
				id: 'savebtn',
				text: 'Save',
				iconCls: 'icon-save',
				disabled: true,
				handler: function(){
					store.save();
					store.reload();
					Ext.getCmp('savebtn').disable();
				},
				scope: this
			},
			{ id: 'tbsOpen', xtype: 'tbseparator'},
			{
				id: 'openbtn',
				text: 'Open',
				iconCls: 'icon-open',
				handler: function(){
					showWin();
				},
				scope: this
			},
			{ id: 'tbsAdm', xtype: 'tbseparator'},
			{
				id: 'admbtn',
				text: 'System Management',
				iconCls: 'icon-admin',
				handler: function(){
					var AdminTabs = new Ext.TabPanel({
						region: 'center',
						margins:'3 3 3 3', 
						activeTab: 0,
						plain: true,
						defaults:{autoScroll:true},
						items:[{
							title: 'Password Audit',
							id: 'tabAudit',
							layout: 'fit',
							items: [new ChgPwdAudit()],
							closable:false
						},{
							title: 'Modules',
							id: 'tab1',
							layout: 'fit',
							items: [new ModulGrid()],
							closable:false
						},{
							title: 'Projects',
							id: 'tab2',
							layout: 'fit',
							items: [new ProjGrid()],
							closable:false
						},{
							title: 'Clients',
							id: 'tab3',
							layout: 'fit',
							items: [new ClientGrid()],
							closable:false
						},{
							title: 'Status',
							id: 'tab4',
							layout: 'fit',
							items: [new StatGrid()],
							closable:false
						},
						{
							title: 'Ambiente',
							id: 'tab5',
							layout: 'fit',
							items: [new AmbienteGrid()],
							closable:false
						},{
							title: 'IP Type',
							id: 'tab6',
							layout: 'fit',
							items: [new IpTypeGrid()],
							closable:false
						},{
							title: 'OS',
							id: 'tab7',
							layout: 'fit',
							items: [new OSGrid()],
							closable:false
						},{
							title: 'User Type',
							id: 'tab8',
							layout: 'fit',
							items: [new UserTypeGrid()],
							closable:false
						},{
							title: 'Application',
							id: 'tab9',
							layout: 'fit',
							items: [new AppGrid()],
							closable:false
						},{
							title: 'Scripts',
							id: 'tab10',
							layout: 'fit',
							deferredRender: false,
							items: [new ScrEditor()],
							closable:false
						}],
						listeners: {
							render: function() {
								if (document.getElementById('admin').value != 1) {
									/*this.hideTabStripItem(Ext.getCmp('tab1'));
									this.hideTabStripItem(Ext.getCmp('tab2'));
									this.setActiveTab(Ext.getCmp('tab1'));*/
								}
							}
						}
					})
					var AdminWindow = new Ext.Window({
						id: 'admWindow',
						title: 'System Management',
						closable:true,
						width:800,
						height:600,
						border:true,
						plain:true,
						layout: 'border',
						modal: true,
						draggable: true,
						frame: true,
						resizable: false,
						constrain: true,
						items: [AdminTabs]
					})
					AdminWindow.show(this);
				},
				scope: this
			},
			{ id: 'tbsSW', xtype: 'tbseparator'},
			{
				id: 'swinvbtn',
				text: 'Software',
				iconCls: 'icon-inv',
				handler: function() {
					var csearch = new Ext.ux.grid.Search({
						position: 'top',
						searchText: '',
						align: 'left',
						width: 150,
						iconCls:'icon-search',
						mode:'remote',
						disableIndexes:[],
						minChars:2,
						autoFocus:false,
						menuStyle:'checkbox',
						onTriggerSearch:function() {
							SWInv.load()
						}
					})
					
					SWInv.on('beforeload', function(myStore) {
						var fields = [];
						csearch.menu.items.each(function(item) {
							if(item.checked) {
								fields.push(item.dataIndex);
							}
						})
						var filter = csearch.field.getValue();
						if ( filter == '' ) {
							myStore.baseParams = {filter:'',start:'0',limit:'100'};
						} else {
							myStore.baseParams = {filter:filter,start:'0',limit:'100'};
						}
					})
					var SWInvWin = new Ext.Window({
						id: 'swinvWin',
						title: 'Software Inventory',
						closable: true,
						width: 640,
						height: 480,
						border: true,
						plain: true,
						layout: 'fit',
						modal: true,
						draggable: true,
						frame: true,
						resizable: false,
						constrain: true,
						items: [
							new Ext.grid.GridPanel({
								title: '',
								store: SWInv,
								loadMask: true,
								trackMouseOver: false,
								id: 'swGrd',
								plugins: [csearch],
								columns: [
									{id: 'host', hidden: false, header: "Server", dataIndex: 'host', menuDisabled: true },
									{id: 'swname', hidden: false, header: "Application", dataIndex: 'swname', menuDisabled: true }
								],
								view: new Ext.grid.GroupingView({
									forceFit: true,
									onLoad: Ext.emptyFn,
									listeners: {
										beforerefresh: function(v) {
											v.scrollTop = v.scroller.dom.scrollTop;
											v.scrollHeight = v.scroller.dom.scrollHeight;
										},
										refresh: function(v) {
											v.scroller.dom.scrollTop = v.scrollTop + (v.scrollTop == 0 ? 0 : v.scroller.dom.scrollHeight - v.scrollHeight);
										}
									},
									groupTextTpl:'{text} ({[values.rs.length]})',
									getRowClass: function(row, index) {
									if ((parseInt(index) % 2) == 0)
										return 'odd-row';
									else
										return '';
									}
								}),
								tbar:[],
								bbar:
								new Ext.PagingToolbar({
									displayInfo: true,
									emptyMsg : 'No Data to display',
									pageSize: 100,
									store: SWInv
								}),
								
								listeners: {
									afterrender: function() {
										Ext.getCmp('swGrd').getColumnModel().setHidden(0, true);
										Ext.getCmp('swGrd').getColumnModel().setHidden(1, false);
										SWInv.sort('host', 'DEC');
										SWInv.groupBy('host', true);
										var tbar = this.getTopToolbar();
										tbar.add('->');
										tbar.add({
											id: 'groupBtn',
											text: 'Server',
											handler: function() {
												if (this.text == 'Server') {
													Ext.getCmp('swGrd').getColumnModel().setHidden(1, true);
													Ext.getCmp('swGrd').getColumnModel().setHidden(0, false);
													SWInv.sort('swname', 'DEC');
													SWInv.groupBy('swname', true);
													this.setText('Application');
												} else {
													Ext.getCmp('swGrd').getColumnModel().setHidden(0, true);
													Ext.getCmp('swGrd').getColumnModel().setHidden(1, false);
													SWInv.sort('host', 'DEC');
													SWInv.groupBy('host', true);
													this.setText('Server');
												}
											}
										})
									}
								}
							})
						]
					})
					SWInvWin.show();
					SWInv.load();
				},
				scope: this
			}			
		],
		bbar: {
			xtype : 'container',
			id: 'cnt',
			layout : {
				type : 'vbox',
				pack : 'start',
				align : 'stretch'
			},
			height : 50,
			defaults : { flex : 1 },
			items : [
				nTB,
				new Ext.PagingToolbar({
					displayInfo: true,
					emptyMsg : 'No Data to display',
					pageSize: 30,
					store: store
				})
			]
		},
		listeners: {
			render: function() {
				disableBtn(document.getElementById('admin').value);
				store.load.defer(200, store);
			},
			rowdblclick: showWin,
			rowClick: function() { disableBtn(document.getElementById('admin').value); }
		},
		plugins: [expander,gsearch,editor,IPs],
		xtype: 'grid'
	})
	grid.render('mypms');
	//setTimeout(function(){store.reload()}, 150);
})
