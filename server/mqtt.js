const mqtt = require("mqtt");

function setupMQTT() {
  const brokerUrl = "mqtt://localhost:1883"; // Adres brokera MQTT
  const mqttClient = mqtt.connect(brokerUrl);

  let seconds = 0;

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");

    setInterval(() => {
      seconds++;
      mqttClient.publish("timer", seconds.toString());
    }, 1000);
  });

  return mqttClient;
}

module.exports = setupMQTT;
