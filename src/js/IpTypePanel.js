IpTypeGrid = function(){
    var IpTypeProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryIpType.php',
                create : './app/addIpType.php',
                update: './app/updateIpType.php',
                destroy: './app/deleteIpType.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var IpTypei = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'tipo', type: 'string', mapping: 'tipo'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'IpType'
    },
    IpTypei);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var IpTypeDS = new Ext.data.Store({
            id: 'IpTypeDS',
            proxy: IpTypeProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var IpTypeEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    IpTypeEditor.on({
	    afteredit: function() {
		    Ext.getCmp('saveiptbtn').enable();
	    }
    })
    
    IpTypeGrid.superclass.constructor.call(this, {
        store: IpTypeDS,
        stateId: 'iptype',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'tipo', header: "IP Type", width: 175, sortable: true, menuDisabled: true, dataIndex: 'tipo', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [IpTypeEditor],
        tbar:[
            {
            id: 'addiptbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new IpTypei({
                        env: 'IP Type'
                    });
                    IpTypeEditor.stopEditing();
                    IpTypeDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    IpTypeEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeiptbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        IpTypeEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('saveiptbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                IpTypeDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editiptbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    IpTypeEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveiptbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disable: true,
                handler: function(){
                        IpTypeDS.save();
			setTimeout(function(){IpTypeDS.reload()}, 100);
			Ext.getCmp('saveiptbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editiptbtn').disable();
                Ext.getCmp('removeiptbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editiptbtn').disable();
                    Ext.getCmp('removeiptbtn').disable();
                } else {
                    Ext.getCmp('editiptbtn').enable();
                    Ext.getCmp('removeiptbtn').enable();
                }
            }
        },
        autoExpandColumn: 'tipo',
        height:380,
        width:575
    });
    IpTypeDS.load();
}
Ext.extend(IpTypeGrid, Ext.grid.GridPanel);