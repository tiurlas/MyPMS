ClientGrid = function(){
    var EnvProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryClient.php',
                create : './app/addClient.php',
                update: './app/updateClient.php',
                destroy: './app/deleteClient.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Client = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'cliente', type: 'string', mapping: 'cliente'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Client'
    },
    Client);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var ClientDS = new Ext.data.Store({
            id: 'ClientDS',
            proxy: EnvProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    ClientDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var ClientEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    ClientEditor.on({
	    afteredit: function() {
		    Ext.getCmp('saveclientebtn').enable();
	    }
    })
    
    ClientGrid.superclass.constructor.call(this, {
        store: ClientDS,
        stateId: 'cliente',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'cliente', header: "Clients", width: 175, sortable: true, menuDisabled: true, dataIndex: 'cliente', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [ClientEditor],
        tbar:[
            {
            id: 'addcnbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new Client({
                        cliente: 'Client'
                    });
                    ClientEditor.stopEditing();
                    ClientDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    ClientEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeclientebtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                    ClientEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('saveclientebtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                            ClientDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editclientebtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    ClientEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveclientebtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                    ClientDS.save();
			setTimeout(function(){ClientDS.reload()}, 100);
			Ext.getCmp('saveclientebtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editclientebtn').disable();
                Ext.getCmp('removeclientebtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editclientebtn').disable();
                    Ext.getCmp('removeclientebtn').disable();
                } else {
                    Ext.getCmp('editclientebtn').enable();
                    Ext.getCmp('removeclientebtn').enable();
                }
            }
        },
        autoExpandColumn: 'cliente',
        height:380,
        width:575
    });
}
Ext.extend(ClientGrid, Ext.grid.GridPanel);