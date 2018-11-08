/*Mgmt = function() {
    var GrProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryGrp.php',
                create : './app/addGrp.php',
                update: './app/updateGrp.php',
                destroy: './app/deleteGrp.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var Group = Ext.data.Record.create([
            {name: 'id', type: 'int', mapping: 'id'},
            {name: 'grupo', type: 'string', mapping: 'grupo'},
	    {name: 'adm', type: 'int', mapping: 'adm'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'Groups'
    },
    Group);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var GrDS = new Ext.data.Store({
            id: 'GrDS',
            proxy: GrProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    GrDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
	editor: f
    });
    
    var GrpEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    GrpEditor.on({
	    afteredit: function() {
		Ext.getCmp('saveigrpbtn').enable();
	    }
    })
    
    Ext.grid.RowSelectionModel.override ({
            getSelectedIndex : function(){
                    return this.grid.store.indexOf( this.selections.itemAt(0) );
            }
    });
    
    var UserGrid = new Ext.grid.GridPanel({
        store: GrDS,
        stateId: 'grid',
        selModel: ChkBx,
        layout: 'fit',
        columns: [
                ChkBx,
                {id: 'grupo', header: "Group", sortable: true, menuDisabled: true, dataIndex: 'grupo', editor: { xtype: 'textfield', allowBlank: false }},
                {id: 'adm', header: 'Admin', width: 50, sortable: true, menuDisabled: true, dataIndex: 'adm', align: 'center', xtype: 'booleancolumn', trueText: 'Yes', falseText: 'No', editor: { xtype: 'checkbox' }}
                
        ],
        plugins: [GrpEditor],
        tbar:[
            {
            id: 'addigrpbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new Group({
                        grupo: 'Group',
			adm: '0'
                    });
                    GrpEditor.stopEditing();
                    GrDS.insert(0, e);
                    UserGrid.getView().refresh();
                    UserGrid.getSelectionModel().selectRow(0);
                    GrpEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeigrpbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        GrpEditor.stopEditing();
                        var s = UserGrid.getSelectionModel().getSelections();
			Ext.getCmp('saveigrpbtn').enable();
                        for(var i = 0, r; r = s[i]; i++){
                                GrDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editigrpbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = UserGrid.getSelectionModel().getSelections();
                    GrpEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveigrpbtn',
                text: 'Save',
                iconCls: 'icon-save',
		disabled: true,
                handler: function(){
                        GrDS.save();
			setTimeout(function(){GrDS.reload()}, 100);
			Ext.getCmp('saveigrpbtn').disable();
                },
                scope: this
            },
	],
        /*listeners: {
            render: function() {
                Ext.getCmp('editigrpbtn').disable();
                Ext.getCmp('removeigrpbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editigrpbtn').disable();
                    Ext.getCmp('removeigrpbtn').disable();
                    UserForm.getForm().reset();
                    Ext.getCmp('UserFrom').setTitle('Group Members');
                    Ext.getCmp('UserMulti1').disable();
                    Ext.getCmp('UserMulti2').disable();
                    Ext.getCmp('UserMulti11').disable();
                    Ext.getCmp('UserMulti22').disable();
                    Ext.getCmp('savembtn').disable();
                } else {
                    Ext.getCmp('UserMulti1').enable();
                    Ext.getCmp('UserMulti2').enable();
                    Ext.getCmp('UserMulti11').enable();
                    Ext.getCmp('UserMulti22').enable();
                    var selRow = this.getSelectionModel().getSelectedIndex();
                    var RowData = this.getStore().getAt(selRow);
                    UserForm.getForm().reset();
                    UserMember.load({params:{g:RowData.get('grupo')}});
		    ServerMember.load({params:{g:RowData.get('grupo')}});
                    Ext.getCmp('UserFrom').setTitle('Group Members :: ' + RowData.get('grupo'));
                    Ext.getCmp('UserGName').setValue(RowData.get('grupo'));
                    Ext.getCmp('editigrpbtn').enable();
                    Ext.getCmp('removeigrpbtn').enable();
                    Ext.getCmp('savembtn').enable();
                }
            }
        },
        autoExpandColumn: 'grupo',
        height:300,
        width:575
    });
    
    var UserAll = new Ext.data.Store({
            id: 'UserAll',
            sortInfo:{field: 'text', direction: "ASC"},
            proxy: new Ext.data.HttpProxy({
                    url: './app/queryLDAPUser.php',
                    method: 'GET'
            }),
            reader: new Ext.data.JsonReader({  
                    root: 'LDAPUsers'
            },
            [
                    {name: 'value', type: 'string', mapping: 'uid'},
                    {name: 'text', type: 'string', mapping: 'cn'}
            ])
    });
    UserAll.load();
    
    var UserMember = new Ext.data.Store({
            id: 'UserMember',
            sortInfo:{field: 'text', direction: "ASC"},
            proxy: new Ext.data.HttpProxy({
                    url: './app/queryUser.php?g=',
                    method: 'GET'
            }),
            reader: new Ext.data.JsonReader({  
                    root: 'User'
            },
            [
                    {name: 'value', type: 'string', mapping: 'uid'},
                    {name: 'text', type: 'string', mapping: 'cn'}
            ])
    })
    UserMember.load();
    
    var ServerAll = new Ext.data.Store({
            id: 'UserMember',
            sortInfo:{field: 'text', direction: "ASC"},
            proxy: new Ext.data.HttpProxy({
                    url: './app/queryServerAll.php',
                    method: 'GET'
            }),
            reader: new Ext.data.JsonReader({  
                    root: 'Server'
            },
            [
                    {name: 'value', type: 'string', mapping: 'svr'},
                    {name: 'text', type: 'string', mapping: 'host'}
            ])
    })
    ServerAll.load();
    
    var ServerMember = new Ext.data.Store({
            id: 'UserMember',
            sortInfo:{field: 'text', direction: "ASC"},
            proxy: new Ext.data.HttpProxy({
                    url: './app/queryServerMember.php?g=',
                    method: 'GET'
            }),
            reader: new Ext.data.JsonReader({  
                    root: 'ServerMembers'
            },
            [
                    {name: 'value', type: 'string', mapping: 'svr'},
                    {name: 'text', type: 'string', mapping: 'host'}
            ])
    })
    ServerMember.load();
    
    var UserForm = new Ext.form.FormPanel({
        id: 'UserFrom',
        title: 'Group Members',
	layout: 'column',
	bodyStyle: 'padding:10px; padding-left:50px;',   
        items: [
            {
                xtype: 'textfield',
                id: 'UserGName',
                dataIndex: 'UserGName',
                hidden: true
            },
            {
                xtype: 'itemselector',
                name: '1',
                imagePath: 'images/',
                drawUpIcon: false,
                drawDownIcon: false,
                drawTopIcon: false,
                drawBotIcon: false,
                delimiter: ';',
		columnWidth: .50,
                multiselects: [{
                    name: 'UserMulti1',
                    id: 'UserMulti1',
                    width: 150,
                    height: 125,
                    store: UserAll,
                    displayField: 'text',
                    valueField: 'value',
                    disabled: true
                },{
                    name: 'UserMulti2',
                    id: 'UserMulti2',
                    width: 150,
                    height: 125,
                    store: UserMember,
                    displayField: 'text',
                    valueField: 'value',
                    disabled: true
                }]
            },
            {
                xtype: 'itemselector',
                name: '2',
                imagePath: 'images/',
                drawUpIcon: false,
                drawDownIcon: false,
                drawTopIcon: false,
                drawBotIcon: false,
                delimiter: ';',
		columnWidth: .50,
                multiselects: [{
                    name: 'UserMulti11',
                    id: 'UserMulti11',
                    width: 150,
                    height: 125,
                    store: ServerAll,
                    displayField: 'text',
                    valueField: 'value',
                    disabled: true
                },{
                    name: 'UserMulti22',
                    id: 'UserMulti22',
                    width: 150,
                    height: 125,
                    store: ServerMember,
                    displayField: 'text',
                    valueField: 'value',
                    disabled: true
                }]
            }
        ],
        buttons: [
            {
                text: 'Save',
                id: 'savembtn',
                disabled: true,
                scope: this,
                handler: function(){
                    if(UserForm.getForm().isValid()){
                        UserForm.getForm().submit({
                            url: './app/updateMembers.php',
                            method: 'POST',
                            encode: true
                        })
			Ext.ux.Toast.msg('Status', 'Group members updated');
                    }
                }
            }
        ]
    })
    
    Mgmt.superclass.constructor.call(this, {
        title: 'Groups',
        layout: { type: 'vBox', align: 'stretch' },
        items: [
            UserGrid,
            UserForm
        ]
    });
}*//*
        listeners: {
        render: function() {
            Ext.getCmp('editigrpbtn').disable();
            Ext.getCmp('removeigrpbtn').disable();
        },
        rowClick: function() {
            if (!this.getSelectionModel().hasSelection()) {
                Ext.getCmp('editigrpbtn').disable();
                Ext.getCmp('removeigrpbtn').disable();
            } else {
                Ext.getCmp('editigrpbtn').enable();
                Ext.getCmp('removeigrpbtn').enable();
            }
        }
    },
    autoExpandColumn: 'igrp',
    height:380,
    width:575
});
}
Ext.extend(Mgmt, Ext.Panel);*/