# ML Hardware - Waste Classifier

This module contains the ML model for waste classification (Glass, Organic, Plastic, etc.) used with ESP32-CAM hardware.

## 🚀 Quick Setup

### Prerequisites
- Python 3.11 installed on your system
- pip (Python package manager)

### Step 1: Create Virtual Environment

**Windows (PowerShell):**
```powershell
cd ML_Hardware
python -m venv venv311
```

**Mac/Linux:**
```bash
cd ML_Hardware
python3 -m venv venv311
```

### Step 2: Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv311\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
.\venv311\Scripts\activate.bat
```

**Mac/Linux:**
```bash
source venv311/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ **Note:** If you get timeout errors, use:
> ```bash
> pip install -r requirements.txt --timeout 120
> ```

### Step 4: Test the Model

```bash
cd src
python test_model.py
```

Or test with a custom image:
```bash
python test_model.py "path/to/your/image.jpg"
```

## 🏃 Running the Server

To start the Flask server for ESP32-CAM integration:

```bash
cd src
python main.py
```

The server will run on `http://0.0.0.0:5000`

## 📁 Project Structure

```
ML_Hardware/
├── models/
│   └── waste_classifier.h5    # Trained Keras model
├── src/
│   ├── main.py                # Flask server for ESP32-CAM
│   └── test_model.py          # Test script for local testing
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🔧 Troubleshooting

### Model Loading Error
If you see Keras version errors, ensure you have the exact versions:
```bash
pip install keras==3.10.0 tensorflow==2.20.0
```

### MQTT Connection Issues
The server connects to `broker.hivemq.com` on port 1883. Ensure your firewall allows this connection.

## 📊 Model Info
- **Input Shape:** (224, 224, 3) - RGB images resized to 224x224
- **Output:** 10 classes of waste materials
- **Classes:** Glass, Organic, Plastic, Cardboard, Metal, Paper, Battery, Clothes, E-waste, Other

> ⚠️ **Important:** Verify the class names match your training data order!
