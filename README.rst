VLC Youtube Shortcut Firefox Extension
=======

This is a firefox extension to quickly play or enqueue a Youtube video into VLC player with the context (popup) menu or with the middle mouse click.

Installation
------------

To install the newest version deployed on the official Firefox add-on website, go to this link: https://addons.mozilla.org/en-us/firefox/addon/vlc-youtube-shortcut/

To install and run the extension from the repository, do the following:

1. Clone the repository. Remember the path on the filesystem where you cloned the repository.
2. Navigate to the the location where your Firefox profile is located (location depends on the operating system. Use the following article to find out where your location is: http://kb.mozillazine.org/Profile_folder_-_Firefox#Navigating_to_the_profile_folder)
3. Go to the *extensions* folder.
4. Create a textual file with the name *vlc_shortcut@kosan.kosan* (without .txt).
5. Write the path to the file where the cloned repository is located.
6. Run Firefox. You should be asked if you want to verify the installation of the add-on, which will require a restart of the browser. After that, the extension is installed.

About the extension
---------------

The following descripton is taken from the description of the add-on page.

Do you find yourself using the VLC player to watch Youtube videos more than the actual Youtube flash player, but don't want to copy-paste the URL into VLC every single time?

Now, with this add-on, you can skip the copy-pasting and window navigation and open up that Youtube video with a simple click of a button!

You can use the menu items from the context menu (the right-click popup bar) on Youtube links or on the actual Youtube page (check the screenshots for an example).

You can also use the middle click on a Youtube link to open it directly in the player. In order for that to work, you need to go to the preferences page (located in the Add-on tab of Firefox) and change the action performed on the mouse click (see screenshots for an example).

NOTE: If your VLC player is not installed in it's default folder, you will have to change the filepath of the executable file in the preferences window. The default executable filepath is:

Windows 32 bit: C:\Program Files\VideoLAN\VLC\vlc.exe
Windows 64 bit: C:\Program Files (x86)\VideoLAN\VLC\vlc.exe
Linux: /usr/bin/vlc

If you find any bugs or if you have any suggestion, please leave a comment or send me an email.