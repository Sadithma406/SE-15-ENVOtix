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

def main():
    # 1. Connect MQTT in background
    setup_mqtt()

    # 2. Load ML Model
    print("Loading ML Model...")
    model = load_model()
    print("Envotix AI System Starting...")

    # 3. Start Webcam
    cap = cv2.VideoCapture(1)

    print("\n=== Controls ===")
    print("Any key = Classify & send to bin")
    print("Q       = Quit")
    print("================\n")

    status_text = "Press any key to classify"
    status_color = (0, 255, 0)

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            height, width = frame.shape[:2]

            # Draw center box (where the object should be placed)
            box_size = int(min(height, width) * 0.8)
            x1 = (width // 2) - (box_size // 2)
            y1 = (height // 2) - (box_size // 2)
            x2 = (width // 2) + (box_size // 2)
            y2 = (height // 2) + (box_size // 2)
            cv2.rectangle(frame, (x1, y1), (x2, y2), status_color, 2)

            # Draw UI text
            cv2.putText(frame, "Envotix AI Scanner", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            cv2.putText(frame, status_text, (10, 70),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2)
            cv2.putText(frame, "Any key = Classify | Q = Quit", (10, height - 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

            cv2.imshow('Envotix Household Bin AI', frame)

            key = cv2.waitKey(1) & 0xFF

            # Q = Quit
            if key == ord('q'):
                break

            # Any other key = Classify the current frame
            elif key != 255:  # 255 means no key was pressed
                print("[CAPTURE] Classifying current frame...")

                img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                img = cv2.resize(img_rgb, IMG_SIZE)
                img_array = img.astype('float32')
                img_array = np.expand_dims(img_array, axis=0)

                predictions = model.predict(img_array, verbose=0)
                score = predictions[0]

                predicted_class_idx = np.argmax(score)
                label = FINAL_CATEGORIES[predicted_class_idx]
                confidence = np.max(score) * 100

                print(f"-> Prediction: {label} ({confidence:.1f}%)")

                # Publish to MQTT for the ESP32
                mqtt_client.publish(TOPIC_RESULT, label)
                print(f"-> Published MQTT: '{label}' sent to {TOPIC_RESULT}")

                # Update UI status
                status_text = f"Sent: {label.upper()} ({confidence:.0f}%)"
                status_color = (255, 255, 0)

    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Ctrl+C detected — stopping...")

    # Cleanup: send stop signal so ESP32 doesn't act on stale messages
    print("[SHUTDOWN] Sending stop signal to ESP32...")
    mqtt_client.publish(TOPIC_RESULT, "stop", retain=False)
    mqtt_client.publish(TOPIC_RESULT, "", retain=True)
    time.sleep(0.5)

    cap.release()
    cv2.destroyAllWindows()
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
    print("[SHUTDOWN] Done. Bin stopped.")


if __name__ == '__main__':
    main()