const commandInput = document.getElementById("commandInput");
const runButton = document.getElementById("runButton");
const resultOutput = document.getElementById("resultOutput");

runButton.addEventListener("click", () => {
  const command = commandInput.value.trim();

  if (!command) {
    resultOutput.textContent = "Silakan tulis perintah terlebih dahulu.";
    return;
  }

  resultOutput.textContent = command;
});
