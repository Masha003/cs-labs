export const analyzeFrequency = (text: string) => {
  const frequency: { [key: string]: number } = {};
  for (let char of text) {
    if (char.match(/[a-zA-Z]/)) {
      char = char.toLowerCase();
      frequency[char] = (frequency[char] || 0) + 1;
    }
  }
  return frequency;
};
