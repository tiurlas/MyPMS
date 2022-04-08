LdapGrpMgmt = function() {
    var IncGroupProxy = new Ext.data.HttpProxy({
            api: {
                read : './app/queryLDAPGroup.php',
                create : './app/addLDAPGroup.php',
                update: './app/updateLDAPGroup.php',
                destroy: './app/deleteLDAPGroup.php'
            },
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            }
    });
    
    var IncGroupi = Ext.data.Record.create([
            {name: 'id', type: 'string', mapping: 'id'},
            {name: 'grupo', type: 'string', mapping: 'grupo'}
    ]);
    
    var reader = new Ext.data.JsonReader({
            root: 'LDAPGroups'
    },
    IncGroupi);
    
    var writer = new Ext.data.JsonWriter({
            encode: false,
            writeAllFields: true
    });
    
    var IncGroupDS = new Ext.data.Store({
            id: 'IncGroupDS',
            proxy: IncGroupProxy,
            reader: reader,
            writer: writer,
            autoSave: false
    });
    IncGroupDS.load();
    
    var f = new Ext.form.Checkbox({disabled: true, checked: true});
    
    var ChkBx = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        sortable: false,
        checkOnly: false,
	dataIndex: 'id',
        editor: f
    });
    
    var IncGroupEditor = new Ext.ux.grid.RowEditor({
            saveText: 'OK',
            clicksToEdit: 0
    });
    
    Ext.grid.RowSelectionModel.override ({
            getSelectedIndex : function(){
                    return this.grid.store.indexOf( this.selections.itemAt(0) );
            }
    });
    
    var iGrid = new Ext.grid.GridPanel({
        store: IncGroupDS,
        stateId: 'incgroup',
        selModel: ChkBx,
        layout: 'fit',
        columns: [
                ChkBx,
                {id: 'grupo', header: "LDAP Group", sortable: true, menuDisabled: true, dataIndex: 'grupo', editor: { xtype: 'textfield', allowBlank: false }},
                {id: 'id', hidden: true, dataIndex: 'id' }
                
        ],
        plugins: [IncGroupEditor],
        tbar:[
            {
            id: 'addiusrbtn',
            text: 'Add',
            iconCls: 'icon-add',
            handler:function() {
                    var e = new IncGroupi({
                        grupo: 'LDAP Group'
                    });
                    IncGroupEditor.stopEditing();
                    IncGroupDS.insert(0, e);
                    iGrid.getView().refresh();
                    iGrid.getSelectionModel().selectRow(0);
                    IncGroupEditor.startEditing(0);
                },
                scope: this
            },
            '-',
            {
                id: 'removeiusrbtn',
                text: 'Remove',
                iconCls: 'icon-remove',
                handler: function(){
                        IncGroupEditor.stopEditing();
                        var s = iGrid.getSelectionModel().getSelections();
                        for(var i = 0, r; r = s[i]; i++){
                                IncGroupDS.remove(r);
                        }
                },
                scope: this
            },
            '-',
            {
                id: 'editiusrbtn',
                text: 'Edit',
                iconCls: 'icon-edit',
                handler: function(){
                    var s = iGrid.getSelectionModel().getSelections();
                    IncGroupEditor.startEditing(s[0]);
                },
                scope: this
            },
            '-',
            {
                id: 'saveiusrbtn',
                text: 'Save',
                iconCls: 'icon-save',
                handler: function(){
                        IncGroupDS.save();
			setTimeout(function(){IncGroupDS.reload()}, 100);
                },
                scope: this
            },
	],
        listeners: {
            render: function() {
                Ext.getCmp('editiusrbtn').disable();
                Ext.getCmp('removeiusrbtn').disable();
            },
            rowClick: function() {
                if (!this.getSelectionModel().hasSelection()) {
                    Ext.getCmp('editiusrbtn').disable();
                    Ext.getCmp('removeiusrbtn').disable();
                    gForm.getForm().reset();
                    Ext.getCmp('lForm').setTitle('LDAP Group Members');
                    Ext.getCmp('msel1').disable();
                    Ext.getCmp('msel2').disable();
                    Ext.getCmp('svmbtn').disable();
                } else {
                    Ext.getCmp('msel1').enable();
                    Ext.getCmp('msel2').enable();
                    var selRow = this.getSelectionModel().getSelectedIndex();
                    var RowData = this.getStore().getAt(selRow);
                    gForm.getForm().reset();
                    selGrp.load({params:{g:RowData.get('grupo')}});
                    Ext.getCmp('lForm').setTitle('LDAP Group Members :: ' + RowData.get('grupo'));
                    Ext.getCmp('gname').setValue(RowData.get('grupo'));
                    Ext.getCmp('editiusrbtn').enable();
                    Ext.getCmp('removeiusrbtn').enable();
                    Ext.getCmp('svmbtn').enable();
                }
            }
        },
        autoExpandColumn: 'grupo',
        height:300,
        width:575
    });
    
    var allUsers = new Ext.data.Store({
            id: 'allUsers',
            sortInfo:{field: 'text', direction: "ASC"},
            proxy: new Ext.data.HttpProxy({
                    url: './app/queryLDAPUser.php',
                    method: 'GET'
            }),
            reader: new Ext.data.JsonReader({  
                    root: 'LDAPUsers'
            },
            [
                    {name: 'value', type: 'string', mapping: 'dn'},
                    {name: 'text', type: 'string', mapping: 'cn'}
            ])
    });
    allUsers.load();
    
    var selGrp = new Ext.data.Store({
            id: 'selGrp',
            sortInfo:{field: 'text', direction: "ASC"},
            proxy: new Ext.data.HttpProxy({
                    url: './app/queryLDAPGroupMembers.php?g=',
                    method: 'GET'
            }),
            reader: new Ext.data.JsonReader({  
                    root: 'LDAPGroupMember'
            },
            [
                    {name: 'value', type: 'string', mapping: 'dn'},
                    {name: 'text', type: 'string', mapping: 'cn'}
            ])
    })
    selGrp.load();
    
    var gForm = new Ext.form.FormPanel({
        id: 'lForm',
        title: 'LDAP Group Members',
        items: [
            {
                xtype: 'itemselector',
                name: 'isel',
                imagePath: 'images/',
                drawUpIcon: false,
                drawDownIcon: false,
                drawTopIcon: false,
                drawBotIcon: false,
                delimiter: ';',
		hideLabel: true,
		style: 'padding-left: 180px;',
                multiselects: [{
                    name: 'msel1',
                    id: 'msel1',
                    width: 180,
                    height: 125,
                    store: allUsers,
                    displayField: 'text',
                    valueField: 'value',
                    disabled: true
                },{
                    name: 'msel2',
                    id: 'msel2',
                    width: 180,
                    height: 125,
                    store: selGrp,
                    displayField: 'text',
                    valueField: 'value',
                    disabled: true
                }]
            },
            {
                xtype: 'textfield',
                id: 'gname',
                dataIndex: 'gname',
                hidden: true
            }
        ],
        buttons: [
            {
                text: 'Save',
                id: 'svmbtn',
                disabled: true,
                scope: this,
                handler: function(){
                    if(gForm.getForm().isValid()){
                        gForm.getForm().submit({
                            url: './app/updateLDAPGroupMembers.php?g=' + Ext.getCmp('gname').getValue(),
                            method: 'POST',
                            encode: true
                        })
                    }
                }
            }
        ]
    })
    
    LdapGrpMgmt.superclass.constructor.call(this, {
        title: 'LDAP Groups',
        layout: { type: 'vBox', align: 'stretch' },
        items: [
            iGrid,
            gForm
        ]
    });
}
Ext.extend(LdapGrpMgmt, Ext.Panel);