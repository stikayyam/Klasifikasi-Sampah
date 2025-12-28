import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

# Global variable to hold the model
model = None
class_labels = ["anorganik", "campuran", "organik"]

def load_model_file():
    global model
    model_path = os.path.join(os.path.dirname(__file__), "..", "model_sampahh17.h5")
    if os.path.exists(model_path):
        try:
            model = tf.keras.models.load_model(model_path)
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
    else:
        print(f"Model file not found at {model_path}")

def predict_image(image_bytes):
    global model
    if model is None:
        load_model_file()
        if model is None:
            raise Exception("Model not loaded")

    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array)
        class_id = np.argmax(prediction)
        confidence = float(np.max(prediction))

        return {
            "class": class_labels[class_id],
            "confidence": confidence,
            "probabilities": {label: float(prob) for label, prob in zip(class_labels, prediction[0])}
        }
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise e
