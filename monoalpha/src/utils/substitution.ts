export const substituteCharacters = (
  text: string,
  substitutionMap: { [key: string]: string }
) => {
  return text
    .split("")
    .map((char) => {
      const lowerChar = char.toLowerCase();
      return substitutionMap[lowerChar] || char.toUpperCase();
    })
    .join("");
};
