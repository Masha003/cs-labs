import * as readline from "readline";

const IP = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38,
  30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39,
  31, 23, 15, 7,
];

function textToBinary(text: string): string {
  return text
    .split("")
    .map((char) => {
      return char.charCodeAt(0).toString(2).padStart(8, "0");
    })
    .join("");
}

function permute(input: string, table: number[]): string {
  return table.map((position) => input[position - 1]).join("");
}

function displayTable(tableName: string, table: number[]) {
  console.log(`${tableName} Table:`);
  for (let i = 0; i < table.length; i += 8) {
    console.log(
      table
        .slice(i, i + 8)
        .map((n) => n.toString().padStart(2, " "))
        .join(" ")
    );
  }
  console.log("");
}

// Main function
function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Enter an 8-character message or press Enter to generate one randomly:",
    (answer) => {
      let message = answer;

      if (message.length === 0) {
        // Generate random 8-character string
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        message = "";
        for (let i = 0; i < 8; i++) {
          message += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        console.log(`Randomly generated message: ${message}`);
      } else if (message.length !== 8) {
        console.log("Message must be exactly 8 characters long.");
        rl.close();
        return;
      }

      console.log(`\Message: ${message}`);

      // Convert message to binary
      const binaryMessage = textToBinary(message);
      console.log(`Binary plaintext: ${binaryMessage}`);

      // Display binary in blocks of 8 bits (for each character)
      console.log("Plaintext in octets:");
      for (let i = 0; i < binaryMessage.length; i += 8) {
        console.log(binaryMessage.slice(i, i + 8));
      }

      // Initial Permutation
      console.log("\nInitial Permutation Table (IP):");
      displayTable("IP", IP);

      const permutedMessage = permute(binaryMessage, IP);
      console.log(`Message after the Initial Permutation: ${permutedMessage}`);

      const L0 = permutedMessage.slice(0, 32);
      const R0 = permutedMessage.slice(32, 64);

      console.log(`\nL0: ${L0}`);
      console.log(`R0: ${R0}`);

      const L1 = R0;
      console.log(`\nL1 (equal with R0): ${L1}`);

      rl.close();
    }
  );
}

main();
