#include <stdio.h>
#include <stdlib.h>
#include "Speech.h"

NS_IMPL_ISUPPORTS1(Speech, ISpeech)

Speech::Speech()
{
  /* member initializers and constructor code */
}

Speech::~Speech()
{
  /* destructor code */
}

/* void Speak (in string a); */
NS_IMETHODIMP Speech::Speak(const char *a)
{
  static char buf[4000];
  snprintf(buf, 4000, "say \"%s\"", a);
  system(buf);
  return NS_OK;
}

