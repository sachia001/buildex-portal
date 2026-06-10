# -*- coding: utf-8 -*-
import fitz, glob, os
d = os.path.join(os.path.expanduser("~"), "OneDrive", "Desktop", "ფორმები")
for t in ["BE-FM-REG", "BE-FM-IR ", "BE-FM-CALC"]:
    matches = glob.glob(os.path.join(d, t + "*.pdf"))
    if not matches:
        print("MISSING", t); continue
    doc = fitz.open(matches[0])
    pix = doc[0].get_pixmap(dpi=100)
    safe = t.strip().replace("BE-FM-","")
    pix.save(os.path.join(r"C:\BuildexPortal\scripts", "v_"+safe+".png"))
    print(t.strip(), "pages:", doc.page_count)
