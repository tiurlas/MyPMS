StatGrid = function(){
    var EnvProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryStat.php',
                create : './app/addStat.php',
                update: './app/updateStat.php',
                destroy: './app/deleteStat.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Stat = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'status', type: 'string', mapping: 'status'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Stat'
    },
    Stat);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var StatDS = new Ext.data.Store({
            id: 'StatDS',
            proxy: EnvProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    StatDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var StatEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    StatEditor.on({
	    afteredit: function() {
		    Ext.getCmp('savestatusbtn').enable();
	    }
    })
    
    StatGrid.superclass.constructor.call(this, {
        store: StatDS,
        stateId: 'status',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'status', header: "Status", width: 175, sortable: true, menuDisabled: true, dataIndex: 'status', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [StatEditor],
        tbar:[
            {
            id: 'addcnbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new Stat({
                        status: 'Stat'
                    });
                    StatEditor.stopEditing();
                    StatDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    StatEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removestatusbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                    StatEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('savestatusbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                            StatDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editstatusbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    StatEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'savestatusbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                    StatDS.save();
			setTimeout(function(){StatDS.reload()}, 100);
			Ext.getCmp('savestatusbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editstatusbtn').disable();
                Ext.getCmp('removestatusbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editstatusbtn').disable();
                    Ext.getCmp('removestatusbtn').disable();
                } else {
                    Ext.getCmp('editstatusbtn').enable();
                    Ext.getCmp('removestatusbtn').enable();
                }
            }
        },
        autoExpandColumn: 'status',
        height:380,
        width:575
    });
}
Ext.extend(StatGrid, Ext.grid.GridPanel);