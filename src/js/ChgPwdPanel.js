ChgPwdAudit = function(){
    var proxy = new Ext.data.HttpProxy({
	    api: {
		    read : './app/getChgPwd.php',
		    update: './app/updateChgPwd.php',
		    create: './app/updateChgPwd.php'
	    },
	    actionMethods: {
		read: 'POST',
		update: 'POST',
		create: 'POST'
	    }
    })
    var reader = new Ext.data.JsonReader({   
	root: 'ChgPwd',
	totalProperty: 'Count'
    },[
	{name: 'host', type: 'string', mapping: 'host'},
	{name: 'chgpwd_msg', type: 'string', mapping: 'chgpwd_msg'},
	{name: 'chgpwd_status', type: 'int', mapping: 'chgpwd_status'},
	{name: 'chgpwd_last', type: 'date', dateFormat:'Y-m-d', mapping: 'chgpwd_last'},
	{name: 'chgpwd_next', type: 'date', dateFormat:'Y-m-d', mapping: 'chgpwd_next'},
	{name: 'user', type: 'string', mapping: 'user'},
	{name: 'amb', type: 'string', mapping: 'amb'},
	{name: 'chgpwd', type: 'int', mapping: 'chgpwd'},
	{name: 'ico', type: 'string', mapping: 'ico'}
    ])
    var writer = new Ext.data.JsonWriter({
	    encode: false,
	    writeAllFields: true
    })
    var ChgPwdDS = new Ext.data.GroupingStore({
	    id: 'ChgPwdDS',
	    groupField: 'host',
	    sortInfo:{field: 'user', direction: "ASC"},
	    proxy: proxy,
	    reader: reader,
	    writer: writer,
	    autoSave: true,
	    autoLoad: false,
	    remoteSort: true,
	    baseParams: {filter:'NO_FILTER',state:'All Status',env:'All',start:'0',limit:'100'},
	    listeners: {
		update: function() {this.reload()}
	    }
    })
    
    
    Amb = new Ext.data.Store({
	proxy: new Ext.data.HttpProxy({
			url: './app/queryAmb.php',
			method: 'POST'
		  }),
	reader: new Ext.data.JsonReader({   
	  root: 'Amb'
	},[
	    {name: 'ambiente', type: 'string', mapping: 'ambiente'}
	])
    });
    
    Amb.load();
    
    var csearch = new Ext.ux.grid.Search({
	position: 'top',
	searchText: '',
	align: 'left',
	width: 150,
	iconCls:'icon-search',
	mode:'remote',
	disableIndexes:['chgpwd_status','chgpwd_last','chgpwd_next','chgpwd_msg','chgpwd'],
	minChars:2,
	autoFocus:false,
	menuStyle:'checkbox',
	onTriggerSearch:function() {
	    ChgPwdDS.load()
	}
    })
    
    ChgPwdDS.on('beforeload', function(myStore) {
	var fields = [];
	csearch.menu.items.each(function(item) {
		if(item.checked) {
			fields.push(item.dataIndex);
		}
	})
	var ambiente = [];
	for (var i = 0; i <= Amb.data.length; i++) {
	    if (Ext.getCmp('btnFilter'+i).pressed === true)
		    ambiente.push(Ext.getCmp('btnFilter'+i).text);
	}
	if (ambiente == '') {
	    ambiente.push('All');
	    Ext.getCmp('btnFilter0').toggle(true);
	}
	var pwdStatus = Ext.getCmp('status').text;
	var e = Ext.encode(ambiente);
	var f = Ext.encode(fields);
	var filter = csearch.field.getValue();
	if ( filter == '' ) {
		myStore.baseParams = {filter:'NO_FILTER',state:pwdStatus,env:e,start:'0',limit:'100'};
	} else {
		myStore.baseParams = {filter:filter,state:pwdStatus,env:e,fields:f,start:'0',limit:'100'};
	}
    })

    function retNull(r) { return r ? r : '-'; }
    function formatDate(r){ return r ? r.dateFormat('d/m/Y') : '-'; }
    function chkStatus(r) {
	switch(r) {
	    case 0:
		var img = '<img src="images/green.png" width="16" height="16" Ext: qtip="Status [Success]">';
		break;
	    case 2:
		var img = '<img src="images/yellow.png" width="16" height="16" Ext: qtip="Status [Waiting first run]">';
		break;
	    case 3:
		var img = '<img src="images/black.png" width="16" height="16" Ext: qtip="Status [Unknown]">';
		break;
	    case 10:
	    case 11:
	    case 12:
	    case 13:
	    case 14:
	    case 15:
	    case 16:
		var img = '<img src="images/red.png" width="16" height="16" Ext: qtip="Status [Error]">';
		break;
	    default:
		var img = '<img src="images/black.png" width="16" height="16" Ext: qtip="Status [Unknown]">';
	}
	return img;
    }
    
    var Exec = new Ext.ux.grid.RowActions({
	header:'',
	align: 'center',
	width: 15,
	keepSelection: true,
	actions:[{
		//iconCls: 'icon-run',
		iconIndex: 'ico',
		align: 'center',
		tooltip: 'Change password now'
       }]
    });
    Exec.on({
	action: function(grid, record, action, row) {
	    if (action == 'icon-run') {
		Ext.Ajax.request({
		    url:'./app/updateChgPwd.php',
		    params : {host:record.get('host'),user:record.get('user'),updateIcon:"true",icon:"icon-loading"},
		    method : 'POST'
		})
		ChgPwdDS.reload();
		Ext.Ajax.request({
		    url:'./app/AutoPwdChange.php',
		    params : {host:record.get('host'),user:record.get('user'),auto:"false",dtExec:"false"},
		    method : 'POST',
		    success: function(response) {
			Ext.Ajax.request({
			    url:'./app/updateChgPwd.php',
			    params : {host:record.get('host'),user:record.get('user'),updateIcon:"true",icon:"icon-run"},
			    method : 'POST'
			})
			ChgPwdDS.reload();
		    }
		});
	    }
	}
    })
    
    ChgPwdAudit.superclass.constructor.call(this, {
        store: ChgPwdDS,
	loadMask: true,
	trackMouseOver: false,
	id: 'chgpwd',
	clicksToEdit: 1,
	plugins: [csearch,Exec],
        columns: [
                {id: 'host', header: "Server", dataIndex: 'host' },
		{id: 'chgpwd', header: "", width: 25, sortable: false, menuDisabled: true, dataIndex: 'chgpwd', xtype: 'booleancolumn', trueText: '<img src="images/silk/lock.png" width="16" height="16" Ext: qtip="Password auto change" />', falseText: '<img src="images/silk/lock_open.png" width="16" height="16" Ext: qtip="Password manual change" />' },
		{id: 'user', header: "Username", width: 100, sortable: true, menuDisabled: true, dataIndex: 'user' },
		{id: 'chgpwd_last', header: "Last Change", width: 110, sortable: true, menuDisabled: true, dataIndex: 'chgpwd_last', align: 'center', renderer: formatDate },
		{id: 'chgpwd_next', header: "Next Change", width: 110, sortable: true, menuDisabled: true, dataIndex: 'chgpwd_next', align: 'center', renderer: formatDate, editor: new Ext.form.DateField({format: 'd/m/Y', minValue: new Date().format('d/m/Y'), allowBlank: true}) },
		{id: 'chgpwd_msg', header: "Message", width: 350, sortable: true, menuDisabled: true, dataIndex: 'chgpwd_msg', renderer: retNull },
		{id: 'amb', hidden: true, dataIndex: 'amb' },
		{id: 'chgpwd_status', header: "", width: 25, sortable: false, menuDisabled: true, dataIndex: 'chgpwd_status', renderer: chkStatus },
		Exec
        ],
	view: new Ext.grid.GroupingView({
	    forceFit: true,
	    onLoad: Ext.emptyFn,
	    listeners: {
		beforerefresh: function(v) {
		 v.scrollTop = v.scroller.dom.scrollTop;
		 v.scrollHeight = v.scroller.dom.scrollHeight;
			 },
			 refresh: function(v) {
		 v.scroller.dom.scrollTop = v.scrollTop + 
		(v.scrollTop == 0 ? 0 : v.scroller.dom.scrollHeight - v.scrollHeight);
		}
	    },
	    groupTextTpl:'{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Users" : "User"]})',
	    getRowClass: function(row, index) {
		if ((parseInt(index) % 2) == 0)
		    return 'odd-row';
		else
		    return '';
	    }
	}),
        tbar:[],
	bbar:
	    new Ext.PagingToolbar({
		displayInfo: true,
		emptyMsg : 'No Data to display',
		pageSize: 100,
		store: ChgPwdDS
	    }),
	listeners: {
	    afterrender: function() {
		this.getColumnModel().setHidden(0, true);
		var btb = this.getTopToolbar();
		btb.add('->');
		btb.add({
		    id: 'schedbtn',
		    text: 'Schedules',
		    handler: function() {
			//Ext.getCmp('admWindow').hide();
			var schedWindow = new Ext.Window({
				id: 'schedwin',
				title: 'Job Scheduler',
				closable:true,
				border:true,
				plain:true,
				layout: 'fit',
				modal: true,
				draggable: true,
				frame: true,
				resizable: false,
				constrain: true,
				items: [new Scheduler()]
			})
			schedWindow.show();
		    }
		});
		btb.add('-');
		var c = 1;
		btb.add({
		    id: 'btnFilter0',
		    text: 'All',
		    enableToggle: true,
		    pressed: true,
		    handler: function() {
			for (var i = 1; i <= Amb.data.length; i++)
			    Ext.getCmp('btnFilter'+i).toggle(false);
			ChgPwdDS.load();
			this.toggle(true);
		    }
		});
		Amb.each(function(r) {
		    btb.add({
			id: 'btnFilter'+c,
			enableToggle: true,
			text: r.get('ambiente'),
			handler: function() {
			    Ext.getCmp('btnFilter0').toggle(false);
			    ChgPwdDS.load();
			}
		    });
		    c++;
		})
		btb.add('-');
		btb.add({
		    id: 'status',
		    text: 'All Status',
		    handler: function() {
			if (this.text == 'All Status') {
			    this.setText('Success');
			} else if (this.text == 'Success') {
			    this.setText('Failure');
			} else if (this.text == 'Failure') {
			    this.setText('Waiting');
			} else {
			    this.setText('All Status');
			}
			ChgPwdDS.load();
		    }
		});
		//btb.setHeight(50);
		//btb.setWidth('auto');
		btb.doLayout();
		ChgPwdDS.load();
	    }
	},
        height:380,
        width:575
    });
}
Ext.extend(ChgPwdAudit, Ext.grid.EditorGridPanel);