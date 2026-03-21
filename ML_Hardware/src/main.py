import os
import time

# Suppress all TensorFlow C++ logs (the remaining red text in the terminal)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import tensorflow as tf  # noqa: E402 # type: ignore
import cv2  # noqa: E402 # type: ignore
import numpy as np  # noqa: E402 # type: ignore
import paho.mqtt.client as mqtt  # noqa: E402 # type: ignore

FINAL_CATEGORIES = ['paper', 'plastic', 'organic']
IMG_SIZE = (224, 224)

# MQTT Config
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
TOPIC_RESULT = "envotix/result"

# Global MQTT Client
mqtt_client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    print(f"[MQTT] Connected to {MQTT_BROKER} with result code {rc}")

def setup_mqtt():
    """Initializes and connects the MQTT client in a background thread."""
    mqtt_client.on_connect = on_connect
    
    try:
        print(f"Connecting to MQTT Broker ({MQTT_BROKER})...")
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        # loop_start() runs the network loop in the background!
        mqtt_client.loop_start()  
    except Exception as e:
        print(f"[WARNING] Failed to connect to MQTT: {e}")

def load_model():
    """Load the garbage classifier model from the models directory."""
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'garbage_classifier.h5')
    model_path = os.path.abspath(model_path)

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")

    return tf.keras.models.load_model(model_path)

def get_lid_action(label):
    """Determine lid rotation based on classified waste type."""
    rotation_map = {
        'organic': 'Rotate Lid 80°',
        'paper': 'Rotate Lid 120°',
        'plastic': 'Rotate Lid 240°',
    }
    return rotation_map.get(label, 'Rotate Lid 0° (Default)')

def main():
    # 1. Connect MQTT in background
    setup_mqtt()

    # 2. Load ML Model
    print("Loading ML Model...")
    model = load_model()
    print("Envotix AI System Starting...")

    # 3. Start Webcam
    cap = cv2.VideoCapture(0)
    
    # Timing for cooldown (so we don't spam predictions while the object sits there)
    last_trigger_time = 0.0
    COOLDOWN_SECONDS = 5.0
    
    # Brightness threshold to detect object on black background
    BRIGHTNESS_THRESHOLD = 40.0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        current_time = time.time()
        time_since_trigger = current_time - last_trigger_time

        # We will look at a center square region to detect if an object is placed
        height, width = frame.shape[:2]
        box_size = 200
        x1, y1 = (width // 2) - (box_size // 2), (height // 2) - (box_size // 2)
        x2, y2 = (width // 2) + (box_size // 2), (height // 2) + (box_size // 2)

        # Extract the Region of Interest (ROI)
        roi = frame[y1:y2, x1:x2]
        
        # Calculate the average brightness of the center ROI
        # If the background is uniformly black, placing an object raises the brightness.
        roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(roi_gray)

        # UI Text Setup
        status_text = "Status: Waiting for Object..."
        status_color = (0, 255, 0)

        if time_since_trigger < COOLDOWN_SECONDS:
            # We are waiting for the servo to finish moving before sensing again
            status_text = f"Status: Cooldown ({int(COOLDOWN_SECONDS - time_since_trigger)}s)"
            status_color = (0, 0, 255) # Red
        else:
            # Check if brightness is high enough to trigger the ML Model!
            if brightness > BRIGHTNESS_THRESHOLD:
                print(f"[DETECTION] Object detected! Brightness: {brightness:.1f}")
                
                # cv2 reads in BGR, convert to RGB for model
                img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Prepare frame
                img = cv2.resize(img_rgb, IMG_SIZE)
                img_array = img.astype('float32')
                img_array = np.expand_dims(img_array, axis=0)

                # Run Classification
                predictions = model.predict(img_array, verbose=0)
                score = predictions[0]

                predicted_class_idx = np.argmax(score)
                label = FINAL_CATEGORIES[predicted_class_idx]
                confidence = np.max(score) * 100
                
                print(f"-> Prediction: {label} ({confidence:.1f}%)")

                # Publish to MQTT for the ESP32!
                mqtt_client.publish(TOPIC_RESULT, label)
                print(f"-> Published MQTT: '{label}' sent to {TOPIC_RESULT}")

                # Enter cooldown
                last_trigger_time = current_time
                
                # Display success
                status_text = f"Classified: {label.upper()}"
                status_color = (255, 255, 0) # Cyan/Yellow

        # Draw the target box
        cv2.rectangle(frame, (x1, y1), (x2, y2), status_color, 2)
        
        cv2.putText(frame, "Envotix AI Scanner", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.putText(frame, status_text, (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2)
        cv2.putText(frame, f"Brightness: {brightness:.1f}/{BRIGHTNESS_THRESHOLD}", (10, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
        cv2.putText(frame, "Place object in center to classify.", (10, height - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

        cv2.imshow('Envotix Household Bin AI', frame)

        # Press 'q' to quit, 'space' to manually trigger just in case
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord(' ') and time_since_trigger >= COOLDOWN_SECONDS:
            # Manual trigger override logic
            brightness = BRIGHTNESS_THRESHOLD + 1 # Force it

    cap.release()
    cv2.destroyAllWindows()
    mqtt_client.loop_stop()
    mqtt_client.disconnect()


if __name__ == '__main__':
    main()