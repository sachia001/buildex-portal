# -*- coding: utf-8 -*-
import fitz, glob, os, sys
sys.stdout.reconfigure(encoding='utf-8')
d = os.path.join(os.path.expanduser("~"), "OneDrive", "Desktop", "ფორმები")
m = glob.glob(os.path.join(d, "BE-FM-REG*.pdf"))[0]
doc = fitz.open(m)
txt = doc[0].get_text()
# print first 600 chars to confirm Georgian + table headers present
print(txt[:700])
