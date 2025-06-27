import React, { useState,useEffect } from 'react';
import './App.css';

// Main App component
function App() {
  // State variables for managing form inputs and output
  const [inputText, setInputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en'); // Default source language
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default target language
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState('');


  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' },
    { code: 'hi', name: 'Hindi' },
  ];

  const handleTranslate = async () => {
    setError('');
    setIsLoading(true); // Set loading state to true
    setTranslatedText(''); // Clear previous translation

    if (!inputText.trim()) {
      setError('Please Enter Text to Translate.');
      setIsLoading(false);
      return;
    }

   const prompt = `Translate the following text from ${
    languages.find(lang => lang.code === sourceLanguage)?.name || sourceLanguage
  } to ${
    languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage
  } :\n\n"${inputText}"`;

  let chatHistory = [];
  chatHistory.push({ role: "user", parts: [{ text: prompt }] });

  const payload = { contents: chatHistory };
  const apiKey = "";
  const apiUrl = 'https://p18ssagca5.execute-api.us-east-1.amazonaws.com/prod/translate';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      setTranslatedText(text);
    } else {
      setError('Translation failed: No valid response from the translation service.');
    }
  } catch (err) {
    console.error('Translation error:', err);
    setError('An error occurred during translation. Please try again.');
  } finally {
    setIsLoading(false);
  }
}



  

   return (
    // The outermost `div` sets up the overall layout and background for the app.
    // Tailwind CSS classes are used for styling (e.g., `min-h-screen`, `bg-gradient-to-br`).
    <div className="App">
      {/* The main container for the translator's content. */}
      <div className="form">
        {/* Application Title */}
        <h1 className="title">
          <span>
            Universal Translator
          </span>
        </h1>

        {/* Input Section: Where the user types text to be translated */}
        <div className="mb-6">
          <label htmlFor="inputText" className="textLabel">
            Enter Text:
          </label>
          <textarea
            id="inputText" // Unique ID for accessibility (linking label to input)
            className="textBox"
            placeholder="Type or paste text here..."
            value={inputText} // The value of the textarea is controlled by our `inputText` state.
            onChange={(e) => setInputText(e.target.value)} // When the user types, update the `inputText` state.
                                                           // `e.target.value` gets the current text in the textarea.
            rows="6" // Sets the initial height of the textarea.
          ></textarea>
        </div>

        {/* Language Selection Section: Dropdowns for choosing source and target languages */}
        <div className="dropDowns">
          {/* Source Language Dropdown */}
          <div>
            <label htmlFor="sourceLanguage" className="sourceLanguageLabel">
              Source Language:
            </label>
            <select
              id="sourceLanguage"
              className="sourceLanguageDropdown"
              value={sourceLanguage} // The selected value is controlled by our `sourceLanguage` state.
              onChange={(e) => setSourceLanguage(e.target.value)} // When a new language is selected, update the state.
            >
              {/* Dynamically render options from the `languages` array */}
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}> {/* `key` is important for React to efficiently update lists */}
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          {/* Target Language Dropdown */}
          <div>
            <label htmlFor="targetLanguage" className="targetLanguageLabel">
              Target Language:
            </label>
            <select
              id="targetLanguage"
              className="targetLanguageDropdown"
              value={targetLanguage} // The selected value is controlled by our `targetLanguage` state.
              onChange={(e) => setTargetLanguage(e.target.value)} // When a new language is selected, update the state.
            >
              {/* Dynamically render options from the `languages` array */}
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate} // When this button is clicked, call the `handleTranslate` function.
          className="button"
          disabled={isLoading} // The button is disabled (`true`) if `isLoading` is true.
        >
          {/* Conditional rendering: Show spinner and "Translating..." text if loading, otherwise show "Translate" */}
          {isLoading ? (
            <span className="flex items-center justify-center">
              {/* SVG for a simple spinning loader icon */}
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Translating...
            </span>
          ) : (
            'Translate'
          )}
        </button>

        {/* Error Message Display: Only shows if the `error` state variable has a value */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Translated Output Section: Only shows if `translatedText` has a value */}
        {translatedText && (
          <div className="mt-6">
            <label htmlFor="translatedText" className="block text-sm font-medium text-gray-700 mb-2">
              Translated Text:
            </label>
            <textarea
              id="translatedText"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 resize-y min-h-[120px] cursor-not-allowed"
              value={translatedText} // The value is controlled by our `translatedText` state.
              readOnly // Make the textarea read-only, as the user shouldn't edit the translation.
              rows="6"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;