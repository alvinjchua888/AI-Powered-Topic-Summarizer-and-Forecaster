// Fix: Implement Gemini API service functions
import { GoogleGenAI, Type } from "@google/genai";
import { Reference, ForecastResult, Granularity } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getSummaryAndReferences = async (topic: string): Promise<{ summary: string; references: Reference[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a concise summary about the current state and future of "${topic}".`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const summary = response.text;
    
    let references: Reference[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        references = response.candidates[0].groundingMetadata.groundingChunks
            .map((chunk: any) => ({
                uri: chunk.web?.uri || '',
                title: chunk.web?.title || 'Untitled',
            }))
            .filter((ref: Reference) => ref.uri);
    }
    
    const uniqueReferences = Array.from(new Map(references.map(item => [item.uri, item])).values());

    return { summary, references: uniqueReferences };
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary. Please check the console for more details.");
  }
};

export const getForecast = async (topic: string, duration: number, granularity: Granularity): Promise<ForecastResult> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
            Perform a web search to gather the latest qualitative and quantitative data about "${topic}".
            Based on the search results, generate a forecast for the next ${duration} years, broken down by ${granularity}.

            Your response MUST be a single, raw JSON object, without any markdown formatting (like \`\`\`json).
            
            The JSON object must follow this exact structure:
            {
              "analysis": "A brief analysis of the forecast trends based on the web search results.",
              "methodology": "Describe the forecasting approach used (e.g., trend analysis, regression, sentiment analysis).",
              "formula": "Specify the model or formula used (e.g., 'Linear Regression: y = mx + c', 'Exponential Smoothing'). Be specific.",
              "errorMeasure": "Provide an estimated forecast error measure, such as MAPE (Mean Absolute Percentage Error) or a confidence interval.",
              "forecast": [
                {
                  "time": "A concise label for the time period (e.g., 'W1 Jan', 'Jan 2025', '2025')",
                  "value": "The actual, non-normalized predicted value (e.g., a stock price, index value)."
                }
              ]
            }
            
            Provide only the raw JSON object and nothing else.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }], // Use Google Search for up-to-date data
            },
        });

        const textResponse = response.text.trim();
        
        const firstBracket = textResponse.indexOf('{');
        const lastBracket = textResponse.lastIndexOf('}');

        if (firstBracket === -1 || lastBracket === -1) {
            throw new Error("The API response did not contain a valid JSON object.");
        }

        const jsonText = textResponse.substring(firstBracket, lastBracket + 1);
        
        const forecastResult: ForecastResult = JSON.parse(jsonText);
        
        if (!forecastResult.analysis || !Array.isArray(forecastResult.forecast) || !forecastResult.methodology) {
            throw new Error("Invalid forecast data format received from API.");
        }

        return forecastResult;

    } catch (error) {
        console.error("Error generating forecast:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse forecast data. The API returned invalid JSON.");
        }
        throw new Error("Failed to generate forecast. Please check the console for more details.");
    }
};