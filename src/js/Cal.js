function whichBrs() {
	var agt=navigator.userAgent.toLowerCase();
	if (agt.indexOf("opera") != -1) return 'Opera';
	if (agt.indexOf("staroffice") != -1) return 'Star Office';
	if (agt.indexOf("webtv") != -1) return 'WebTV';
	if (agt.indexOf("beonex") != -1) return 'Beonex';
	if (agt.indexOf("chimera") != -1) return 'Chimera';
	if (agt.indexOf("netpositive") != -1) return 'NetPositive';
	if (agt.indexOf("phoenix") != -1) return 'Phoenix';
	if (agt.indexOf("firefox") != -1) return 'Firefox';
	if (agt.indexOf("safari") != -1) return 'Safari';
	if (agt.indexOf("skipstone") != -1) return 'SkipStone';
	if (agt.indexOf("msie") != -1) return 'Internet Explorer';
	if (agt.indexOf("netscape") != -1) return 'Netscape';
	if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
	if (agt.indexOf('\/') != -1) {
	if (agt.substr(0,agt.indexOf('\/')) != 'mozilla') {
	return navigator.userAgent.substr(0,agt.indexOf('\/'));}
	else return 'Netscape';} else if (agt.indexOf(' ') != -1)
	return navigator.userAgent.substr(0,agt.indexOf(' '));
	else return navigator.userAgent;
}
function ShowPopup(overID, dID) {
	hp = document.getElementById(dID);
	var Browser = whichBrs();
	if (Browser == 'Mozilla' || Browser == 'Firefox')
		o = document.getElementById(overID);
	else
		o = overID;
	if ((typeof(hp) != 'undefined') && (hp != null)) {
		hp.style.top = o.offsetTop + 18;
		hp.style.left = o.offsetLeft + 20;
		hp.style.visibility = "Visible";
	}
}

function HidePopup(dID) {
	hp = document.getElementById(dID);
	if ((typeof(hp) != 'undefined') && (hp != null))
		hp.style.visibility = "Hidden";
}
function DoM(dYear) {
	var isLeap = (((dYear % 4 == 0) && (dYear % 100 != 0)) || (dYear % 400 == 0));
	this[0] = 31;
	if (isLeap) this[1] = 29; else this[1] = 28;
	this[2] = 31;
	this[3] = 30;
	this[4] = 31;
	this[5] = 30;
	this[6] = 31;
	this[7] = 31;
	this[8] = 30;
	this[9] = 31;
	this[10] = 30;
	this[11] = 31;
}
function convMonthName(m) {
	switch(m) {
		case 1: return "Janeiro";
		case 2: return "Fevereiro";
		case 3: return "Mar&ccedil;o";
		case 4: return "Abril";
		case 5: return "Maio";
		case 6: return "Junho";
		case 7: return "Julho";
		case 8: return "Agosto";
		case 9: return "Setembro";
		case 10: return "Outubro";
		case 11: return "Novembro";
		case 12: return "Dezembro";
	}
}
function mDays(y,m){
	var aDays = new DoM(y);
	return aDays[m];
}

function Cal(y) {
	var Browser = whichBrs();
	if (Browser == "Internet Explorer") {
		document.write("Aplicação não compativel com Internet Explorer");
		exit;
	}
	document.write("<table border='1' cellpadding='4' cellspacing='4'>");
	var count = 4;
	for (var iMonth = 1; iMonth <= 12; iMonth++) {
		if (count == 4) {
			document.write("<tr>");
			count = 0;
		}
		document.write("<td>");
		document.write("<table border=0 cellpadding='1' cellspacing='4'><tr><th colspan='7' bgcolor='#C0C0C0'><font size=2 face=Verdana>"+ convMonthName(iMonth) +"</font></th></tr><tr>");
		document.write("<th><font size=2 face=Verdana>D</font></th>");
		document.write("<th><font size=2 face=Verdana>S</font></th>");
		document.write("<th><font size=2 face=Verdana>T</font></th>");
		document.write("<th><font size=2 face=Verdana>Q</font></th>");
		document.write("<th><font size=2 face=Verdana>Q</font></th>");
		document.write("<th><font size=2 face=Verdana>S</font></th>");
		document.write("<th><font size=2 face=Verdana>S</font></th>");
		document.write("<tr>");
		var cols = 0;
		var today = new Date();
		var tD = today.getDate();
		var tM = today.getMonth()+1;
		var tY = today.getFullYear();
		var today = tM + "_" + tY + tM + tD;
		for (var iDay = 1; iDay <= mDays(y, iMonth-1); iDay++) {
			var tDate = new Date(y+", "+iMonth+", "+iDay+", 12:00:00");
			tDate = tDate.getDay();
			if (tDate == 0)
				document.write("<tr>");
			var x = 0;
			while (x < tDate && iDay == 1) {
				document.write("<td></td>");
				x++;
			}
			if (tDate == 0) c = "color='red'"; else c = "color=black";
			var tmpID = iMonth + "_" + y + iMonth + iDay;
			if (today == tmpID)
				day = "<b>" + iDay + "</b>";
			else
				day = iDay;
			document.write("<td align=center id='"+tmpID+"_td' width='20' class='tCell' onMouseOver=javascript:ShowPopup('"+tmpID+"_td','"+tmpID+"_pop'); OnMouseOut=javascript:HidePopup('"+tmpID+"_pop')><div id="+tmpID+"></div><font id='"+tmpID+"_ft' size=2 face=Verdana " + c + ">" + day +"</font></td>");
			if (tDate == 6) {
				document.write("</tr>");
				cols++;
			}
			if ((iDay == mDays(y, iMonth-1) && cols != 5) || (iDay == mDays(y, iMonth-1) && tDate == 6))
				document.write("<tr><td colspan=7>&nbsp;</td></tr>");
		}
		document.write("</tr></table>");
		document.write("</td>");
		count++;
		if (count == 4) {
			document.write("</tr>");
			count = 0;
		}
	}
}
function prtColor(strDate, endDate, cor, slice, zind, uname) {
	var dt = new Date(strDate.substring(0,4)+", "+strDate.substring(5,7)+", "+strDate.substring(8,10)+", 12:00:00");
	var d = dt.getDate();
	var m = dt.getMonth()+1;
	var y = dt.getFullYear();
	var dtf = new Date(endDate.substring(0,4)+", "+endDate.substring(5,7)+", "+endDate.substring(8,10)+", 12:00:00");
	var df = dtf.getDate();
	var mf = dtf.getMonth()+1;
	var yf = dtf.getFullYear();
	sDate = y + "" + m + "" + d;
	eDate = yf + "" + mf + "" + df;
	var chkCont = 0;
	while (chkCont != 1) {
		if (sDate == eDate)
			chkCont = 1;
		if (d == mDays(y,m-1)) {
			var nDiv = document.createElement("div");
			nDiv.setAttribute('style','position:absolute; width:'+slice+'px; float: left; height:20px; background-color:'+cor+'; z-index:-'+zind+';');
			nDiv.setAttribute('id', m+'_'+sDate+'_'+zind+'_i');
			document.getElementById(m+"_"+sDate).appendChild(nDiv);
			var element =  document.getElementById(m+'_'+sDate+'_pop');
			if ((typeof(element) != 'undefined') && (element != null)) {
				var pDiv = document.getElementById(m+'_'+sDate+'_pop');
				pDiv.innerHTML += '<li>' + uname + '</li>';
			} else {
				var pDiv = document.createElement("div");
				pDiv.setAttribute('align', 'left');
				pDiv.setAttribute('style', 'width: 150px; padding: 2px; border: 1 solid black; margin:1px; font: bold 12px "Trebuchet MS", Verdana, Arial, Helvetica,sans-serif; opacity:0.95; filter:alpha(opacity=95); visibility:hidden; position:absolute; top:10; left:10; background:#C0C0C0; z-index: 1');
				pDiv.setAttribute('id', m+'_'+sDate+'_pop');
				pDiv.innerHTML = '<u>Plantonistas</u><br>';
				pDiv.innerHTML += '<li>' + uname + '</li>';
				document.getElementById(m+"_"+sDate).appendChild(pDiv);
			}
			//document.getElementById(m+"_"+sDate).style.backgroundColor = cor;
			//document.getElementById(m+"_"+sDate).setAttribute('class','dColor');
			d = 1;
			if (m < 12) {
				m++;
			} else {
				m = 1;
				y++;
			}
			sDate = y + "" + m + "" + d;
		} else {
			d++;
			var nDiv = document.createElement("div");
			nDiv.setAttribute('style','position:absolute; width:'+slice+'px; float: left; height:20px; background-color:'+cor+'; z-index:-'+zind+';');
			nDiv.setAttribute('id', m+'_'+sDate+'_'+zind+'_i');
			document.getElementById(m+"_"+sDate).appendChild(nDiv);
			var element =  document.getElementById(m+'_'+sDate+'_pop');
			if ((typeof(element) != 'undefined') && (element != null)) {
				var pDiv = document.getElementById(m+'_'+sDate+'_pop');
				pDiv.innerHTML += '<li>' + uname + '</li>';
			} else {
				var pDiv = document.createElement("div");
				pDiv.setAttribute('align', 'left');
				pDiv.setAttribute('style', 'width: 200px; padding: 2px; border: 1 solid black; margin:1px; font: bold 12px "Trebuchet MS", Verdana, Arial, Helvetica,sans-serif; color:white; opacity:0.9; filter:alpha(opacity=90); visibility:hidden; position:absolute; top:10; left:10; background:#000000; z-index: 1');
				pDiv.setAttribute('id', m+'_'+sDate+'_pop');
				pDiv.innerHTML = '<u>Plantonistas</u><br>';
				pDiv.innerHTML += '<li>' + uname + '</li>';
				document.getElementById(m+"_"+sDate).appendChild(pDiv);
			}
			//document.getElementById(m+"_"+sDate).style.backgroundColor = cor;
			//document.getElementById(m+"_"+sDate).setAttribute('class','dColor');
			sDate = y + "" + m + "" + d;
		}
	}
}