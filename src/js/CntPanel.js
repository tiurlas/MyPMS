CntGrid = function(){
    var EnvProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryCnt.php',
                create : './app/addCnt.php',
                update: './app/updateCnt.php',
                destroy: './app/deleteCnt.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Country = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'pais', type: 'string', mapping: 'pais'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Country'
    },
    Country);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var CntDS = new Ext.data.Store({
            id: 'CntDS',
            proxy: EnvProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    CntDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var CntEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    CntEditor.on({
	    afteredit: function() {
		Ext.getCmp('savecnbtn').enable();
	    }
    })
    
    CntGrid.superclass.constructor.call(this, {
        store: CntDS,
        stateId: 'country',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'pais', header: "Group", width: 175, sortable: true, menuDisabled: true, dataIndex: 'pais', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [CntEditor],
        tbar:[
            {
            id: 'addcnbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new Country({
                        pais: 'Country Name'
                    });
                    CntEditor.stopEditing();
                    CntDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    CntEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removecnbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        CntEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('savecnbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                CntDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editcnbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    CntEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'savecnbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                        CntDS.save();
			setTimeout(function(){CntDS.reload()}, 100);
			Ext.getCmp('savecnbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editcnbtn').disable();
                Ext.getCmp('removecnbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editcnbtn').disable();
                    Ext.getCmp('removecnbtn').disable();
                } else {
                    Ext.getCmp('editcnbtn').enable();
                    Ext.getCmp('removecnbtn').enable();
                }
            }
        },
        autoExpandColumn: 'pais',
        height:380,
        width:575
    });
}
Ext.extend(CntGrid, Ext.grid.GridPanel);