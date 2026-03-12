import keras
from flask import Flask, request
import numpy as np
import cv2
import paho.mqtt.client as mqtt

app = Flask(__name__)

# 1. Load your model from Colab
model = keras.models.load_model('../models/waste_classifier.h5')
# Note: Model has 10 output classes - update this list to match your training order
class_names = ['Glass', 'Organic', 'Plastic', 'Cardboard', 'Metal', 'Paper', 'Battery', 'Clothes', 'E-waste', 'Other']

# 2. Setup MQTT to talk to the ESP32
mqtt_client = mqtt.Client()
mqtt_client.connect("broker.hivemq.com", 1883, 60)

@app.route('/predict', methods=['POST'])
def predict():
    # Get image from ESP32-CAM
    file = request.data
    npimg = np.frombuffer(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
      # Preprocess
    img_resized = cv2.resize(img, (224, 224)) # Match your Colab input size
    img_array = keras.utils.img_to_array(img_resized)
    img_array = np.expand_dims(img_array, 0) / 255.0

    # AI Prediction
    predictions = model.predict(img_array)
    result = class_names[np.argmax(predictions)]
    
    # Send result to Motor via MQTT
    mqtt_client.publish("envotix/household/motor", result)
    print(f"✅ Classified as: {result}")
    
    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)