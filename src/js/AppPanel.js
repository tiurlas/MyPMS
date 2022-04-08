AppGrid = function(){
    var EnvProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/appList.php?action=json&do=read',
                create : './app/appList.php?action=json&do=add',
                update: './app/appList.php?action=json&do=update',
                destroy: './app/appList.php?action=json&do=delete'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var App = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'app', type: 'string', mapping: 'app'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'App'
    },
    App);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var AppDS = new Ext.data.Store({
            id: 'AppDS',
            proxy: EnvProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    AppDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var AppEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    AppEditor.on({
	    afteredit: function() {
		    Ext.getCmp('saveappbtn').enable();
	    }
    })
    
    AppGrid.superclass.constructor.call(this, {
        store: AppDS,
        stateId: 'os',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'app', header: "Application", width: 175, sortable: true, menuDisabled: true, dataIndex: 'app', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [AppEditor],
        tbar:[
            {
            id: 'addappbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new App({
                        app: 'Application name'
                    });
                    AppEditor.stopEditing();
                    AppDS.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    AppEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeappbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        AppEditor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
			Ext.getCmp('saveappbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                AppDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editappbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = this.getSelectionModel().getSelections();
                    AppEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveappbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                        AppDS.save();
			setTimeout(function(){AppDS.reload()}, 100);
			Ext.getCmp('saveappbtn').disable();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editappbtn').disable();
                Ext.getCmp('removeappbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editappbtn').disable();
                    Ext.getCmp('removeappbtn').disable();
                } else {
                    Ext.getCmp('editappbtn').enable();
                    Ext.getCmp('removeappbtn').enable();
                }
            }
        },
        autoExpandColumn: 'app',
        height:380,
        width:575
    });
}
Ext.extend(AppGrid, Ext.grid.GridPanel);