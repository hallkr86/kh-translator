import React, { useState, useEffect } from 'react';
import './App.css';

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
      const apiUrl = 'https://u29o5lfwvf.execute-api.us-east-1.amazonaws.com/prod/translate';

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
    <div className="App">
      <div className="form">
        <h1 className="title">
          <span>
            Universal Translator
          </span>
        </h1>

        <div className="enterText">
          <label htmlFor="inputText" className="textLabel">
            Enter Text
          </label>
          <br></br>
          <textarea
            id="inputText"
            className="textBox"
            placeholder="Type or paste text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="6"
          ></textarea>
        </div>

        <br></br>

        <div className="grid">
          <div>
            <label htmlFor="sourceLanguage" className="block-text">
              Source Language: 
            </label>
            <select
              id="sourceLanguage"
              className="select-source"
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
            <label htmlFor="targetLanguage" className="block-text">
              Target Language: 
            </label>
            <select
              id="targetLanguage"
              className="select-target"
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
        
        <br></br>

        <button
          onClick={handleTranslate}
          className="translate-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <span>
              <svg>
                <circle className="circle"></circle>
                <path></path>
              </svg>
              Translating...
            </span>
          ) : (
            'Translate'
          )}
        </button>

        {error && (
          <div className="error">
            {error}
          </div>
        )}
        
        {translatedText && (
         
          <div className="mt-6">
            <br></br>
            <label htmlFor="translatedText" className="textLabel">
              Translated Text
            </label>
            <br></br>
            <textarea
              id="translatedText"
              className="textBox"
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