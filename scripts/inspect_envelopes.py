import cv2, os

images = [
    ("royal-blue", r"C:\Users\zh012\.gemini\antigravity\brain\9dc9e9a6-f496-4d02-a7dc-d62feb352f0a\.user_uploaded\media_1795741396922_588860b4.jpg"),
    ("emerald-fern", r"C:\Users\zh012\.gemini\antigravity\brain\9dc9e9a6-f496-4d02-a7dc-d62feb352f0a\.user_uploaded\media_1795741417250_f77da26e.jpg"),
    ("burgundy-velvet", r"C:\Users\zh012\.gemini\antigravity\brain\9dc9e9a6-f496-4d02-a7dc-d62feb352f0a\.user_uploaded\media_1795741426559_b5dbe8d4.jpg"),
    ("magnolia-ivory", r"C:\Users\zh012\.gemini\antigravity\brain\9dc9e9a6-f496-4d02-a7dc-d62feb352f0a\.user_uploaded\media_1795741434803_a489d461.jpg")
]

for name, p in images:
    img = cv2.imread(p)
    print(name, img.shape if img is not None else "failed")
