function populateSelect(svr) {
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            document.getElementById("appList"+svr).innerHTML=xmlhttp.responseText;
    }
    xmlhttp.open("GET","./app/appList.php?svr="+svr,true);
    xmlhttp.send();
}
function updateInv(svr) {
    document.getElementById("main"+svr).innerHTML = "<img src='images/loading.gif'>";
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            document.getElementById("main"+svr).innerHTML = xmlhttp.responseText;
    }
    xmlhttp.open("GET","./app/viewInv.php?host="+svr+"&update=true",true);
    xmlhttp.send();
}
function delApp(svr, swid) {
    Ext.MessageBox.confirm('Confirm', 'Tem certeza que deseja remover?'
    ,function(btn) {
        if(btn == 'yes') {
            if (window.XMLHttpRequest) {
                xmlhttp=new XMLHttpRequest();
            } else {
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange=function() {
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    var d1 = document.getElementById('div'+svr+'_'+swid);
                    d1.parentNode.removeChild(d1);
                    var d2 = document.getElementById('div'+swid+'_'+svr);
                    d2.parentNode.removeChild(d2);
                }
            }
            xmlhttp.open("GET","./app/appDel.php?svr="+svr+"&swid="+swid,true);
            xmlhttp.send();
        }
    });
}
function saveNewApp(svrID) {
    var e = document.getElementById("appList"+svrID);
    var appID = e.options[e.selectedIndex].value;
    if (appID == '') {
        alert('Select an app!');
        return;
    }
    var appName = e.options[e.selectedIndex].text;
    var appPath = document.getElementById("pathApp"+svrID).value;
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            return;
            //document.getElementById("divApp").innerHTML += xmlhttp.responseText;
    }
    xmlhttp.open("GET","./app/appAdd.php?app="+appID+'&path='+appPath+'&svr='+svrID,true);
    xmlhttp.send();
    
    var x = document.createElement('div');
    x.setAttribute('id','div'+svrID+'_'+appID);
    x.setAttribute('class','box h4 bf');
    x.innerHTML = "<a href=javascript:delApp('"+svrID+"','"+appID+"');><img Ext: qtip='Remove application' src=\'./images/rm_app.png\' width=\'12\' height=\'12\' style=\'vertical-align:middle\'></a> &nbsp;" + appName;
    document.getElementById('div'+svrID).appendChild(x);
    
    var x = document.createElement('div');
    x.setAttribute('id','div'+appID+'_'+svrID);
    x.setAttribute('class','box h4 bl');
    x.innerHTML = appPath;
    document.getElementById('div'+svrID).appendChild(x);
    toggleApp(svrID);
}
function toggleApp(svr) {
    if (document.getElementById("selApp"+svr).style.display == 'none') {
        document.getElementById("selApp"+svr).style.display = "block";
        document.getElementById("addImg"+svr).src = "./images/minus.png";
        populateSelect(svr);
    } else {
        document.getElementById("selApp"+svr).style.display = "none";
        document.getElementById("addImg"+svr).src = "./images/add_app.png";
    }
}