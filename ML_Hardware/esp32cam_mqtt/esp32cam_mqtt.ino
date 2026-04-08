#include <ESP32Servo.h>
#include <PubSubClient.h>
#include <WiFi.h>

// =============== USER CONFIG ===============

// WiFi credentials — change these to match your network
const char *WIFI_SSID = "REDMI 15C";
const char *WIFI_PASSWORD = "23456789";

// MQTT broker (free public HiveMQ broker)
const char *MQTT_BROKER = "broker.hivemq.com";
const int MQTT_PORT = 1883;
const char *CLIENT_ID = "envotix_esp32_servo";

// MQTT topics
const char *TOPIC_RESULT = "envotix/result";
const char *TOPIC_FILL = "envotix/household/fill";

// Bin ID — must match your MongoDB bin_id
const char *BIN_ID = "40247c61";

// =============== PIN DEFINITIONS ===============

// Stepper motor pins (A4988 / DRV8825 driver)
#define STEP_PIN 26
#define DIR_PIN 25
#define ENABLE_PIN 27

// Servo pin (flap)
#define SERVO_PIN 14

// IR Encoder sensor pin (digital output)
#define IR_PIN 4

// Ultrasonic Sensors
#define ORGANIC_TRIG 15
#define ORGANIC_ECHO 2

#define PLASTIC_TRIG 5
#define PLASTIC_ECHO 18

#define PAPER_TRIG 19
#define PAPER_ECHO 21

// =============== IR ENCODER CONFIG ===============

// Total slots on the encoder disk
#define TOTAL_SLOTS 20

// Slot targets for each waste type (20 slots / 3 sections ≈ 6 per section)
#define SLOTS_ORGANIC 6  // 120° = 6 slots
#define SLOTS_PLASTIC 12 // 240° = 12 slots
#define SLOTS_PAPER 18   // 360° = 18 slots

// Timeout: max time (ms) to wait for a slot before giving up (safety)
#define SLOT_TIMEOUT_MS 10000

// =============== STEPPER CONFIG ===============

int stepsPerRevolution = 200;
int microstepping = 1;
float stepAngle = 1.8 / microstepping;

// =============== SERVO CONFIG ===============

int servoInitial = 0;
int servoTarget = 163;
int servoHold = 25;

// =============== ULTRASONIC CONFIG ===============

#define BIN_HEIGHT_CM 16.0
#define FILL_PUBLISH_INTERVAL 10000

// Delay before opening flap (after stepper reaches position)
unsigned long delayTime = 1000; // 1 second

// =============== GLOBALS ===============

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
Servo lidServo;

unsigned long lastFillPublish = 0;
bool disposing = false;

// IR Encoder tracking
volatile int slotCount = 0; // current slot position (tracked by interrupt)
bool movingForward = true;  // direction flag for the interrupt

// =============== IR INTERRUPT ===============

/**
 * ISR: Called automatically every time the IR sensor detects a slot edge.
 * Increments or decrements slotCount based on movement direction.
 */
void IRAM_ATTR onSlotDetected() {
  if (movingForward) {
    slotCount++;
  } else {
    slotCount--;
  }
}

// =============== STEPPER FUNCTIONS (IR CLOSED-LOOP) ===============

/**
 * Moves the stepper motor forward (clockwise) until the IR encoder
 * counts the target number of slots. Stops immediately when reached.
 *
 * targetSlots: absolute slot position to reach (e.g., 6, 12, 18)
 * Returns: true if target reached, false if timed out
 */
bool moveToSlot(int targetSlots) {
  movingForward = true;
  digitalWrite(DIR_PIN, HIGH); // clockwise

  unsigned long startTime = millis();

  Serial.printf("[IR] Moving forward: current=%d → target=%d\n", slotCount,
                targetSlots);

  while (slotCount < targetSlots) {
    // Safety timeout
    if (millis() - startTime > SLOT_TIMEOUT_MS) {
      Serial.printf("[IR] TIMEOUT! Stuck at slot %d (target was %d)\n",
                    slotCount, targetSlots);
      return false;
    }

    // Pulse the stepper one step (slower speed)
    digitalWrite(STEP_PIN, HIGH);
    delayMicroseconds(3000); // Higher number = slower speed
    digitalWrite(STEP_PIN, LOW);
    delayMicroseconds(3000); // Higher number = slower speed
  }

  Serial.printf("[IR] Reached slot %d ✓\n", slotCount);
  return true;
}

/**
 * Returns the stepper motor to the home position (slot 0) by
 * stepping counter-clockwise until the IR counter reaches 0.
 *
 * Returns: true if home reached, false if timed out
 */
bool returnToHome() {
  movingForward = false;
  digitalWrite(DIR_PIN, LOW); // counter-clockwise

  unsigned long startTime = millis();

  Serial.printf("[IR] Returning home: current=%d → target=0\n", slotCount);

  while (slotCount > 0) {
    // Safety timeout
    if (millis() - startTime > SLOT_TIMEOUT_MS) {
      Serial.printf("[IR] TIMEOUT! Stuck at slot %d while returning home\n",
                    slotCount);
      return false;
    }

    // Pulse the stepper one step (slower speed)
    digitalWrite(STEP_PIN, HIGH);
    delayMicroseconds(3000); // Higher number = slower speed
    digitalWrite(STEP_PIN, LOW);
    delayMicroseconds(3000); // Higher number = slower speed
  }

  Serial.printf("[IR] Home reached (slot %d) ✓\n", slotCount);
  return true;
}

// =============== SERVO FUNCTIONS ===============

void servoSequence() {
  lidServo.write(servoTarget);
  delay(2000);

  lidServo.write(servoInitial);
  delay(500);

  lidServo.write(servoHold);
  delay(500);
}

// =============== ULTRASONIC FUNCTIONS ===============

float measureDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0) {
    return -1;
  }

  float distance = duration * 0.034 / 2.0;
  return distance;
}

int distanceToFillPercent(float distanceCm) {
  if (distanceCm < 0)
    return 0;
  if (distanceCm >= BIN_HEIGHT_CM)
    return 0;
  if (distanceCm <= 2.0)
    return 100;

  float fillPercent = ((BIN_HEIGHT_CM - distanceCm) / BIN_HEIGHT_CM) * 100.0;

  if (fillPercent < 0)
    fillPercent = 0;
  if (fillPercent > 100)
    fillPercent = 100;

  return (int)fillPercent;
}

void publishFillLevels() {
  float organicDist = measureDistance(ORGANIC_TRIG, ORGANIC_ECHO);
  float plasticDist = measureDistance(PLASTIC_TRIG, PLASTIC_ECHO);
  float paperDist = measureDistance(PAPER_TRIG, PAPER_ECHO);

  int organicFill = distanceToFillPercent(organicDist);
  int plasticFill = distanceToFillPercent(plasticDist);
  int paperFill = distanceToFillPercent(paperDist);

  Serial.printf(
      "[FILL] Distances: Organic=%.1fcm, Plastic=%.1fcm, Paper=%.1fcm\n",
      organicDist, plasticDist, paperDist);
  Serial.printf("[FILL] Levels:    Organic=%d%%, Plastic=%d%%, Paper=%d%%\n",
                organicFill, plasticFill, paperFill);

  char payload[128];
  snprintf(payload, sizeof(payload),
           "{\"binId\":\"%s\",\"organic\":%d,\"plastic\":%d,\"paper\":%d}",
           BIN_ID, organicFill, plasticFill, paperFill);

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
  Serial.printf("\n[WIFI] Connected — IP: %s\n",
                WiFi.localIP().toString().c_str());
}

// =============== WASTE DISPOSAL (IR CLOSED-LOOP) ===============

/**
 * Full disposal sequence using IR encoder feedback:
 * 1. Stepper rotates forward until IR slot count = target
 * 2. Waits for waste to settle
 * 3. Servo opens flap → closes → holds
 * 4. Stepper returns backward until IR slot count = 0
 */
void disposeWaste(int targetSlots, const char *wasteType) {
  disposing = true;

  Serial.printf("\n[DISPOSE] %s detected — moving to slot %d\n", wasteType,
                targetSlots);

  // Step 1: Rotate stepper forward to target slot
  bool reachedTarget = moveToSlot(targetSlots);
  if (!reachedTarget) {
    Serial.println("[DISPOSE] ERROR: Failed to reach target — returning home");
    returnToHome();
    disposing = false;
    return;
  }

  // Step 2: Wait for waste to settle
  Serial.printf("[DISPOSE] At slot %d — waiting %lums...\n", slotCount,
                delayTime);
  delay(delayTime);

  // Step 3: Servo flap sequence
  Serial.println("[SERVO] Opening flap...");
  servoSequence();

  // Step 4: Return stepper to home (slot 0)
  Serial.println("[STEPPER] Returning to home position...");
  bool reachedHome = returnToHome();
  if (!reachedHome) {
    Serial.println("[DISPOSE] WARNING: Failed to reach home position!");
  }

  // Step 5: Reset servo
  lidServo.write(servoInitial);
  Serial.println("[SERVO] Reset to 0° (closed)");

  // Drain any queued MQTT messages
  Serial.println("[MQTT] Flushing queued messages...");
  for (int i = 0; i < 20; i++) {
    mqttClient.loop();
    delay(50);
  }

  disposing = false;
  Serial.printf("[READY] Home (slot %d) — ready for next classification\n\n",
                slotCount);
}

// =============== MQTT CALLBACK ===============

void mqttCallback(char *topic, byte *payload, unsigned int length) {
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';

  Serial.printf("[MQTT] Received on '%s': %s\n", topic, message);

  String result = String(message);
  result.trim();

  if (disposing) {
    Serial.println("[MQTT] Busy — ignoring (already disposing)");
    return;
  }

  // Map classification to IR slot count and run disposal
  if (result.equalsIgnoreCase("Organic")) {
    disposeWaste(SLOTS_ORGANIC, "Organic");
  } else if (result.equalsIgnoreCase("Plastic")) {
    disposeWaste(SLOTS_PLASTIC, "Plastic");
  } else if (result.equalsIgnoreCase("Paper")) {
    disposeWaste(SLOTS_PAPER, "Paper");
  } else {
    Serial.printf("[MQTT] Unknown class '%s' — ignoring\n", message);
  }
}

// =============== MQTT CONNECT ===============

void connectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("[MQTT] Connecting to broker...");
    if (mqttClient.connect(CLIENT_ID)) {
      Serial.println(" connected!");
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
  Serial.println("\n==========================================");
  Serial.println("   ENVOtix Stepper + IR + Servo + Fill");
  Serial.println("==========================================\n");

  // Stepper motor pins
  pinMode(STEP_PIN, OUTPUT);
  pinMode(DIR_PIN, OUTPUT);
  pinMode(ENABLE_PIN, OUTPUT);
  digitalWrite(ENABLE_PIN, LOW);
  Serial.println("[STEPPER] Initialized (STEP=26, DIR=25, EN=27)");

  // IR Encoder sensor (input with pullup)
  pinMode(IR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(IR_PIN), onSlotDetected, FALLING);
  slotCount = 0;
  Serial.printf("[IR] Encoder on pin %d — 20 slots, tracking enabled\n",
                IR_PIN);

  // Servo (flap)
  lidServo.setPeriodHertz(50);
  lidServo.attach(SERVO_PIN, 500, 2400);
  lidServo.write(servoInitial);
  Serial.println("[SERVO] Attached on pin 14, set to 0° (closed)");

  // Ultrasonic sensor pins
  pinMode(ORGANIC_TRIG, OUTPUT);
  pinMode(ORGANIC_ECHO, INPUT);
  pinMode(PLASTIC_TRIG, OUTPUT);
  pinMode(PLASTIC_ECHO, INPUT);
  pinMode(PAPER_TRIG, OUTPUT);
  pinMode(PAPER_ECHO, INPUT);
  Serial.println(
      "[ULTRASONIC] 3 sensors initialized (Organic, Plastic, Paper)");

  // WiFi
  connectWiFi();

  // MQTT
  mqttClient.setKeepAlive(60);
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  connectMQTT();

  Serial.printf("[CONFIG] Bin ID: %s | Slots: O=%d P=%d G=%d\n", BIN_ID,
                SLOTS_ORGANIC, SLOTS_PLASTIC, SLOTS_PAPER);
  Serial.println("\n[READY] Waiting for classification commands...\n");
}

// =============== LOOP ===============

void loop() {
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();

  unsigned long now = millis();
  if (now - lastFillPublish >= FILL_PUBLISH_INTERVAL) {
    lastFillPublish = now;
    publishFillLevels();
  }
}