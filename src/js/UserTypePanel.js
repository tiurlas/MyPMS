UserTypeGrid = function(){
    var UserTypeProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryUserType.php',
                create : './app/addUserType.php',
                update: './app/updateUserType.php',
                destroy: './app/deleteUserType.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var UserTypei = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'tipo', type: 'int', mapping: 'tipo'},
	    {name: 'display', type: 'string', mapping: 'display'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'UserType'
    },
    UserTypei);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var UserTypeDS = new Ext.data.Store({
            id: 'UserTypeDS',
            proxy: UserTypeProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    UserTypeDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var UserTypeEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    UserTypeEditor.on({
	    afteredit: function() {
		    Ext.getCmp('saveutypebtn').enable();
	    }
    })
    
    UserTypeGrid.superclass.constructor.call(this, {
        store: UserTypeDS,
        stateId: 'usertype',
        selModel: ChkBx,
        columns: [
                ChkBx,
		{id: 'tipo', header: "Is OS?", width: 50, sortable: false, menuDisabled: true, dataIndex: 'tipo', xtype: 'booleancolumn', trueText: 'Yes', falseText: 'No', editor: { xtype: 'checkbox' }},
                {id: 'display', header: "Display as", width: 175, sortable: true, menuDisabled: true, dataIndex: 'display', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [UserTypeEditor],
        tbar:[
            {
            id: 'addutypebtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new UserTypei({
                        tipo: '0',
			display: 'Display as...'
                    });
                    UserTypeEditor.stopEditing();
                    UserTypeDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    UserTypeEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeutypebtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        UserTypeEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('saveutypebtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                UserTypeDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editutypebtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    UserTypeEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveutypebtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                        UserTypeDS.save();
			setTimeout(function(){UserTypeDS.reload()}, 100);
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editutypebtn').disable();
                Ext.getCmp('removeutypebtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editutypebtn').disable();
                    Ext.getCmp('removeutypebtn').disable();
                } else {
                    Ext.getCmp('editutypebtn').enable();
                    Ext.getCmp('removeutypebtn').enable();
                }
            }
        },
        autoExpandColumn: 'display',
        height:380,
        width:575
    });
}
Ext.extend(UserTypeGrid, Ext.grid.GridPanel);