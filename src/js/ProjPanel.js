ProjGrid = function(){
    var EnvProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryProj.php',
                create : './app/addProj.php',
                update: './app/updateProj.php',
                destroy: './app/deleteProj.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Proj = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'projeto', type: 'string', mapping: 'projeto'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Proj'
    },
    Proj);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var ProjDS = new Ext.data.Store({
            id: 'ProjDS',
            proxy: EnvProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    ProjDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var ProjEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    ProjEditor.on({
	    afteredit: function() {
		    Ext.getCmp('saveprojetobtn').enable();
	    }
    })
    
    ProjGrid.superclass.constructor.call(this, {
        store: ProjDS,
        stateId: 'projeto',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'projeto', header: "Projects", width: 175, sortable: true, menuDisabled: true, dataIndex: 'projeto', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [ProjEditor],
        tbar:[
            {
            id: 'addcnbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new Proj({
                        projeto: 'Proj'
                    });
                    ProjEditor.stopEditing();
                    ProjDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    ProjEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeprojetobtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                    ProjEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('saveprojetobtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                            ProjDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editprojetobtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    ProjEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveprojetobtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                    ProjDS.save();
			setTimeout(function(){ProjDS.reload()}, 100);
			Ext.getCmp('saveprojetobtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editprojetobtn').disable();
                Ext.getCmp('removeprojetobtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editprojetobtn').disable();
                    Ext.getCmp('removeprojetobtn').disable();
                } else {
                    Ext.getCmp('editprojetobtn').enable();
                    Ext.getCmp('removeprojetobtn').enable();
                }
            }
        },
        autoExpandColumn: 'projeto',
        height:380,
        width:575
    });
}
Ext.extend(ProjGrid, Ext.grid.GridPanel);