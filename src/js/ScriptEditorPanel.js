ScrEditor = function() {
    function loadURL(url) {
        var oRequest = new XMLHttpRequest();
        oRequest.open('GET', url, false);
        oRequest.send(null)
        return oRequest.responseText;
    };
    
    var scriptTab = new Ext.form.FormPanel({
	    id: 'scriptForm',
	    //title: '',
	    items: [
		    {
			    xtype: 'combo',
			    id: 'cbo1',
			    store:
				    new Ext.data.Store({
					    id: 'Files',
					    autoLoad: true,
					    proxy: new Ext.data.HttpProxy({
						    url: './app/scriptEditor.php?do=readFiles',
						    method: 'GET'
					    }),
					    reader: new Ext.data.JsonReader({  
						    root: 'Files'
					    },
					    [
						    {name: 'file', type: 'string', mapping: 'file'}
					    ])
				    }),
			    displayField: 'file',
			    valueField: 'file',
			    hideLabel: false,
			    fieldLabel: 'Script to edit',
			    editable: false,
			    forceSelection: true,
			    triggerAction: 'all',
			    emptyText:'Select a script...',
			    listeners: {
				    select: function() {
					    var script = loadURL('./app/scriptEditor.php?do=read&fname='+this.getValue());
					    var txtArea = Ext.getCmp('scriptCode');
					    txtArea.setValue(script);
					    var dCd = Ext.select("div.CodeMirror", true);
					    dCd.remove();
					    var cm = CodeMirror.fromTextArea(document.getElementById('scriptCode'), {
							mode: 'shell',
							lineNumbers: true,
							lineWrapping: true,
							matchBrackets: true,
							styleActiveLine: true
					    })
					    cm.setSize(765,435);
					    cm.on('change', function() {
							cm.save();
							Ext.getCmp('svscrbtn').enable();
					    })
					    cm.on('gutterClick', function(instance, line, gutter, clickEvent) {
							cm.setSelection({line:line,ch:0},{line:line,ch:null});
					    })
				    }
			    }
		    },
		    {
			    xtype: 'textarea',
			    id: 'scriptCode',
			    grow: false,
			    hideLabel: true,
			    layout: 'form',
			    hidden: true
		    }
	    ],
	    buttons: [
		    {
			    text: 'Save',
			    id: 'svscrbtn',
			    disabled: true,
			    handler: function(){
					if(scriptTab.getForm().isValid()){
					    var file = Ext.getCmp('cbo1').getValue();
						scriptTab.getForm().submit({
						    url: './app/scriptEditor.php?do=write&fname='+file,
						    method: 'POST'
					    })
						Ext.ux.Toast.msg('Script saved', file + ' changed');
						Ext.getCmp('svscrbtn').disable();
				    }
			    }
		    }
	    ]
    })
    
    ScrEditor.superclass.constructor.call(this, {
        title: 'Script Editor',
        layout: 'fit',
        items: [
            scriptTab
        ]
    });
}
Ext.extend(ScrEditor, Ext.Panel);