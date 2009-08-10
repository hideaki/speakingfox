ZIP = zip

FILES = install.rdf chrome.manifest chrome/content/speakingfox.js chrome/content/speakingfox.xul defaults/preferences/speakingfox.js

TARGET = speakingfox.xpi

$(TARGET): $(FILES)
	$(ZIP) -r $(TARGET) $(FILES)

clean: 
	rm $(TARGET)
