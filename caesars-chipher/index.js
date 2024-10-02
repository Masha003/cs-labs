import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getLetterIndex(letter, alphabet) {
  return alphabet.indexOf(letter);
}

function createModifiedAlphabet(key2) {
  let key2Upper = key2.toUpperCase();
  let newAlphabet = [];

  for (let char of key2Upper) {
    if (!newAlphabet.includes(char)) {
      newAlphabet.push(char);
    }
  }

  for (let char of alphabet) {
    if (!newAlphabet.includes(char)) {
      newAlphabet.push(char);
    }
  }

  return newAlphabet;
}

function caesarCipherSecondKey(key1, key2, message, isEncrypt) {
  let result = "";

  let modifiedAlphabet = createModifiedAlphabet(key2);

  for (let i = 0; i < message.length; i++) {
    let char = message[i];

    if (modifiedAlphabet.includes(char)) {
      let letterIndex = getLetterIndex(char, modifiedAlphabet);

      let shift1 = isEncrypt ? key1 : -key1;

      let newIndex = (letterIndex + shift1 + 26) % 26;
      result += modifiedAlphabet[newIndex];
    } else {
      result += char;
    }
  }

  return result;
}

function processInput2() {
  rl.question(
    "Enter 'e' for encryption or 'd' for decryption: ",
    (operation) => {
      rl.question("Enter the first key (1-25): ", (keyInput) => {
        let key1 = parseInt(keyInput);
        if (key1 < 1 || key1 > 25) {
          console.log("Invalid key. It must be between 1 and 25.");
          process.exit(1);
        }

        rl.question(
          "Enter the second key (string of Latin letters, at least 7): ",
          (key2) => {
            key2 = key2.replace(/\s+/g, "").toUpperCase();

            if (key2.length < 7 || !/^[A-Za-z]+$/.test(key2)) {
              console.log(
                "Invalid second key. It must be at least 7 Latin letters."
              );
              process.exit(1);
            }

            rl.question(
              "Enter the message or cryptogram (only letters): ",
              (message) => {
                message = message.replace(/\s+/g, "").toUpperCase();

                let isEncrypt = operation === "e";
                let output = caesarCipherSecondKey(
                  key1,
                  key2,
                  message,
                  isEncrypt
                );

                console.log(`The result is: ${output}`);
                rl.close();
              }
            );
          }
        );
      });
    }
  );
}

processInput2();
