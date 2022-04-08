TryGrid = function(){
    var proxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryGroup.php',
                create : './app/addGroup.php',
                update: './app/updateGroup.php',
                destroy: './app/deleteGroup.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Group = Ext.data.Record.create([
            {name: 'gid', type: 'int', mapping: 'gid'},
            {name: 'grupo', type: 'string', mapping: 'grupo'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Groups'
    },
    Group);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var Groups = new Ext.data.Store({
            id: 'Groups',
            proxy: proxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    Groups.load();
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id'
    });
    
    var editor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    TryGrid.superclass.constructor.call(this, {
        store: Groups,
        stateId: 'group',
        selModel: ChkBx,
        columns: [
                ChkBx,
                {id: 'grupo', header: "Group", width: 175, sortable: true, menuDisabled: true, dataIndex: 'grupo', editor: { xtype: 'textfield', allowBlank: false }},
        ],
        plugins: [editor],
        tbar:[
            {
            id: 'addgrbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new Group({
                        grupo: 'Group Name',
                    });
                    editor.stopEditing();
                    Groups.insert(0, e);
                    this.getView().refresh();
                    this.getSelectionModel().selectRow(0);
                    editor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removegrbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        editor.stopEditing();
                        var s = this.getSelectionModel().getSelections();
                        for(var i = 0, r; r = s[i]; i++){
                                Groups.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editgrbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                        if (!this.getSelectionModel().hasSelection()) {
                                Ext.MessageBox.alert('Edit','You must select a record !');
                        } else {
                                var s = this.getSelectionModel().getSelections();
                                editor.startEditing(s[0]);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'savegrbtn',
                text: 'Save',
                iconCls: 'icon-save',
                handler: function(){
                        Groups.save();
                        Groups.load();
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editgrbtn').disable();
                Ext.getCmp('removegrbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editgrbtn').disable();
                    Ext.getCmp('removegrbtn').disable();
                } else {
                    Ext.getCmp('editgrbtn').enable();
                    Ext.getCmp('removegrbtn').enable();
                }
            }
        },
        autoExpandColumn: 'grupo',
        height:380,
        width:575
    });
}
Ext.extend(TryGrid, Ext.grid.GridPanel);