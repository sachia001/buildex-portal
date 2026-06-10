import fitz
for name in ["BE-FM-IR — ინსპექტირების ანგარიში და დასკვნა", "BE-FM-REG — რეგისტრაციის ჟურნალი"]:
    src = rf"C:\Users\sachi\OneDrive\Desktop\ფორმები\{name}.pdf"
    doc = fitz.open(src)
    pix = doc[0].get_pixmap(dpi=100)
    out = rf"C:\BuildexPortal\scripts\sample_{name.split(' ')[0].replace('BE-FM-','')}.png"
    pix.save(out)
    print(name, "->", doc.page_count, "pages")
