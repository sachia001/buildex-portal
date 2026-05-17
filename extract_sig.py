import fitz  # PyMuPDF
from PIL import Image
import io

src = u"C:\\Users\\sachi\\OneDrive\\Desktop\\შპს ბილდექს  ექსპერტიზა\\პერსონალი\\დირექტორი\\ფაქსიმილი.pdf"
out = r"C:\BuildexPortal\client\public\signature-levan.png"

doc = fitz.open(src)
page = doc[0]
mat = fitz.Matrix(2.5, 2.5)  # ~180 dpi
pix = page.get_pixmap(matrix=mat, alpha=False)
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
img = img.convert("RGBA")

data = img.getdata()
new_data = []
for r, g, b, a in data:
    if r > 215 and g > 215 and b > 215:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append((r, g, b, 255))

img.putdata(new_data)
bbox = img.getbbox()
img = img.crop(bbox)
img.save(out, "PNG")
print("Saved:", out, "size:", img.size)
