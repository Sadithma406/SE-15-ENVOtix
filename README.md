A comprehensive IoT-based smart waste management system integrating a hardware model (ESP32-CAM and Sensors), a Node.js Express Backend, a React/Vite Web Dashboard, and a React Native Mobile Application.

## Project Architecture
*Backend: Node.js & Express server connected to MongoDB. Handles API requests, user authentication, and MQTT data processing from the smart bins.
*Web_Frontend: React Vite application for Municipal Admins to monitor the bins, visualize analytics on a dashboard, and view live bin locations on a map.
*Mobile_Frontend: React Native (Expo) app for the general public/users to monitor public bins, get navigate directions, collect rewards/coins, and view notifications.
*ML_Hardware: Python OpenCV and TensorFlow code simulating the Envotix Bin Scanner. Classifies waste types (Organic/Plastic/Paper) and relays it to ESP32 / Backend via MQTT.

## Prerequisites
*   [Node.js](https://nodejs.org/) (v16.x or newer)
*   [Python 3.8+](https://www.python.org/) (for ML Component)
*   [Expo CLI](https://docs.expo.dev/) (to run the mobile app)
*   MongoDB Instance (Local or Atlas)
*   Active MQTT broker (HiveMQ used in the IoT integration)

## How to Run the System

### 1. Starting the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up `.env` file
4. Start the server (runs on `localhost:5000` by default):
   ```bash
   node app.js
   ```

### 2. Starting the Web Dashboard (Admin)
1. Open a new terminal and navigate to the web frontend:
   ```bash
   cd Web_Frontend
   ```
2. Install dependencies (The `.npmrc` is included to bypass React 19 peer-dependency warnings):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Starting the Mobile Application (User)
1. Open a new terminal and navigate to the mobile frontend:
   ```bash
   cd Mobile_Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo server:
   ```bash
   npx expo start
   ```
   (Use the Expo Go app)

### 4. Running the ML Model / hardware
1. Open a new terminal and navigate to the hardware side:
   ```bash
   cd ML_Hardware/src
   ```
2. Ensure you have the required python packages (`pip install -r ../requirements.txt`).
3. Run the ML Scanner:
   ```bash
   python main.py
   ```

## Running Automated Tests
The project contains Jest unit tests for the core logic arrays and configurations.
* Backend: `cd Backend, npm test`
* Mobile: `cd Mobile_Frontend, npm test`
* Web: `cd Web_Frontend, npm run test`


*Built for the Software Development Group Project (SDGP).*
