const fs = require("fs");

function saveLogsToFile(message) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;

  fs.appendFile("logs.txt", logMessage, (err) => {
    if (err) {
      console.error("Błąd podczas zapisywania do pliku:", err);
    }
  });
}

module.exports = {
  saveLogsToFile,
};
