import cv2, os, numpy as np

# Let's crop a center region y: 400..600, x: 150..426
images = [
    ("royal-blue", r"C:\Users\zh012\.gemini\antigravity\brain\9dc9e9a6-f496-4d02-a7dc-d62feb352f0a\.user_uploaded\media_1795741396922_588860b4.jpg"),
    ("emerald-fern", r"C:\Users\zh012\.gemini\antigravity\brain\9dc9e9a6-f496-4d02-a7dc-d62feb352f0a\.user_uploaded\media_1795741417250_f77da26e.jpg"),
    ("burgundy-velvet", r"C:\Users\zh012\.gemini\antigravity\brain\9dc9e9a6-f496-4d02-a7dc-d62feb352f0a\.user_uploaded\media_1795741426559_b5dbe8d4.jpg"),
    ("magnolia-ivory", r"C:\Users\zh012\.gemini\antigravity\brain\9dc9e9a6-f496-4d02-a7dc-d62feb352f0a\.user_uploaded\media_1795741434803_a489d461.jpg")
]

out_dir = r"C:\PROGRAMMING PROJECTS\da3wetna\scripts\crops"
os.makedirs(out_dir, exist_ok=True)

for name, p in images:
    img = cv2.imread(p)
    h, w = img.shape[:2]
    # save full scaled version in public/envelopes/
    target_dir = os.path.join(r"C:\PROGRAMMING PROJECTS\da3wetna\public\envelopes", name)
    os.makedirs(target_dir, exist_ok=True)
    cv2.imwrite(os.path.join(target_dir, "envelope_closed.jpg"), img, [cv2.IMWRITE_JPEG_QUALITY, 92])
    
    # center crop around seal
    seal_crop = img[400:600, 150:426]
    cv2.imwrite(os.path.join(out_dir, f"{name}_seal_region.jpg"), seal_crop)
    print(f"Saved {name}")
