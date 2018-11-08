/*AdminUserGrid = function(){
    var AdminUserProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryLDAPUser.php',
                create : './app/addLDAPUser.php',
                update: './app/updateLDAPUser.php',
                destroy: './app/deleteLDAPUser.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var AdminUseri = Ext.data.Record.create([
            {name: 'id', type: 'string', mapping: 'id'},
            {name: 'uid', type: 'string', mapping: 'uid'},
	    {name: 'fname', type: 'string', mapping: 'fname'},
	    {name: 'lname', type: 'string', mapping: 'lname'},
	    {name: 'pwd', type: 'string', mapping: 'pwd'},
	    {name: 'opwd', type: 'string', mapping: 'opwd'},
	    {name: 'gid', type: 'int', mapping: 'dpto'},
	    {name: 'adm', type: 'int', mapping: 'adm'},
	    {name: 'cn', type: 'string', mapping: 'cn'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'LDAPUsers'
    },
    AdminUseri);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var AdminUserDS = new Ext.data.Store({
            id: 'AdminUserDS',
            proxy: AdminUserProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    AdminUserDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var AdminUserEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    AdminUserEditor.on({
	    afteredit: function() {
		Ext.getCmp('savelusrbtn').enable();
	    }
    })
    
    var uGrp = new Ext.data.Store({
            id: 'uGrp',
            sortInfo:{field: 'grupo', direction: "ASC"},
            proxy: new Ext.data.HttpProxy({
                    url: './app/queryMod.php',
                    method: 'GET'
            }),
            reader: new Ext.data.JsonReader({  
                    root: 'Groups'
            },
            [
                    {name: 'gid', type: 'int', mapping: 'id'},
                    {name: 'grupo', type: 'string', mapping: 'grupo'}
            ])
    });
    uGrp.load();
    
    var ugCombo = new Ext.form.ComboBox({
	    allowBlank: false,
	    store: uGrp,
	    displayField: 'grupo',
	    valueField: 'gid',
	    triggerAction: 'all',
	    editable: false
    });
    
    AdminUserGrid.superclass.constructor.call(this, {
        store: AdminUserDS,
        stateId: 'adminuser',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'uid', header: "Username", width: 120, sortable: true, menuDisabled: true, dataIndex: 'uid', editor: { xtype: 'textfield', allowBlank: false }},
		{id: 'fname', header: "Name", width: 110, sortable: true, menuDisabled: true, dataIndex: 'fname', editor: { xtype: 'textfield', allowBlank: false }},
		{id: 'lname', header: "Last Name", width: 180, sortable: true, menuDisabled: true, dataIndex: 'lname', editor: { xtype: 'textfield', allowBlank: false }},
		{id: 'pwd', header: "Password", width: 100, sortable: false, menuDisabled: true, dataIndex: 'pwd', editor: { xtype: 'textfield', inputType: 'password', allowBlank: false }, renderer: function() { return '&#9679&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;' }},
		{id: 'gid', header: "Group", width: 180, sortable: true, menuDisabled: true, dataIndex: 'gid', editor: ugCombo, renderer: function (value) { var record = ugCombo.findRecord(ugCombo.valueField, value); return record ? record.get(ugCombo.displayField) : ugCombo.valueNotFoundText; } },
		{id: 'adm', header: "Adm?", width: 45, sortable: false, menuDisabled: true, dataIndex: 'adm', xtype: 'booleancolumn', trueText: 'Yes', falseText: 'No',  editor: { xtype: 'checkbox' }},
		{id: 'cn', dataIndex: 'cn', hidden: true},
		{id: 'opwd', dataIndex: 'opwd', hidden: true}
        ],
        plugins: [AdminUserEditor],
        tbar:[
            {
            id: 'addlusrbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new AdminUseri({
                        uid: 'user',
			fname: 'Name',
			lname: 'Last Name',
			pwd: 'xxxxxxxxx',
			gid: '1',
			adm: '0'
                    });
                    AdminUserEditor.stopEditing();
                    AdminUserDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    AdminUserEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removelusrbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        AdminUserEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('savelusrbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                AdminUserDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editlusrbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    AdminUserEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'savelusrbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                        AdminUserDS.save();
			setTimeout(function(){AdminUserDS.reload()}, 200);
			Ext.getCmp('savelusrbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editlusrbtn').disable();
                Ext.getCmp('removelusrbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editlusrbtn').disable();
                    Ext.getCmp('removelusrbtn').disable();
                } else {
                    Ext.getCmp('editlusrbtn').enable();
                    Ext.getCmp('removelusrbtn').enable();
                }
            }
        },
        height:380,
        width:575
    });
    setTimeout(function(){AdminUserDS.reload()}, 100);
}
Ext.extend(AdminUserGrid, Ext.grid.GridPanel);*/