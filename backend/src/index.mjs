// Import the AWS SDK for JavaScript using ES module syntax.
// We specifically need the 'TranslateClient' and 'TranslateTextCommand'
// from the '@aws-sdk/client-translate' package.
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

// Create a new Translate client instance.
// This client will be used to make API calls to the Amazon Translate service.
// It automatically picks up AWS credentials and region from the Lambda environment.
const translateClient = new TranslateClient({});

/**
 * This is the main handler function for your AWS Lambda.
 * When your API Gateway endpoint is invoked, this function will be executed.
 *
 * @param {object} event - The input event to the Lambda function.
 * For an API Gateway proxy integration, this object contains details
 * about the HTTP request, including headers, body, and query parameters.
 * @param {object} context - The runtime information of the Lambda function.
 * (Not directly used in this example, but useful for logging, etc.)
 * @returns {object} - An object representing the HTTP response to be sent back
 * through API Gateway. It must include `statusCode`, `headers`, and `body`.
 */
export const handler = async (event) => { // Changed `exports.handler` to `export const handler` for ESM
  // --- DEBUGGING: Log the raw event to CloudWatch to see what API Gateway sends ---
  console.log("Received event:", JSON.stringify(event, null, 2));

  // --- Step 1: Parse the incoming request body ---
  // API Gateway sends the request body as a string. We need to parse it
  // from a JSON string into a JavaScript object.
  let requestBody;
  try {
    // Check if event.body exists and is a string before parsing
    if (event.body && typeof event.body === 'string') {
      requestBody = JSON.parse(event.body);
    } else {
      // If no body or not a string, assume empty or invalid body
      console.warn("event.body is missing or not a string. Assuming empty request body.");
      requestBody = {};
    }
  } catch (error) {
    // If the request body is not valid JSON, return a 400 Bad Request error.
    console.error("Failed to parse request body:", error);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Crucial for CORS (Cross-Origin Resource Sharing)
                                           // Allows your React app (from a different domain) to call this Lambda.
      },
      body: JSON.stringify({ message: "Invalid JSON in request body." }),
    };
  }

  // --- Step 2: Extract data from the parsed request body ---
  // We expect the React frontend to send `text`, `sourceLanguage`, and `targetLanguage`.
  // Using optional chaining and nullish coalescing to ensure defaults if properties are missing,
  // though based on logs, they should be present.
  const textToTranslate = requestBody?.text || '';
  const sourceLanguageCode = requestBody?.sourceLanguage || '';
  const targetLanguageCode = requestBody?.targetLanguage || '';

  // --- Step 3: Basic validation of the extracted data ---
  if (!textToTranslate || !sourceLanguageCode || !targetLanguageCode) {
    console.error("Missing required parameters.");
    // --- DEBUGGING: Log which parameters are missing ---
    console.error(`Missing: text=${!!textToTranslate} (value: '${textToTranslate}'), sourceLanguage=${!!sourceLanguageCode} (value: '${sourceLanguageCode}'), targetLanguage=${!!targetLanguageCode} (value: '${targetLanguageCode}')`);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: "Missing text, sourceLanguage, or targetLanguage." }),
    };
  }

  // --- Step 4: Prepare the command for Amazon Translate ---
  // Create a `TranslateTextCommand` with the parameters required by Amazon Translate.
  const command = new TranslateTextCommand({
    Text: textToTranslate,
    SourceLanguageCode: sourceLanguageCode,
    TargetLanguageCode: targetLanguageCode,
  });

  // --- Step 5: Call Amazon Translate and handle the response ---
  try {
    // Send the command to the Amazon Translate service.
    // The `await` keyword pauses the execution of this function until the
    // translation response is received.
    const response = await translateClient.send(command);

    // Extract the translated text from the response.
    const translatedText = response.TranslatedText;

    // Return a successful HTTP 200 OK response with the translated text.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Again, important for CORS
      },
      body: JSON.stringify({ translatedText: translatedText }),
    };
  } catch (error) {
    // --- Step 6: Handle any errors during the translation process ---
    // If Amazon Translate returns an error, or there's a network issue,
    // catch it here and return an appropriate error response.
    console.error("Error translating text:", error);
    return {
      statusCode: 500, // Internal Server Error
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: "Failed to translate text.", error: error.message }),
    };
  }
};