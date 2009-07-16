function SpeechTest() {
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		const cid = "@h5i.biz/XPCOM/ISpeech;1";
		obj = Components.classes[cid].createInstance();
		obj = obj.QueryInterface(Components.interfaces.ISpeech);
	} catch (err) {
		alert(err);
		return;
	}
    textval = document.getElementById("test").value
	obj.Speak(textval);
}
