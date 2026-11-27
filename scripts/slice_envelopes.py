import cv2, os, numpy as np

# Let's inspect the 4 images and generate:
# 1. flap.png (top triangle with transparent background)
# 2. pocket.png (the rest of the envelope with transparent top V-notch)
# 3. back_liner.jpg (inside of envelope)
# 4. seal.png (already created, let's make sure it is clean)

images = {
    "royal-blue": {"apex_y": 486, "liner_color": (35, 20, 15)},
    "emerald-fern": {"apex_y": 505, "liner_color": (30, 45, 25)},
    "burgundy-velvet": {"apex_y": 498, "liner_color": (35, 15, 30)},
    "magnolia-ivory": {"apex_y": 502, "liner_color": (230, 225, 215)},
}

for name, info in images.items():
    env_dir = rf"C:\PROGRAMMING PROJECTS\da3wetna\public\envelopes\{name}"
    img = cv2.imread(os.path.join(env_dir, "envelope_closed.jpg"))
    h, w = img.shape[:2]
    apex_y = info["apex_y"]
    
    # 1. Top Flap: polygon (0,0) -> (w,0) -> (w/2, apex_y)
    flap_mask = np.zeros((h, w), dtype=np.uint8)
    pts_flap = np.array([[0, 0], [w, 0], [w // 2, apex_y]], dtype=np.int32)
    cv2.fillPoly(flap_mask, [pts_flap], 255)
    
    flap_rgba = np.zeros((h, w, 4), dtype=np.uint8)
    flap_rgba[:, :, :3] = img
    flap_rgba[:, :, 3] = flap_mask
    # crop to just the flap height (0 to apex_y + 2)
    flap_crop = flap_rgba[0 : apex_y + 5, :]
    cv2.imwrite(os.path.join(env_dir, "flap.png"), flap_crop)
    
    # 2. Pocket (body): the rest
    pocket_mask = np.zeros((h, w), dtype=np.uint8)
    pts_pocket = np.array([[0, 0], [w // 2, apex_y], [w, 0], [w, h], [0, h]], dtype=np.int32)
    cv2.fillPoly(pocket_mask, [pts_pocket], 255)
    
    pocket_rgba = np.zeros((h, w, 4), dtype=np.uint8)
    pocket_rgba[:, :, :3] = img
    pocket_rgba[:, :, 3] = pocket_mask
    cv2.imwrite(os.path.join(env_dir, "pocket.png"), pocket_rgba)
    
    # 3. Inside liner (back wall):
    # A rich textured background based on blurred/darkened envelope texture with luxury gold border
    liner = img.copy()
    # Darken and add luxury inner shadow
    liner = cv2.GaussianBlur(liner, (45, 45), 0)
    liner = cv2.convertScaleAbs(liner, alpha=0.75, beta=10)
    cv2.imwrite(os.path.join(env_dir, "liner.jpg"), liner)
    
    print(f"Processed {name}: flap={flap_crop.shape}, pocket={pocket_rgba.shape}")
