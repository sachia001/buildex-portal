import fitz, sys
src = r"C:\Users\sachi\OneDrive\Desktop\ფორმები\BE-FM-APP — განცხადების ფორმა.pdf"
doc = fitz.open(src)
page = doc[0]
pix = page.get_pixmap(dpi=110)
pix.save(r"C:\BuildexPortal\scripts\sample_app.png")
print("pages:", doc.page_count, "size:", pix.width, "x", pix.height)
