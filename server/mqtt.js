const mqtt = require("mqtt");
const WebSocket = require("ws");

function setupMQTT() {
  const brokerUrl = "mqtt://localhost:1883";
  const mqttClient = mqtt.connect(brokerUrl);

  let seconds = 0;
  let isTimerRunning = false;

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");

    mqttClient.subscribe("timer_control");
    mqttClient.subscribe("timer");

    mqttClient.on("message", (topic, message) => {
      if (topic === "timer_control") {
        handleTimerControlMessage(message.toString());
      }
    });

    function handleTimerControlMessage(command) {
      if (command === "start") {
        startTimer();
      } else if (command === "stop") {
        stopTimer();
      } else if (command === "reset_timer") {
        resetTimer();
      } else if (command === "get_current_time") {
        getCurrentTime();
      }
    }

    let intervalId;
    function startTimer() {
      if (!isTimerRunning) {
        isTimerRunning = true;
        intervalId = setInterval(() => {
          seconds++;
          mqttClient.publish("timer", seconds.toString());
        }, 1000);
      }
    }

    function stopTimer() {
      isTimerRunning = false;
      clearInterval(intervalId);
    }

    function resetTimer() {
      seconds = 0;
      mqttClient.publish("timer", seconds.toString());
    }

    function getCurrentTime() {
      mqttClient.publish("current_time", seconds.toString());
    }
  });

  return mqttClient;
}

function setupWebSocket(server, mqttClient) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      mqttClient.subscribe("timer");
      mqttClient.subscribe("current_time");
      mqttClient.publish("timer_control", message);
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === "timer") {
        ws.send(JSON.stringify({ event: "timer", value: message.toString() }));
      } else if (topic === "current_time") {
        ws.send(
          JSON.stringify({ event: "current_time", value: message.toString() })
        );
      }
    });

    ws.on("close", () => {});
  });
}

module.exports = { setupMQTT, setupWebSocket };
