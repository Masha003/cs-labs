const readline = require("readline");

// Define the Romanian alphabet with 31 letters
const ALPHABET = "AĂÂBCDEFGHIÎJKLMNOPQRSTUVWXZ";
const ALPHABET_SIZE = ALPHABET.length;

// Setup readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to preprocess text: removes spaces and converts to uppercase
function preprocessText(text) {
  return text.replace(/\s+/g, "").toUpperCase();
}

// Function to validate the key length and character range
function validateInput(text, key) {
  if (key.length < 7) {
    throw new Error("The key length must be at least 7 characters.");
  }
  const validChars = /[AĂÂBCDEFGHIÎJKLMNOPQRSTUVWXZ]+$/i;
  if (!validChars.test(text) || !validChars.test(key)) {
    throw new Error("Only characters A-Z, a-z, Ă, Â, Î are allowed.");
  }
}

// Get the alphabet index of a character
function charToIndex(char) {
  return ALPHABET.indexOf(char);
}

// Get the character from an alphabet index
function indexToChar(index) {
  return ALPHABET[index % ALPHABET_SIZE];
}

// Vigenère encryption
function encrypt(text, key) {
  let encryptedText = "";
  key = preprocessText(key);
  text = preprocessText(text);
  validateInput(text, key);

  for (let i = 0; i < text.length; i++) {
    const textChar = text[i];
    const keyChar = key[i % key.length];
    const encryptedIndex =
      (charToIndex(textChar) + charToIndex(keyChar)) % ALPHABET_SIZE;
    encryptedText += indexToChar(encryptedIndex);
  }

  return encryptedText;
}

// Vigenère decryption
function decrypt(encryptedText, key) {
  let decryptedText = "";
  key = preprocessText(key);
  encryptedText = preprocessText(encryptedText);
  validateInput(encryptedText, key);

  for (let i = 0; i < encryptedText.length; i++) {
    const encryptedChar = encryptedText[i];
    const keyChar = key[i % key.length];
    const decryptedIndex =
      (charToIndex(encryptedChar) - charToIndex(keyChar) + ALPHABET_SIZE) %
      ALPHABET_SIZE;
    decryptedText += indexToChar(decryptedIndex);
  }

  return decryptedText;
}

// Prompt user for text, key, and operation
rl.question("Enter the text or cryptogram: ", (text) => {
  rl.question("Enter the key (at least 7 characters): ", (key) => {
    rl.question("Choose operation (encrypt/decrypt): ", (operation) => {
      try {
        let result;
        if (operation.toLowerCase() === "encrypt") {
          result = encrypt(text, key);
        } else if (operation.toLowerCase() === "decrypt") {
          result = decrypt(text, key);
        } else {
          throw new Error("Invalid operation. Choose 'encrypt' or 'decrypt'.");
        }

        console.log(`Result: ${result}`);
      } catch (error) {
        console.error(error.message);
      } finally {
        rl.close();
      }
    });
  });
});
