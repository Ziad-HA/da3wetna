import cv2, os, numpy as np

# Let's inspect the seal centers and radii:
# In each 576x1024 image, seal is around (288, ~500)
# Let's test a circle around (288, 500) with r=60..70

out_dir = r"C:\PROGRAMMING PROJECTS\da3wetna\scripts\crops"

data = {
    "royal-blue": {"cx": 288, "cy": 486, "r": 62, "flap_tip": 500},
    "emerald-fern": {"cx": 289, "cy": 505, "r": 60, "flap_tip": 520},
    "burgundy-velvet": {"cx": 288, "cy": 498, "r": 63, "flap_tip": 515},
    "magnolia-ivory": {"cx": 290, "cy": 502, "r": 58, "flap_tip": 518},
}

for name, info in data.items():
    img_path = rf"C:\PROGRAMMING PROJECTS\da3wetna\public\envelopes\{name}\envelope_closed.jpg"
    img = cv2.imread(img_path)
    cx, cy, r = info["cx"], info["cy"], info["r"]
    
    # Extract seal with alpha mask (feathered circle)
    h, w = img.shape[:2]
    seal_rgba = np.zeros((2*r + 20, 2*r + 20, 4), dtype=np.uint8)
    crop = img[cy - r - 10 : cy + r + 10, cx - r - 10 : cx + r + 10]
    
    # Create mask for circular seal
    mask = np.zeros((crop.shape[0], crop.shape[1]), dtype=np.uint8)
    cv2.circle(mask, (r + 10, r + 10), r, 255, -1)
    # blur mask edge slightly for soft realistic cut
    mask = cv2.GaussianBlur(mask, (5, 5), 0)
    
    seal_rgba[:, :, :3] = crop
    seal_rgba[:, :, 3] = mask
    
    seal_out = rf"C:\PROGRAMMING PROJECTS\da3wetna\public\envelopes\{name}\seal.png"
    cv2.imwrite(seal_out, seal_rgba)
    print(f"Saved {name} seal.png")
