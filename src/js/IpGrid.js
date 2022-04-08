IPGrid = function(hid, host){
    var IPProxy = new Ext.data.HttpProxy({
		api: {
			read : './app/queryIP.php?id='+hid,
			create : './app/addIP.php?id='+hid,
			update: './app/updateIP.php?id='+hid,
			destroy: './app/deleteIP.php?id='+hid
		},
		actionMethods: {
			create: 'POST',
			read: 'POST',
			update: 'POST',
			destroy: 'POST'
		}
    });
    
    var IPi = Ext.data.Record.create([
        {name: 'id', type: 'int', mapping: 'sid'},
	    {name: 'sid', type: 'int', mapping: 'id'},
        {name: 'addr', type: 'string', mapping: 'addr'},
		{name: 'addrnat', type: 'string', mapping: 'addrnat'},
	    {name: 'tid', type: 'int', mapping: 'tid'}
    ]);
    
    var reader = new Ext.data.JsonReader({
        root: 'IP'
    },
    IPi);
    
    var writer = new Ext.data.JsonWriter({
		encode: false,
		writeAllFields: true
    });
    
    var IPDS = new Ext.data.Store({
		id: 'IPDS',
		proxy: IPProxy,
		reader: reader,
		writer: writer,
		autoSave: false
    });

    IPDS.load();
    
    var Type = new Ext.data.Store({
	    id: 'Type',
	    sortInfo:{field: 'tstr', direction: "ASC"},
	    proxy: new Ext.data.HttpProxy({
		    url: './app/queryType.php',
		    method: 'GET'
	    }),
	    reader: new Ext.data.JsonReader({  
		    root: 'Type'
	    },
	    [
		    {name: 'tid', type: 'int', mapping: 'tid'},
		    {name: 'tstr', type: 'string', mapping: 'tstr'}
	    ])
    });
    
    Type.load();
    
    var tCombo = new Ext.form.ComboBox({
	    allowBlank: false,
	    store: Type,
	    displayField: 'tstr',
	    valueField: 'tid',
	    editable: false
    });
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var IPEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    IPEditor.on({
	    afteredit: function() {
		    Ext.getCmp('saveipbtn').enable();
	    }
    })
    
    IPGrid.superclass.constructor.call(this, {
        store: IPDS,
		title: '',
        stateId: 'ip',
        selModel: ChkBx,
        columns: [
            ChkBx,
            {id: 'addr', header: "IP Fisico", width: 100, sortable: false, menuDisabled: true, dataIndex: 'addr', editor: { xtype: 'textfield', allowBlank: false }},
			{id: 'addrnat', header: "IP NAT", width: 100, sortable: false, menuDisabled: true, dataIndex: 'addrnat', editor: { xtype: 'textfield', allowBlank: true }},
			{id: 'tid', header: 'Type', align: 'left', sortable: true, menuDisabled: true, dataIndex: 'tid', editor: tCombo, renderer: function (value) { var record = tCombo.findRecord(tCombo.valueField, value); return record ? record.get(tCombo.displayField) : tCombo.valueNotFoundText; }}
        ],
        plugins: [IPEditor],
        tbar:[
            {
            id: 'addipbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new IPi({
                        addr: 'IP Fisico',
						addrnat: 'IP NAT',
						tid: '1'
                    });
                    IPEditor.stopEditing();
                    IPDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    IPEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeipbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        IPEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
						Ext.getCmp('saveipbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                IPDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editipbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    IPEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveipbtn',
                text: 'Save',
                iconCls: 'icon-save',
				disabled: true,
                handler: function(){
                    IPDS.save();
					setTimeout(function(){IPDS.reload()}, 100);
					Ext.getCmp('saveipbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
				if (document.getElementById('admin').value == 0 ) {
				    this.getTopToolbar().hide();
				} else {
				    Ext.getCmp('editipbtn').disable();
				    Ext.getCmp('removeipbtn').disable();
				}
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editipbtn').disable();
                    Ext.getCmp('removeipbtn').disable();
                } else {
                    Ext.getCmp('editipbtn').enable();
                    Ext.getCmp('removeipbtn').enable();
                }
            }
        },
	autoExpandColumn: 'tid',
        height:305,
        width:385
    });
    IPDS.load();
}
Ext.extend(IPGrid, Ext.grid.GridPanel);