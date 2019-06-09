import os
import cv2

for f in os.listdir("."):
    if f.endswith(".jpg"):
        im = cv2.imread(f)
        if im.shape[0] > 2048:
            im = cv2.resize(im, (2048, 2048))
            cv2.imwrite(f, im)
