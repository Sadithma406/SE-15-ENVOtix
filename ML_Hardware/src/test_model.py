# Test script to classify an image using the waste classifier model
import keras
import numpy as np
import cv2
import sys
import os

# Load the model
print("Loading model...")
model_path = os.path.join(os.path.dirname(__file__), '../models/waste_classifier.h5')
model = keras.models.load_model(model_path)
print("✅ Model loaded successfully!")
print(f"Model input shape: {model.input_shape}")
print(f"Model output shape: {model.output_shape}")

# Class names - 10 classes based on model output
class_names = ['Glass', 'Organic', 'Plastic', 'Cardboard', 'Metal', 'Paper', 'Battery', 'Clothes', 'E-waste', 'Other']

def classify_image(image_path):
    """Classify a single image"""
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        print(f"❌ Error: Could not load image from {image_path}")
        return None
    
    print(f"\nImage loaded: {image_path}")
    print(f"Original shape: {img.shape}")
    
    # Preprocess
    img_resized = cv2.resize(img, (224, 224))
    img_array = keras.utils.img_to_array(img_resized)
    img_array = np.expand_dims(img_array, 0) / 255.0
    
    # Predict
    predictions = model.predict(img_array, verbose=0)
    
    # Get results
    predicted_class = class_names[np.argmax(predictions)]
    confidence = np.max(predictions) * 100
    
    print("\n" + "="*50)
    print(f"🎯 Prediction: {predicted_class}")
    print(f"📊 Confidence: {confidence:.2f}%")
    print("="*50)
    
    # Show all class probabilities
    print("\nAll class probabilities:")
    for i, (name, prob) in enumerate(zip(class_names, predictions[0])):
        bar = "█" * int(prob * 20)
        print(f"  {name:12}: {prob*100:5.2f}% {bar}")
    
    return predicted_class, confidence

if __name__ == "__main__":
    # Test images from Mobile_Frontend/assets
    assets_path = os.path.join(os.path.dirname(__file__), '../../Mobile_Frontend/assets')
    
    test_images = [
        os.path.join(assets_path, 'plastic.png'),
        os.path.join(assets_path, 'glass.png'),
        os.path.join(assets_path, 'organic.png'),
    ]
    
    print("\n" + "="*60)
    print("   WASTE CLASSIFIER - TEST RUN")
    print("="*60)
    
    for img_path in test_images:
        if os.path.exists(img_path):
            classify_image(img_path)
        else:
            print(f"⚠️ Image not found: {img_path}")
    
    # Allow custom image path as argument
    if len(sys.argv) > 1:
        custom_path = sys.argv[1]
        print(f"\n\n📷 Testing custom image: {custom_path}")
        classify_image(custom_path)