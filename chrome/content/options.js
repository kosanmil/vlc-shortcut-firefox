function commandMiddleClick(source) {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService)
		.getBranch("extensions.vlc_shortcut.");
	prefs.setIntPref("middleclick", source.value);
	return true;
}

function commandCtrlMiddleClick(source) {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService)
		.getBranch("extensions.vlc_shortcut.");
	prefs.setIntPref("ctrlmiddleclick", source.value);
	return true;
}

function commandShiftMiddleClick(source) {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService)
		.getBranch("extensions.vlc_shortcut.");
	prefs.setIntPref("shiftmiddleclick", source.value);
	return true;
}

/**
* Function for browsing the filepath of the process to call 
* when the vlcProcess.playVideo and vlcProcess.enqueueVideo are called
* The filepath must point to a command or an executable file (depending on the Operating System).
*/
function browseFilePath(){

	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var nsILocalFile = Components.interfaces.nsILocalFile;
	var filePicker = Components.classes["@mozilla.org/filepicker;1"]
	           .createInstance(nsIFilePicker);
	filePicker.init(window, "Browse", nsIFilePicker.modeOpen);
	filePicker.appendFilters(nsIFilePicker.filterAll);
	
	var retVal = filePicker.show();
	if (retVal == nsIFilePicker.returnOK ) {
		var pickedFile = filePicker.file.QueryInterface(nsILocalFile);
		if (pickedFile.isExecutable() && pickedFile.isFile()) {
			var prefsFilePicker = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.vlc_shortcut.");
			prefsFilePicker.setComplexValue("vlc_filepath", nsILocalFile, pickedFile);
		}
		else {
			alert(document.getElementById("vlc_shortcut_stringBundle").getString("error.executableFile"));
		}
	}
}