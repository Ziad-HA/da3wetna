import cv2, numpy as np

# In 576 x 1024:
# Let's inspect where the flap seams meet the edges.
# Usually:
# Top corners: (0, 0) or close to top?
# Looking at the images:
# At the very top:
# Left seam starts at roughly (0, 0) or top edge?
# In media_1795741396922_588860b4.jpg:
# The top flap starts from roughly y=0, x=0 to x=576, y=0.
# The diagonal lines go from top-left (0,0) and top-right (576,0) down to the center wax seal (288, 490-500).

for name in ["royal-blue", "emerald-fern", "burgundy-velvet", "magnolia-ivory"]:
    img_path = rf"C:\PROGRAMMING PROJECTS\da3wetna\public\envelopes\{name}\envelope_closed.jpg"
    img = cv2.imread(img_path)
    h, w = img.shape[:2]
    print(f"--- {name} ({w}x{h}) ---")
