ModulGrid = function(){
    var EnvProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryMod.php',
                create : './app/addMod.php',
                update: './app/updateMod.php',
                destroy: './app/deleteMod.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Modul = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'modulo', type: 'string', mapping: 'modulo'}	        
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Modul'
    },
    Modul);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var ModulDS = new Ext.data.Store({
            id: 'ModulDS',
            proxy: EnvProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    ModulDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var ModulEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    ModulEditor.on({
	    afteredit: function() {
		Ext.getCmp('savemodbtn').enable();
	    }
    })
    
    ModulGrid.superclass.constructor.call(this, {
        store: ModulDS,
        stateId: 'modulo',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'modelo', header: "Modules", width: 175, sortable: true, menuDisabled: true, dataIndex: 'modulo', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [ModulEditor],
        tbar:[
            {
            id: 'addmodbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new Modul({
                        grupo: 'Modul'			
                    });
                    ModulEditor.stopEditing();
                    ModulDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    ModulEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removemodbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                    ModulEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('savemodbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                            ModulDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editmodbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    ModulEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'savemodbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                    ModulDS.save();
			setTimeout(function(){ModulDS.reload()}, 100);
			Ext.getCmp('savemodbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editmodbtn').disable();
                Ext.getCmp('removemodbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editmodbtn').disable();
                    Ext.getCmp('removemodbtn').disable();
                } else {
                    Ext.getCmp('editmodbtn').enable();
                    Ext.getCmp('removemodbtn').enable();
                }
            }
        },
        autoExpandColumn: 'modulo',
        height:380,
        width:575
    });
}
Ext.extend(ModulGrid, Ext.grid.GridPanel);