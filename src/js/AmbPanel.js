AmbienteGrid = function(){
    var EnvProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryAmb.php',
                create : './app/addAmb.php',
                update: './app/updateAmb.php',
                destroy: './app/deleteAmb.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Ambiente = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'ambiente', type: 'string', mapping: 'ambiente'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Ambiente'
    },
    Ambiente);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var AmbienteDS = new Ext.data.Store({
            id: 'AmbienteDS',
            proxy: EnvProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    AmbienteDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var AmbienteEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    AmbienteEditor.on({
	    afteredit: function() {
		Ext.getCmp('saveambbtn').enable();
	    }
    })
    
    AmbienteGrid.superclass.constructor.call(this, {
        store: AmbienteDS,
        stateId: 'ambiente',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'ambiente', header: "Ambiente", width: 175, sortable: true, menuDisabled: true, dataIndex: 'ambiente', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [AmbienteEditor],
        tbar:[
            {
            id: 'addambbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new Ambiente({
                        amb: 'Ambiente'
                    });
                    AmbienteEditor.stopEditing();
                    AmbienteDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    AmbienteEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeambbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                    AmbienteEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('saveambbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                            AmbienteDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editambbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    AmbienteEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveambbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                    AmbienteDS.save();
			setTimeout(function(){AmbienteDS.reload()}, 100);
			Ext.getCmp('saveambbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editambbtn').disable();
                Ext.getCmp('removeambbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editambbtn').disable();
                    Ext.getCmp('removeambbtn').disable();
                } else {
                    Ext.getCmp('editambbtn').enable();
                    Ext.getCmp('removeambbtn').enable();
                }
            }
        },
        autoExpandColumn: 'ambiente',
        height:380,
        width:575
    });
}
Ext.extend(AmbienteGrid, Ext.grid.GridPanel);