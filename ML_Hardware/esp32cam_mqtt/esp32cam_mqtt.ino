

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