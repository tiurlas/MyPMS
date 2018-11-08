OSGrid = function(){
    var EnvProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryOS.php',
                create : './app/addOS.php',
                update: './app/updateOS.php',
                destroy: './app/deleteOS.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var OS = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'os', type: 'string', mapping: 'os'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'OS'
    },
    OS);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var OSDS = new Ext.data.Store({
            id: 'OSDS',
            proxy: EnvProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    OSDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var OSEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    OSEditor.on({
	    afteredit: function() {
		    Ext.getCmp('saveosbtn').enable();
	    }
    })
    
    OSGrid.superclass.constructor.call(this, {
        store: OSDS,
        stateId: 'os',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'os', header: "Operational System", width: 175, sortable: true, menuDisabled: true, dataIndex: 'os', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [OSEditor],
        tbar:[
            {
            id: 'addcnbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new OS({
                        os: 'OS'
                    });
                    OSEditor.stopEditing();
                    OSDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    OSEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeosbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        OSEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('saveosbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                OSDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editosbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    OSEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveosbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                        OSDS.save();
			setTimeout(function(){OSDS.reload()}, 100);
			Ext.getCmp('saveosbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editosbtn').disable();
                Ext.getCmp('removeosbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editosbtn').disable();
                    Ext.getCmp('removeosbtn').disable();
                } else {
                    Ext.getCmp('editosbtn').enable();
                    Ext.getCmp('removeosbtn').enable();
                }
            }
        },
        autoExpandColumn: 'os',
        height:380,
        width:575
    });
}
Ext.extend(OSGrid, Ext.grid.GridPanel);