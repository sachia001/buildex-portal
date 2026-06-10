# -*- coding: utf-8 -*-
import fitz, glob, os
d = os.path.join(os.path.expanduser("~"), "OneDrive", "Desktop", "ფორმები")
m = glob.glob(os.path.join(d, "BE-FM-AUDIT-CHECK*.pdf"))[0]
doc = fitz.open(m)
doc[0].get_pixmap(dpi=100).save(r"C:\BuildexPortal\scripts\qa_auditcheck.png")
print("pages", doc.page_count)
