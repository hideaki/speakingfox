#include "nsIGenericFactory.h"
#include "Speech.h"

NS_GENERIC_FACTORY_CONSTRUCTOR(Speech)

static nsModuleComponentInfo components[] =
{
    {
       SPEECH_CLASSNAME, 
       SPEECH_CID,
       SPEECH_CONTRACTID,
       SpeechConstructor,
    }
};

NS_IMPL_NSGETMODULE("SpeechModule", components) 

