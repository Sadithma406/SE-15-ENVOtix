#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <TinyGPS++.h>

// --- PINS (Updated per your soldered wiring table) ---
//
#define SS_PIN 5   
#define RST_PIN 27 
#define TRIG_PIN 12
#define ECHO_PIN 13
#define RXD2 16
#define TXD2 17

TinyGPSPlus gps;
MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClient espClient;
PubSubClient client(espClient);

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com";
const char* myBinId = "6988ff9898e4690a4a14770c"; // Lane 04 - Nugegoda

unsigned long lastUpdate = 0;
const int BIN_HEIGHT_CM = 80; 

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi Connected");
  
  client.setServer(mqtt_server, 1883);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2); // GPS Module
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("Envotix_Lane_Device")) {
      Serial.println("Connected to MQTT Broker");
    } else {
      delay(2000);
    }
  }
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // --- 1. RFID TAP (Identify Card ID) ---
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String tagID = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      String hexPart = String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
      hexPart += String(rfid.uid.uidByte[i], HEX);
      tagID += hexPart;
    }
    
    // PRINT TO SERIAL FOR VERIFICATION
    Serial.println("---------------------------------");
    Serial.print("🔍 RFID TAPPED! ID: ");
    Serial.println(tagID);
    Serial.println("---------------------------------");

    StaticJsonDocument<200> rfidDoc;
    rfidDoc["rfidTag"] = tagID; 
    
    char rfidBuffer[256];
    serializeJson(rfidDoc, rfidBuffer);
    client.publish("envotix/user/rfidTap", rfidBuffer);
    
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }

  // --- 2. FILL LEVEL (Every 2 Seconds) ---
  if (millis() - lastUpdate > 2000) {
    lastUpdate = millis();
    digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    float duration = pulseIn(ECHO_PIN, HIGH);
    float distance = 0.017 * duration;
    int fillPercentage = map(constrain(distance, 0, BIN_HEIGHT_CM), BIN_HEIGHT_CM, 0, 0, 100);

    StaticJsonDocument<200> binDoc;
    binDoc["binId"] = myBinId;
    binDoc["fillLevel"] = fillPercentage;

    char binBuffer[256];
    serializeJson(binDoc, binBuffer);
    client.publish("envotix/lane/updates", binBuffer);
  }

  // --- 3. GPS UPDATES ---
  while (Serial2.available() > 0) {
    if (gps.encode(Serial2.read())) {
      if (gps.location.isValid()) {
        double latVal = gps.location.lat();
        double lngVal = gps.location.lng();

        // PRINT TO SERIAL FOR VERIFICATION
        Serial.print("📍 GPS FIX: Lat: ");
        Serial.print(latVal, 6);
        Serial.print(" | Lng: ");
        Serial.println(lngVal, 6);

        StaticJsonDocument<200> doc;
        doc["binId"] = myBinId;
        doc["lat"] = latVal;
        doc["lng"] = lngVal;

        char buffer[256];
        serializeJson(doc, buffer);
        client.publish("envotix/lane/location", buffer);
      }
    }
  }
}