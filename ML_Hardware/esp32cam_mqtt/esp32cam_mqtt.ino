/*
 *  ENVOtix - ESP32 Waste Classifier Servo Node + Ultrasonic Fill Monitoring
 *
 * Hardware:
 *   - ESP32 (or ESP32-CAM board)
 *   - Servo motor on GPIO 13
 *   - 3x HC-SR04 Ultrasonic Sensors:
 *       Organic  → TRIG=12, ECHO=14
 *       Plastic  → TRIG=27, ECHO=26
 *       Paper    → TRIG=25, ECHO=33
 *
 * Flow:
 *   1. Subscribes to "envotix/result" via MQTT
 *   2. Receives classification ("Paper", "Plastic", "Organic")
 *   3. Servo rotates to the corresponding angle
 *   4. Returns to default angle after 3 seconds
 *   5. Every 10 seconds, reads ultrasonic sensors and publishes fill levels
 *      to "envotix/household/fill" for MongoDB storage
 *
 * Required Libraries (install via Arduino Library Manager):
 *   - PubSubClient  (by Nick O'Leary)
 *   - ESP32Servo     (by Kevin Harrington)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>

// =============== USER CONFIG ===============

// WiFi credentials — change these to match your network
const char* WIFI_SSID     = "REDMI 15C";
const char* WIFI_PASSWORD = "23456789";

// MQTT broker (free public HiveMQ broker)
const char* MQTT_BROKER = "broker.hivemq.com";
const int   MQTT_PORT   = 1883;
const char* CLIENT_ID   = "envotix_esp32_servo";

// MQTT topics
const char* TOPIC_RESULT = "envotix/result";
const char* TOPIC_FILL   = "envotix/household/fill";

// Bin ID — must match your MongoDB bin_id
const char* BIN_ID = "40247c61";

// Servo pin
#define SERVO_PIN 13

// Servo angles for each waste class
#define ANGLE_PAPER    120
#define ANGLE_PLASTIC  240
#define ANGLE_ORGANIC   80
#define ANGLE_DEFAULT    0

// =============== ULTRASONIC SENSOR PINS ===============
// Each compartment has one HC-SR04 sensor (TRIG + ECHO pins)

// Organic compartment
#define ORGANIC_TRIG  12
#define ORGANIC_ECHO  14

// Plastic compartment
#define PLASTIC_TRIG  27
#define PLASTIC_ECHO  26

// Paper compartment
#define PAPER_TRIG    25
#define PAPER_ECHO    33

// Bin compartment height in cm (distance when empty)
// Adjust this to match your actual bin depth
#define BIN_HEIGHT_CM 30.0

// How often to publish fill levels (in milliseconds)
#define FILL_PUBLISH_INTERVAL 10000  // 10 seconds

// =============== GLOBALS ===============

WiFiClient   wifiClient;
PubSubClient mqttClient(wifiClient);
Servo        lidServo;

unsigned long lastFillPublish = 0;

// =============== ULTRASONIC FUNCTIONS ===============

/**
 * Measures distance in centimeters using an HC-SR04 sensor.
 * Returns distance in cm, or -1 if no echo received (timeout).
 */
float measureDistance(int trigPin, int echoPin) {
  // Send a 10µs HIGH pulse on TRIG
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read the echo pulse duration (timeout after 30ms = ~500cm max)
  long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0) {
    return -1;  // No echo received
  }

  // Speed of sound = 343 m/s → 0.0343 cm/µs → distance = duration * 0.0343 / 2
  float distance = duration * 0.0343 / 2.0;
  return distance;
}

/**
 * Converts distance (cm) to fill level percentage.
 * When distance == BIN_HEIGHT_CM → bin is empty (0%)
 * When distance == 0             → bin is full (100%)
 */
int distanceToFillPercent(float distanceCm) {
  if (distanceCm < 0) return 0;  // Sensor error, default to 0%
  if (distanceCm >= BIN_HEIGHT_CM) return 0;   // Empty
  if (distanceCm <= 2.0) return 100;           // Full (HC-SR04 min range ~2cm)

  float fillPercent = ((BIN_HEIGHT_CM - distanceCm) / BIN_HEIGHT_CM) * 100.0;

  // Clamp to 0-100
  if (fillPercent < 0) fillPercent = 0;
  if (fillPercent > 100) fillPercent = 100;

  return (int)fillPercent;
}

/**
 * Reads all 3 ultrasonic sensors and publishes fill levels via MQTT.
 * Payload format matches what householdMqttService.js expects:
 * { "binId": "40247c61", "organic": 45, "plastic": 12, "paper": 78 }
 */
void publishFillLevels() {
  // Read each sensor
  float organicDist = measureDistance(ORGANIC_TRIG, ORGANIC_ECHO);
  float plasticDist = measureDistance(PLASTIC_TRIG, PLASTIC_ECHO);
  float paperDist   = measureDistance(PAPER_TRIG, PAPER_ECHO);

  // Convert to fill percentages
  int organicFill = distanceToFillPercent(organicDist);
  int plasticFill = distanceToFillPercent(plasticDist);
  int paperFill   = distanceToFillPercent(paperDist);

  Serial.printf("[FILL] Distances: Organic=%.1fcm, Plastic=%.1fcm, Paper=%.1fcm\n",
                organicDist, plasticDist, paperDist);
  Serial.printf("[FILL] Levels:    Organic=%d%%, Plastic=%d%%, Paper=%d%%\n",
                organicFill, plasticFill, paperFill);

  // Build JSON payload (no ArduinoJson library needed)
  char payload[128];
  snprintf(payload, sizeof(payload),
           "{\"binId\":\"%s\",\"organic\":%d,\"plastic\":%d,\"paper\":%d}",
           BIN_ID, organicFill, plasticFill, paperFill);

  // Publish to MQTT
  if (mqttClient.publish(TOPIC_FILL, payload)) {
    Serial.printf("[FILL] Published to %s: %s\n", TOPIC_FILL, payload);
  } else {
    Serial.println("[FILL] Failed to publish fill levels!");
  }
}



// =============== WIFI ===============

void connectWiFi() {
  Serial.printf("[WIFI] Connecting to %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WIFI] Connected — IP: %s\n", WiFi.localIP().toString().c_str());
}

// =============== MQTT CALLBACK ===============

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  // Null-terminate the payload
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';

  Serial.printf("[MQTT] Received on '%s': %s\n", topic, message);

  String result = String(message);
  result.trim();

  int angle = ANGLE_DEFAULT;

  // Case-insensitive comparisons matching the Python ML output
  if (result.equalsIgnoreCase("Paper")) {
    angle = ANGLE_PAPER;
    Serial.println("[SERVO] → Paper detected — rotating to 120°");
  } else if (result.equalsIgnoreCase("Plastic")) {
    angle = ANGLE_PLASTIC;
    Serial.println("[SERVO] → Plastic detected — rotating to 240°");
  } else if (result.equalsIgnoreCase("Organic")) {
    angle = ANGLE_ORGANIC;
    Serial.println("[SERVO] → Organic detected — rotating to 80°");
  } else {
    Serial.printf("[SERVO] → Unknown class '%s' — going to default 0°\n", message);
  }

  // Move servo
  lidServo.write(angle);
  Serial.printf("[SERVO] Moved to %d°\n", angle);

  // Hold position for 3 seconds, then return to default
  delay(3000);
  lidServo.write(ANGLE_DEFAULT);
  Serial.println("[SERVO] Returned to 0° (default)");
}


// =============== MQTT CONNECT ===============

void connectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("[MQTT] Connecting to broker...");
    if (mqttClient.connect(CLIENT_ID)) {
      Serial.println(" connected!");
      // Subscribe to result topic
      mqttClient.subscribe(TOPIC_RESULT);
      Serial.printf("[MQTT] Subscribed to '%s'\n", TOPIC_RESULT);
    } else {
      Serial.printf(" FAILED (rc=%d). Retrying in 5s...\n", mqttClient.state());
      delay(5000);
    }
  }
}

// =============== SETUP ===============

void setup() {
  Serial.begin(115200);
  Serial.println("\n========================================");
  Serial.println("   ENVOtix Servo + Fill Monitor Node");
  Serial.println("========================================\n");

  // Servo
  lidServo.attach(SERVO_PIN);
  lidServo.write(ANGLE_DEFAULT);
  Serial.println("[SERVO] Attached and set to 0°");

  // Ultrasonic sensor pins
  pinMode(ORGANIC_TRIG, OUTPUT);
  pinMode(ORGANIC_ECHO, INPUT);
  pinMode(PLASTIC_TRIG, OUTPUT);
  pinMode(PLASTIC_ECHO, INPUT);
  pinMode(PAPER_TRIG, OUTPUT);
  pinMode(PAPER_ECHO, INPUT);
  Serial.println("[ULTRASONIC] 3 sensors initialized (Organic, Plastic, Paper)");

  // WiFi
  connectWiFi();

  // MQTT
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  connectMQTT();

  Serial.printf("[CONFIG] Bin ID: %s | Height: %.0fcm | Interval: %dms\n",
                BIN_ID, BIN_HEIGHT_CM, FILL_PUBLISH_INTERVAL);
  Serial.println("\n[READY] Waiting for classification commands + monitoring fill levels...\n");
}

// =============== LOOP ===============

void loop() {
  // Keep MQTT alive and process incoming messages
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();

  // Periodically read ultrasonic sensors and publish fill levels
  unsigned long now = millis();
  if (now - lastFillPublish >= FILL_PUBLISH_INTERVAL) {
    lastFillPublish = now;
    publishFillLevels();
  }
}