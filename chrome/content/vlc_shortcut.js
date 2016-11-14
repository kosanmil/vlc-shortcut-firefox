/**
* Holds the following functions:
* linkClickListener(event) - event listener for the Window's click event
* onPopupShowing(event) - event listener for the context menu's popup showing event.
* init() - adds the above event listeners to their appropriate events.
*/
var vlcMenuItem = {

	/**
	* Used as an Event Listener for the window element on "load".
	* Adds the onPopupShowing event listener to the context menu's popupShowing event
	* and linkClickListener event listener to the window's click event
	*/
	init : function() {
		var contentAreaContextMenu = document.getElementById("contentAreaContextMenu");
		if (contentAreaContextMenu)
			contentAreaContextMenu.addEventListener("popupshowing", vlcMenuItem.onPopupShowing, false);

		window.addEventListener("click", vlcMenuItem.linkClickListener, false);
	},

	/**
	* Link click listener. Listens for the middle mouse click on youtube link
	* (that do not contain only '#' in the href)
	*/
	linkClickListener : function(e) {
		//Is middle mouse button clicked
		if(e.which !== 2)
			return;

		var link = $(e.target).closest('a');
		if(!link.length || link.attr('href') === '#')
			return;

		var url = link[0].href;
		//Is it a youtube url
		if(ytVidId(url) === false)
			return;

		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.vlc_shortcut.");
		var action;

		if(e.ctrlKey)
			action = prefs.getIntPref("ctrlmiddleclick");
		else if(e.shiftKey)
			action = prefs.getIntPref("shiftmiddleclick");
		else
			action = prefs.getIntPref("middleclick");

		if(action === 1){
			//Play video
			e.preventDefault();
			e.stopPropagation();
			vlcProcess.playVideo(url);
		}
		else if (action === 2) {
			//Enqueue video
			e.preventDefault();
			e.stopPropagation();
			vlcProcess.enqueueVideo(url);
		}
	},

	/**
	* Used as an Event Listener for the context menu on "popupshowing".
	* Initialises the "hidden" state of the context-menu buttons
	* depending on the location of the context-menu click.
	*/
	onPopupShowing : function(event) {
		var vlc_play = document.getElementById("vlc_play");
		var vlc_enqueue = document.getElementById("vlc_enqueue");
		var vlc_playLink = document.getElementById("vlc_play_link");
		var vlc_enqueueLink = document.getElementById("vlc_enqueue_link");

		var youtubeURL = false;

		//Is the context menu created on a youtube link
		if (gContextMenu.linkURL) {
			youtubeURL = ytVidId(gContextMenu.linkURL);
			if (youtubeURL === false) {
				vlc_playLink.hidden = true;
				vlc_enqueueLink.hidden = true;
			}
			else {
				vlc_playLink.hidden = false;
				vlc_enqueueLink.hidden = false;
			}
		}
		else {
			vlc_playLink.hidden = true;
			vlc_enqueueLink.hidden = true;
		}

		//Is the current page a youtube video
		youtubeURL = ytVidId(gBrowser.contentDocument.location.href);
		if (youtubeURL === false) {
			vlc_play.hidden = true;
			vlc_enqueue.hidden = true;
		}
		else {
			vlc_play.hidden = false;
			vlc_enqueue.hidden = false;
		}
	}
}

/**
* Holds the following functions:
* initProcess() - initializes the information for the VLC process needed for running the player.
* playVideo(url) - plays the video from the URL
* enqueueVideo(url) - enqueues the video from the URL
* getPlayerFilepath() - gets the filepath of the player, either from the preferences, or from a default location (depends on OS).
*/
var vlcProcess = {

	/**
	* Initialises the process to call.
	* Adds the command path to the process
	*/
	initProcess : function() {
		vlcProcess.process = Components.classes["@mozilla.org/process/util;1"]
			.createInstance(Components.interfaces.nsIProcess);
		vlcProcess.file = Components.classes["@mozilla.org/file/local;1"]
			.createInstance(Components.interfaces.nsILocalFile);

		var path = vlcProcess.getPlayerFilepath();
		vlcProcess.file.initWithPath(path);

		if(vlcProcess.file.exists()){
			vlcProcess.process.init(vlcProcess.file);
		}
		else {
			var title = "VLC Shortcut";
			var stringBundle = Components.classes["@mozilla.org/intl/stringbundle;1"]
                                    .getService(Components.interfaces.nsIStringBundleService)
                                    .createBundle('chrome://vlc_shortcut/locale/vlc_shortcut.properties');
			var message = stringBundle.GetStringFromName("error.playerNotFound");
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			prompts.alert(null, title, message);
			return false;
		}

		return true;
	},

	playVideo : function(url) {
		var prefsh = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.vlc_shortcut.");
		var selectedValue = prefsh.getIntPref("vq");
		var initSuccessful = vlcProcess.initProcess();
		if(!initSuccessful){
			return;
		}

		var args = [];
		var OS = Services.appinfo.OS;
		if(OS == "Darwin"){
			if(selectedValue){
				args[0] = "--preferred-resolution=" + selectedValue.toString();
				url = vlcProcess.changeHttpsToHttp(url);
				args[1] = url;
			}else{
				url = vlcProcess.changeHttpsToHttp(url);
				args[0] = url;
			}
		}else{
			if(selectedValue){
				args[0] = "--one-instance";
				args[1] = "--preferred-resolution=" + selectedValue.toString();
				url = vlcProcess.changeHttpsToHttp(url);
				args[2] = url;
			}else{
				args[0] = "--one-instance";
				url = vlcProcess.changeHttpsToHttp(url);
				args[1] = url;
			}
		}

		try {
			vlcProcess.process.run(false, args, args.length);
		} catch(err) {
			var errorMsg = "Error: " + err.message;
			alert(errorMsg);
		}

	},

	enqueueVideo : function(url) {
		var initSuccessful = vlcProcess.initProcess();
		if(!initSuccessful){
			return;
		}

		var args = [];
		var OS = Services.appinfo.OS;
		if(OS == "Darwin"){
			url = vlcProcess.changeHttpsToHttp(url);
			args[0] = url;
		}else{
			args[0] = "--one-instance";
			args[1] = "--playlist-enqueue";

			url = vlcProcess.changeHttpsToHttp(url);
			args[2] = url;
		}

		try {
			vlcProcess.process.run(false, args, args.length);
		} catch(err) {
			var errorMsg = "Error: " + err.message;
			alert(errorMsg);
		}
	},

	getPlayerFilepath : function() {
		var prefsBranch = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.vlc_shortcut.");
		var filepath = prefsBranch.getCharPref("vlc_filepath");
		if(filepath === ""){
			var OS = Services.appinfo.OS;
			if(OS == "Linux"){
				filepath = "/usr/bin/vlc";
			}
			else if(OS == "WINNT"){

				var file = Components.classes["@mozilla.org/file/local;1"]
						.createInstance(Components.interfaces.nsILocalFile);
				//trying path for 32-bit Windows
				file.initWithPath("C:\\Program Files\\VideoLAN\\VLC\\vlc.exe");
				if(file.exists()){
					filepath = "C:\\Program Files\\VideoLan\\VLC\\vlc.exe";
				}
				//trying path for 64-bit Windows
				else {
					file.initWithPath("C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe");
					if(file.exists()){
						filepath = "C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe";
					}
				}
			}
			else if(OS == "Darwin"){
				var file = Components.classes["@mozilla.org/file/local;1"]
						.createInstance(Components.interfaces.nsILocalFile);

				file.initWithPath("/Applications/VLC.app/Contents/MacOS/VLC");
				if(file.exists()){
					filepath = "/Applications/VLC.app/Contents/MacOS/VLC";
				}
			}
			prefsBranch.setCharPref("vlc_filepath", filepath);
		}
		return filepath;
	},

	changeHttpsToHttp : function(url) {
		//Getting rid of the https part of the URL, because VLC does not process it well.
		//Thanks to Mozilla user 'lunchboffin'
		if(url.substring(0, 5) == 'https')
			url = 'http' + url.substring(5);

		return url;
	}
}

/**
 * JavaScript function to match (and return) the video Id
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 * modified to include m.youtube and youtube-nocookie.com domains
 */
function ytVidId(url) {
	var ytRegex = /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	return (url.match(ytRegex)) ? RegExp.$1 : false;
}


window.addEventListener("load", vlcMenuItem.init, false);
