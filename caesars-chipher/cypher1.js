import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getLetterIndex(letter, alphabet) {
  return alphabet.indexOf(letter);
}

function caesarCipher(key, message, isEncrypt) {
  let result = "";

  for (let char of message) {
    if (alphabet.includes(char)) {
      let letterIndex = getLetterIndex(char, alphabet);
      let shift = isEncrypt ? key : -key;
      let newIndex = (letterIndex + shift + 26) % 26;
      result += alphabet[newIndex];
    }
  }
  return result;
}

function processInput() {
  rl.question(
    "Enter 'e' for encryption or 'd' for decryption: ",
    (operation) => {
      rl.question("Enter the key (1-25): ", (keyInput) => {
        let key = parseInt(keyInput);
        if (key < 1 || key > 25) {
          console.log("Invalid key. It must be between 1 and 25.");
          process.exit(1);
        }
        rl.question(
          "Enter the message or cryptogram (only letters): ",
          (message) => {
            message = message.replace(/\s+/g, "").toUpperCase();

            let isEncrypt = operation === "e";
            let output = caesarCipher(key, message, isEncrypt);

            console.log(`The result is: ${output}`);
            rl.close();
          }
        );
      });
    }
  );
}

processInput();
