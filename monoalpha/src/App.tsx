import { useState } from "react";
import { analyzeFrequency } from "./utils/frequencyAnalyzer";
import { substituteCharacters } from "./utils/substitution";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import FrequencyChart from "./components/FrequencyChart";
import { englishLetterFrequency } from "./data/letterFrequency";

function App() {
  const [inputText, setInputText] = useState("");
  const [frequency, setFrequency] = useState<{ [key: string]: number }>({});
  const [substitutionMap, setSubstitutionMap] = useState<{
    [key: string]: string;
  }>({});
  const [charToReplace, setCharToReplace] = useState("");
  const [charReplacement, setCharReplacement] = useState("");
  const [result, setResult] = useState("");

  const handleAnalyze = () => {
    const freq = analyzeFrequency(inputText);
    setFrequency(freq);
  };

  // Add a new substitution to the substitution map
  const handleAddAndSubstitute = () => {
    if (charToReplace && charReplacement) {
      // Create a local updated substitution map
      const updatedMap = {
        ...substitutionMap,
        [charToReplace]: charReplacement,
      };

      // Update the state with the new map
      setSubstitutionMap(updatedMap);

      // Apply the substitution using the updated map
      const substitutedText = substituteCharacters(inputText, updatedMap);
      setResult(substitutedText);

      // Clear the input fields
      setCharToReplace("");
      setCharReplacement("");
    }
  };

  return (
    <div className="container mx-auto font-sans mb-28">
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">
          Frequency Analyzer and Substitution App
        </h1>
      </div>
      <div className="mt-5">
        <h2 className="font-semibold text-lg py-2 border-b mb-5">
          English Letter Frequency
        </h2>
        <FrequencyChart frequency={englishLetterFrequency} />
      </div>
      <div>
        <h2 className="font-semibold text-lg py-2 border-b mb-5">
          Frequency Analysis
        </h2>
        <div className="flex gap-5">
          <Textarea
            className="min-h-[200px] max-w-[700px]"
            placeholder="Enter encrypted text here"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button onClick={handleAnalyze}> Start Frequency Analysis</Button>
        </div>
      </div>
      <div>
        {Object.keys(frequency).length > 0 && (
          <FrequencyChart frequency={frequency} />
        )}
      </div>
      <div>
        <h2 className="font-semibold text-lg py-2 border-b mb-5">
          Characters Substitution
        </h2>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            className="border p-2"
            placeholder="Character to replace"
            maxLength={1}
            value={charToReplace}
            onChange={(e) => setCharToReplace(e.target.value)}
          />
          <input
            type="text"
            className="border p-2"
            placeholder="Replacement character"
            maxLength={1}
            value={charReplacement}
            onChange={(e) => setCharReplacement(e.target.value)}
          />
          <Button onClick={handleAddAndSubstitute}>Add Substitution</Button>
        </div>

        <div className="my-4">
          <h3 className="font-semibold">Current Substitution Map:</h3>
          <ul>
            {Object.entries(substitutionMap).map(([char, sub]) => (
              <li key={char}>
                {char.toUpperCase()} → {sub.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="font-semibold text-lg py-2 border-b mb-5">Result</h2>
        <Textarea
          className="min-h-[230px] max-w-[700px]"
          value={result}
          readOnly
        />
      </div>
    </div>
  );
}

export default App;
