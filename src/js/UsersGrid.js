UsersGrid = function(hid, host){
    var UsersProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryUsers.php',
                create : './app/addUsers.php?svr='+hid,
                update: './app/updateUsers.php',
                destroy: './app/deleteUsers.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Usersi = new Ext.data.Record.create([
        {name: 'id', type: 'int', mapping: 'id'},
	    {name: 'adm', type: 'int', mapping: 'adm'},
        {name: 'type', type: 'int', mapping: 'type'},
	    {name: 'os', type: 'int', mapping: 'os'},
	    {name: 'owner', type: 'int', mapping: 'grp'},
	    {name: 'app', type: 'string', mapping: 'app'},
	    {name: 'user', type: 'string', mapping: 'user'},
	    {name: 'chg', type: 'int', mapping: 'chg'},
	    {name: 'passwd', type: 'string', mapping: 'passwd'},
	    {name: 'acesso', type: 'string', mapping: 'acesso'},
	    {name: 'icon', type: 'string', mapping: 'icon'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Users'
    },
    Usersi);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var UsersDS = new Ext.data.Store({
            id: 'UsersDS',
            proxy: UsersProxy,
            reader: reader,
            writer: writer,
            autoSave: false,
	    baseParams: {svr:hid,adm:document.getElementById('admin').value}
    });
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var UsersEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    UsersEditor.on({
	    afteredit: function() {
		    Ext.getCmp('saveusrbtn').enable();
	    }
    })
    
    var SSH = new Ext.ux.grid.RowActions({
	header:'',
	align: 'center',
	width: 35,
	autoWidth:false,
	keepSelection:true,
	actions:[{
		iconIndex: 'icon',
		align: 'center'
		//tooltip: ''
       }]
    });
    SSH.on({
	action:function(grid, record, action, row) {
	    if (action == 'icon-ssh') {
		Ext.Ajax.request({
			url:'./app/startSSH.php',
			params : {ip:host,user:record.get('user'),passwd:record.get('passwd')},
			method : 'POST',
			success: function(response) {
			    var tb = Ext.getCmp('ntoolbar');
			    //if (!tb.items.length)
			    Ext.getCmp('UsersWin').destroy();
			    var portNumber = Ext.decode(response.responseText);
			    var p = portNumber.value;
			    var Terminal = new Ext.Window({
				    title: record.get('user') + '@' + host,
				    closable:true,
				    width:750,
				    height:500,
				    border:true,
				    plain:true,
				    layout: 'fit',
				    modal: false,
				    draggable: true,
				    frame: true,
				    resizable: true,
				    maximizable: true,
				    minimizable: true,
				    constrain: true,
				    html: '<iframe width=100% bgcolor=white src=http://' + window.location.host + '/term/' + p + ' style=height:100%;border:0></iframe>',
				    listeners: {
					close: function(){
					    Ext.Ajax.request({
						url:'./app/stopSSH.php',
						params : {p:p},
						method : 'POST'
					    });
					    var t = tb.items.get(host+'_'+p);
					    tb.remove(t);
					    tb.doLayout();
					},
					minimize: function() {
					    this.hide();
					    Ext.getCmp(host+'_'+p).toggle(false);
					}
				    }
			    });
			    Terminal.show(this);
			    tb.add({id: host+'_'+p, text: record.get('user')+'@'+host, enableToggle: true, pressed: true, iconCls: 'icon-ssh', handler: function() { if(this.pressed === false) Terminal.hide(); else Terminal.show(); } });
			    tb.doLayout();
			}
		});
	    } else {
		if (record.get('acesso').substring(0,4) == 'http'){
		    window.open(record.get('acesso'));
		} else {
		    Ext.ux.Toast.msg('Access Fail', record.get('acesso') + ' is not a link');
		}
	    }
	}
    });
    
    var UserType = new Ext.data.Store({
	    id: 'UserType',
	    sortInfo:{field: 'display', direction: "ASC"},
	    proxy: new Ext.data.HttpProxy({
		    url: './app/queryUserType.php',
		    method: 'GET'
	    }),
	    reader: new Ext.data.JsonReader({  
		    root: 'UserType'
	    },
	    [
		    {name: 'type', type: 'int', mapping: 'id'},
		    {name: 'tipo', type: 'int', mapping: 'tipo'},
		    {name: 'display', type: 'string', mapping: 'display'}
	    ])
    });
    
    UserType.load();
    
    var xCombo = new Ext.form.ComboBox({
	    allowBlank: false,
	    store: 'UserType',
	    displayField: 'display',
	    valueField: 'type',
	    keyField: 'tipo',
	    editable: false,
	    listeners: {
		select: function(combo, record, index) {
		    var g = Ext.getCmp('UsersGrid');
		    var sm = g.getSelectionModel().getSelected();
		    sm.set('os',record.get(this.keyField));
		    if (record.get(this.keyField) == 1) {
			Ext.getCmp('eApp').disable();
			Ext.getCmp('eApp').setValue('');
			Ext.getCmp('eAcesso').disable();
			Ext.getCmp('eAcesso').setValue('');
		    } else {
			Ext.getCmp('eApp').enable();
			Ext.getCmp('eAcesso').enable();
		    }
		}
	    }
    });
    
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
		    {name: 'owner', type: 'int', mapping: 'id'},
		    {name: 'modulo', type: 'string', mapping: 'modulo'}
	    ])
    });
    
    Modul.load();
    
    var tpl = new Ext.Template(
	'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',
	'<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}">{value}</div>',
	'</td>'
    )
    
    var yCombo = new Ext.form.ComboBox({
	    allowBlank: false,
	    store: Modul,
	    displayField: 'modulo',
	    valueField: 'owner',
	    triggerAction: 'all',
	    editable: false
    });
    
    function retNull(r) { return r ? r : '-'; }
    function fnSelect(objId) {
	fnDeSelect();
	    if (document.selection) {
	    var range = document.body.createTextRange();
	    range.moveToElementText(document.getElementById(objId));
	    range.select();
	}
	else if (window.getSelection) {
	    var range = document.createRange();
	    range.selectNode(document.getElementById(objId));
	    window.getSelection().addRange(range);
	}
	function fnDeSelect() {
	    if (document.selection) document.selection.empty(); 
	    else if (window.getSelection)
	    window.getSelection().removeAllRanges();
	}
    }
    
    UsersGrid.superclass.constructor.call(this, {
	viewConfig: {
	    templates: {
		cell: tpl
	    }
	},
	id: 'UsersGrid',
	margins: '0 0 0 0',
	layout: 'fit',
        store: UsersDS,
	title: 'Users List',
        stateId: 'UsersGrid',
        selModel: ChkBx,
        columns: [
                ChkBx,
		{id: 'adm', header: "Adm", width: 35, sortable: false, menuDisabled: true, dataIndex: 'adm', xtype: 'booleancolumn', trueText: '<img src="images/hash.png" width="18" height="18" Ext: qtip="Admin Only" />', falseText: '<img src="images/silk/money_dollar.png" width="16" height="16" Ext: qtip="All users visible" />', editor: { xtype: 'checkbox' }},
		{id: 'chg', header: "Pwd", width: 35, sortable: false, menuDisabled: true, dataIndex: 'chg', xtype: 'booleancolumn', trueText: '<img src="images/silk/lock.png" width="16" height="16" Ext: qtip="Password auto change" />', falseText: '<img src="images/silk/lock_open.png" width="16" height="16" Ext: qtip="Password manual change" />', editor: { xtype: 'checkbox' }},
        {id: 'type', header: "Type", width: 70, sortable: true, menuDisabled: true, dataIndex: 'type', editor: xCombo, renderer: function (value) { var record = xCombo.findRecord(xCombo.valueField, value); return record ? record.get(xCombo.displayField) : xCombo.valueNotFoundText; }},
		{id: 'os', hidden: true, dataIndex: 'os'},
		{id: 'user', header: "Username", width: 80, sortable: true, menuDisabled: true, dataIndex: 'user', editor: { xtype: 'textfield', allowBlank: false }},
		{id: 'passwd', header: "Password", width: 80, sortable: false, menuDisabled: true, dataIndex: 'passwd', editor: { xtype: 'textfield', allowBlank: false }, renderer: function(value, p, record) {return "<span class='pwdSel' id=passwd_"+record.get('id')+">"+value+"</span>"; }},
		{id: 'owner', header: "Owner", width: 130, sortable: true, menuDisabled: true, dataIndex: 'owner', editor: yCombo, renderer: function (value) { var record = yCombo.findRecord(yCombo.valueField, value); return record ? record.get(yCombo.displayField) : yCombo.valueNotFoundText; }},
		{id: 'app', header: "Application", width: 100, sortable: false, menuDisabled: true, dataIndex: 'app', editor: { xtype: 'textfield', allowBlank: true, id: 'eApp' }, renderer: retNull },
		{id: 'acesso', header: "Access", sortable: false, menuDisabled: true, dataIndex: 'acesso', editor: { xtype: 'textfield', allowBlank: true, id: 'eAcesso' }, renderer: retNull },
		SSH
        ],
        plugins: [UsersEditor, SSH],
        tbar:[
            {
            id: 'addusrbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
		    if(!Ext.ux.grid.RowActions.prototype.getEditor) Ext.ux.grid.RowActions.prototype.getEditor = Ext.emptyFn;
                    var e = new Usersi({
						adm: '0',
						chg: '0',
            			type: '1',
						os: '1',
						user: 'Username',
						passwd: 'Passwd',
						owner: '1',
						app: '',
						acesso: ''
                    });
		    Ext.getCmp('eAcesso').disable();
		    Ext.getCmp('eApp').disable();
                    UsersEditor.stopEditing();
                    UsersDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    UsersEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeusrbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        UsersEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('saveusrbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                UsersDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editusrbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(g, rowIndex, e){
		    if(!Ext.ux.grid.RowActions.prototype.getEditor) Ext.ux.grid.RowActions.prototype.getEditor = Ext.emptyFn;
                    var s = this.getSelectionModel().getSelections();
                    UsersEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveusrbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                        UsersDS.save();
			setTimeout(function(){UsersDS.reload()}, 250);
			Ext.getCmp('saveusrbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
		if (document.getElementById('admin').value == 0 ) {
		    /*this.getTopToolbar().hide();
		    this.getColumnModel().setHidden(1, true);
		    this.getColumnModel().setHidden(2, true);
			this.getColumnModel().setHidden(10, true);*/
			Ext.getCmp('editusrbtn').disable();
			Ext.getCmp('removeusrbtn').disable();
			Ext.getCmp('saveusrbtn').disable();
		} else {
		    Ext.getCmp('editusrbtn').disable();
		    Ext.getCmp('removeusrbtn').disable();
		}
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editusrbtn').disable();
                    Ext.getCmp('removeusrbtn').disable();
                } else {
                    Ext.getCmp('editusrbtn').enable();
                    Ext.getCmp('removeusrbtn').enable();
                }
            },
	    cellclick: function(grid, rowIndex, colIndex, e) {
		if (colIndex === 6) {
		    var record = grid.store.getAt(rowIndex);
		    var id = record.get('id');
		    fnSelect('passwd_'+id);
		}
	    }
        },
	autoExpandColumn: 'acesso',
        height:465,
        width:820
	//x: 0,
	//y: 130
    });
    setTimeout(function(){UsersDS.load()}, 150);
}
Ext.extend(UsersGrid, Ext.grid.GridPanel);