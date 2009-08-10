ZIP = zip

XPT_FILE_SRC = xpcom/src/ISpeech.xpt
XPT_FILE_SRC_SRC = xpcom/src/ISpeech.idl
XPT_FILE = components/ISpeech.xpt
DYLIB_FILE = components/libISpeech.dylib
DYLIB_FILE_SRC = xpcom/src/libISpeech.dylib
DYLIB_FILE_SRC_SRC = xpcom/src/ISpeech.idl xpcom/src/Speech.cpp xpcom/src/Speech.h xpcom/src/SpeechModule.cpp

FILES = install.rdf chrome.manifest chrome/content/speakingfox.js chrome/content/speakingfox.xul defaults/preferences/speakingfox.js

TARGET = speakingfox.xpi

$(TARGET): $(FILES)
	$(ZIP) -r $(TARGET) $(FILES)

$(XPT_FILE): $(XPT_FILE_SRC)
	cp $(XPT_FILE_SRC) $(XPT_FILE)

$(XPT_FILE_SRC): $(XPT_FILE_SRC_SRC)
	cd xpcom/src; make

$(DYLIB_FILE): $(DYLIB_FILE_SRC)
	cp $(DYLIB_FILE_SRC) $(DYLIB_FILE)

$(DYLIB_FILE_SRC): $(DYLIB_FILE_SRC_SRC)
	cd xpcom/src; make

clean: 
	rm $(TARGET) $(DYLIB_FILE) $(XPT_FILE); cd xpcom/src; make clean
