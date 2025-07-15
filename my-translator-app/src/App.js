import React, { useState, useEffect } from 'react';

// Main App component for the translator application
function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setTranslatedText('');

    if (!inputText.trim()) {
      setError('Please enter text to translate.');
      setIsLoading(false);
      return;
    }

    try {
      // --- IMPORTANT CHANGE START ---
      // This is the URL of your AWS API Gateway endpoint
      // Make sure this matches your deployed API Gateway URL exactly
      const apiUrl = 'https://p18ssagca5.execute-api.us-east-1.amazonaws.com/prod/translate';

      // This is the payload your AWS Lambda function expects
      const payload = {
        text: inputText,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers your API Gateway or Lambda might expect (e.g., API Key if configured)
        },
        body: JSON.stringify(payload) // Convert the payload object to a JSON string
      });

      // Check if the HTTP response was successful (status code 2xx)
      if (!response.ok) {
        const errorData = await response.json(); // Try to parse error message from response body
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json(); // Parse the JSON response from your Lambda

      if (result.translatedText) {
        setTranslatedText(result.translatedText); // Set the translated text from your Lambda's response
      } else {
        setError('Translation failed: Unexpected response format from service.');
      }
      // --- IMPORTANT CHANGE END ---

    } catch (err) {
      console.error('Translation error:', err);
      setError(`An error occurred during translation: ${err.message || err}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 font-inter">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
            Universal Translator
          </span>
        </h1>

        <div className="mb-6">
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Text:
          </label>
          <textarea
            id="inputText"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out resize-y min-h-[120px] text-gray-800"
            placeholder="Type or paste text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="6"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="sourceLanguage" className="block text-sm font-medium text-gray-700 mb-2">
              Source Language:
            </label>
            <select
              id="sourceLanguage"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out bg-white text-gray-800"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700 mb-2">
              Target Language:
            </label>
            <select
              id="targetLanguage"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out bg-white text-gray-800"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleTranslate}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
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

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {translatedText && (
          <div className="mt-6">
            <label htmlFor="translatedText" className="block text-sm font-medium text-gray-700 mb-2">
              Translated Text:
            </label>
            <textarea
              id="translatedText"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 resize-y min-h-[120px] cursor-not-allowed"
              value={translatedText}
              readOnly
              rows="6"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;