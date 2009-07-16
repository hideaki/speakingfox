#include "ISpeech.h"

#define SPEECH_CONTRACTID "@h5i.biz/XPCOM/ISpeech;1"
#define SPEECH_CLASSNAME "Converts text to audible speech on Mac OS X"
#define SPEECH_CID \
  {0x71a8fc42, 0x8e3c, 0x412f, \
    { 0x8d, 0xb8, 0x45, 0xff, 0x57, 0x3b, 0xef, 0x22 }}

class Speech : public ISpeech
{
public:
  NS_DECL_ISUPPORTS
  NS_DECL_ISPEECH

  Speech();

private:
  ~Speech();

protected:
  /* additional members */
};

