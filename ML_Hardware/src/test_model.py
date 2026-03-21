import os
import sys
# Suppress all TensorFlow C++ logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import tensorflow as tf  # type: ignore
import numpy as np  # type: ignore
FINAL_CATEGORIES = ['paper', 'plastic', 'organic']
IMG_SIZE = (224, 224)


def load_model():
    """Load the garbage classifier model from the models directory."""
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'garbage_classifier.h5')
    model_path = os.path.abspath(model_path)

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")

    return tf.keras.models.load_model(model_path)


def predict_waste(model, image_path):
    """Classify waste type from an image file.

    Args:
        model: Loaded Keras model.
        image_path: Path to the image file.

    Returns:
        Predicted class name string.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at: {image_path}")

    # Load and preprocess image
    img = tf.keras.utils.load_img(image_path, target_size=IMG_SIZE)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    # Predict
    predictions = model.predict(img_array, verbose=0)
    score = predictions[0]

    predicted_class_idx = np.argmax(score)
    result = FINAL_CATEGORIES[predicted_class_idx]
    confidence = 100 * np.max(score)

    print(f"Image: {os.path.basename(image_path)}")
    print(f"Prediction: {result} ({confidence:.2f}% confidence)")
    return result


def main():
    if len(sys.argv) < 2:
        print("\nUsage: python test_model.py <image_path>")
        print("Example: python test_model.py C:/Users/YourName/Desktop/banana.jpg")
        return

    model = load_model()
    print("Model loaded successfully!")
    print(f"Model input shape: {model.input_shape}")
    print(f"Model output shape: {model.output_shape}")
    print(f"Number of classes: {len(FINAL_CATEGORIES)}")

    image_path = " ".join([sys.argv[i] for i in range(1, len(sys.argv))])
    print(f"\nClassifying: {image_path}")
    predict_waste(model, image_path)


if __name__ == '__main__':
    main()
    