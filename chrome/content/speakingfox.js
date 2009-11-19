/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is SpeakingFox.
 *
 * The Initial Developer of the Original Code is
 * Hideaki Hayashi.
 * Portions created by the Initial Developer are Copyright (C) 2008, 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

function SpeakingFox() {
  this.selectionWord = "";
  this.passHost = "chrome://speakingfox";
}

SpeakingFox.prototype = {
  load: function() {
    try {
      var target = this;
      document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function(e){target.adjustContextMenu()}, false);
      this.speaking = false;
      //init processComponent
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
      this.localFileComponent = Components.classes['@mozilla.org/file/local;1']
        .createInstance(Components.interfaces.nsILocalFile);
      this.localFileComponent.initWithPath("/usr/bin/say");
      this.hasNsiProcess2 = (Components.interfaces.nsIProcess2 != null);
      this.processComponent = Components.classes['@mozilla.org/process/util;1']
        .createInstance(this.hasNsiProcess2 ? Components.interfaces.nsIProcess2 : Components.interfaces.nsIProcess);
      this.processComponent.init(this.localFileComponent);
      //version check
      var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
        .getService(Components.interfaces.nsIXULAppInfo);
      var versionChecker = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
        .getService(Components.interfaces.nsIVersionComparator);
      this.isFF30 = (versionChecker.compare(appInfo.version, "3.5") < 0);
    } catch (err) {
      alert(err);
    }
  },

  updateCursorLoc: function(event) {
    this.rangeParent = event.rangeParent;
    this.rangeOffset = event.rangeOffset;
  },

  setSelectionWord: function(event) {
    try {
      var target = document.commandDispatcher.focusedElement;
      /* another way I found to get target that did not work in case of shortcut key.
       * I'm keeping it here just in case.
       */
      //var target = event.explicitOriginalTarget;
      var selectionString = "";
      if ((target) && 
          ((target.nodeName.toUpperCase() == "TEXTAREA") ||
           (target.nodeName.toUpperCase() == "INPUT" && target.type == "text"))){
        /* get selection from a text box */
        selectionString = target.value.substring(target.selectionStart, target.selectionEnd);
      }else{
        /* get selection from regular document */
        var selection = window.content.getSelection();
        selectionString = selection.toString()
        if(this.rangeParent && selectionString == ""){
          /* try to get word under cursor */
          var range = document.createRange();
          var rangeStart = this.rangeOffset;
          var rangeEnd = this.rangeOffset;
          var ws = /[\s\.\,\?\:\"\'\(\)]/;
          range.setStart(this.rangeParent, this.rangeOffset);
          range.setEnd(this.rangeParent, this.rangeOffset);
          // now find beginning and end of word
          while(!ws.test(range.toString()[0]) && rangeStart >= 0) {
            rangeStart--;
            if(rangeStart >= 0)
              range.setStart(this.rangeParent, rangeStart);
          }
          // move forward one char again
          rangeStart++;
          range.setStart(this.rangeParent, rangeStart);

          while(!ws.test(range.toString().substr(-1,1))) {
            rangeEnd++;
            try {
              range.setEnd(this.rangeParent, rangeEnd);
            }
            catch(ex) {
              // dunno how to figure out if rangeEnd is too big?
              break;
            }
          }
          // move back one char again
          rangeEnd--;
          range.setEnd(this.rangeParent, rangeEnd);

          selectionString = range.toString();
        }
      }
      this.selectionWord = selectionString;
    } catch (err) {
      alert(err);
    }
    return;
  },

  speak: function() {
    try {
      var args = [this.selectionWord];
      if(this.hasNsiProcess2){
        this.processComponent.runAsync(args, args.length, this);
        this.speaking = true;
      }
      else {
        try {
          this.processComponent.run(false, args, args.length); //false means non-blocking
        } catch (err) { // do nothing in case run is called more than once for same processComponent
        }
      }
    } catch (err) {
      alert(err);
    }
    return;
  },

  observe: function(subject, topic, data){
    this.speaking = false;
  },

  stop: function() {
    try {
      this.speaking = false;
      this.processComponent.kill();
    } catch (err) {
    }
    return;
  },

  onStartContextMenuSelect: function() {
    this.speak();
  },

  onStopContextMenuSelect: function() {
    this.stop();
  },

  adjustContextMenu: function() {
    if(this.hasNsiProcess2){
      document.getElementById("speakingfox-speak").hidden = this.speaking;
      document.getElementById("speakingfox-stop").hidden = !(this.speaking);
    }
    else if(this.isFF30){
      document.getElementById("speakingfox-speak").hidden = false;
      document.getElementById("speakingfox-stop").hidden = true;
    }
    else{
      document.getElementById("speakingfox-speak").hidden = false;
      document.getElementById("speakingfox-stop").hidden = false;
    }
  }
};

var gSpeakingFox = new SpeakingFox();
document.addEventListener("mousemove", function(e) { gSpeakingFox.updateCursorLoc(e); }, true);
document.addEventListener("contextmenu", function(e) { gSpeakingFox.setSelectionWord(e); }, true);
window.addEventListener("load", function(e) { gSpeakingFox.load(); }, false);
