import cv2
import numpy as np
import os
import HandTrackingModule as htm
from flask import Blueprint, render_template
from tensorflow.keras.models import load_model
import keyboard
import pygame
import time
import sys
import requests
from reportlab.pdfgen import canvas

VirtualPainter = Blueprint("HandTrackingModule", __name__, static_folder="static", template_folder="templates")

# ✅ Global buffer to store the recognized word
buffer = ""

@VirtualPainter.route("/feature")
def strt():
    global buffer  # Access global buffer

    # Color Definitions
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)
    RED = (0, 0, 255)
    GREEN = (0, 255, 0)
    YELLOW = (0, 255, 255)
    BACKGROUND = (255, 255, 255)
    FORGROUND = (0, 255, 0)
    BORDER = (0, 255, 0)

    # Initialize OpenCV
    cap = cv2.VideoCapture(0)
    width, height = int(cap.get(3)), int(cap.get(4))
    cap.set(3, width)
    cap.set(4, height)

    imgCanvas = np.zeros((height, width, 3), dtype=np.uint8)

    # Initialize Pygame
    pygame.init()
    DISPLAYSURF = pygame.display.set_mode((width, height), flags=pygame.HIDDEN)
    pygame.display.set_caption("Digit Board")

    # Load Model
    AlphaMODEL = load_model("my_model.keras")
    NumMODEL = load_model("airwriting_model.keras")

    AlphaLABELS = {i: chr(65 + i) for i in range(26)}
    NumLABELS = {i: str(i) for i in range(10)}

    # Hand Detector
    detector = htm.handDetector(detectionCon=0.85)

    # PDF Setup
    pdf_filename = "recognized_words.pdf"
    pdf_canvas = canvas.Canvas(pdf_filename)
    pdf_canvas.setFont("Helvetica", 20)
    y_position = 750  # Start writing position

    PREDICT = "off"
    number_xcord, number_ycord = [], []

    while True:
        success, img = cap.read()
        img = cv2.flip(img, 1)  # Mirror the image
        img = detector.findHands(img)
        lmList = detector.findPosition(img, draw=False)

        # ✅ Handle Mode Switching
        if keyboard.is_pressed('a'):
            PREDICT = "alpha"
        if keyboard.is_pressed('n'):
            PREDICT = "num"
        if keyboard.is_pressed('o'):
            PREDICT = "off"
            buffer = ""

        # Process Hand Detection
        if len(lmList) > 0:
            x1, y1 = lmList[8][1:]  # Index finger
            x2, y2 = lmList[12][1:]  # Middle finger
            fingers = detector.fingersUp()

            # ✅ Recognize Gesture for Prediction
            if fingers[1] and fingers[2]:  # Two fingers up (Prediction Mode)
                number_xcord.append(x1)
                number_ycord.append(y1)

                if len(number_xcord) > 5 and PREDICT != "off":
                    # Extract region for prediction
                    rect_min_x, rect_max_x = max(0, min(number_xcord) - 5), min(width, max(number_xcord) + 5)
                    rect_min_y, rect_max_y = max(0, min(number_ycord) - 5), min(height, max(number_ycord) + 5)

                    img_arr = np.array(pygame.PixelArray(DISPLAYSURF))[rect_min_x:rect_max_x, rect_min_y:rect_max_y].T.astype(np.float32)
                    image = cv2.resize(img_arr, (28, 28))
                    image = np.pad(image, (10, 10), 'constant', constant_values=0)
                    image = cv2.resize(image, (28, 28)) / 255.0

                    # Perform Prediction
                    if PREDICT == "alpha":
                        label = AlphaLABELS[np.argmax(AlphaMODEL.predict(image.reshape(1, 28, 28, 1)))]
                    elif PREDICT == "num":
                        label = NumLABELS[np.argmax(NumMODEL.predict(image.reshape(1, 28, 28, 1)))]
                    else:
                        label = ""

                    # ✅ Append Prediction to Buffer
                    if label:
                        buffer += label

                    # Reset coordinates
                    number_xcord, number_ycord = [], []

            # ✅ Recognize Three-Finger Gesture (Send Buffer)
            if fingers[0] and fingers[1] and fingers[2] and not fingers[3] and not fingers[4]:
                if buffer:
                    print("Recognized Word:", buffer)

                    # Send to Backend
                    requests.post('http://localhost:5000/recognized-word', json={"word": buffer})
                    sys.stdout.flush()

                    # Write to PDF
                    pdf_canvas.drawString(100, y_position, buffer)
                    y_position -= 30

                    if y_position < 50:  # New Page if necessary
                        pdf_canvas.showPage()
                        y_position = 750

                    buffer = ""  # ✅ Clear buffer after sending

        # Combine Layers
        imgGray = cv2.cvtColor(imgCanvas, cv2.COLOR_BGR2GRAY)
        _, imgInv = cv2.threshold(imgGray, 50, 255, cv2.THRESH_BINARY_INV)
        imgInv = cv2.cvtColor(imgInv, cv2.COLOR_GRAY2BGR)
        img = cv2.bitwise_and(img, imgInv)
        img = cv2.bitwise_or(img, imgCanvas)

        # Display Image
        cv2.imshow("Image", img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Cleanup
    pdf_canvas.save()
    cap.release()
    cv2.destroyAllWindows()

# ✅ Run Virtual Painter
def run_virtual_painter():
    strt()
