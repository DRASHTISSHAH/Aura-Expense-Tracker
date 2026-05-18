// src/services/aiService.js
// Handles client-side lightweight connections to high-speed AI endpoints.

const GROQ_API_KEY = import.meta.env.VITE_AURA_AI_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Scans a base64 receipt image using a multimodal AI Vision model.
 * @param {string} base64Image - Base64 data URL string (e.g. data:image/jpeg;base64,...)
 * @returns {Promise<object>} parsed transaction data
 */
export const scanReceipt = async (base64Image) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const systemPrompt = `You are a professional receipt parser and financial OCR AI.
Analyze the provided receipt image and extract the key transaction fields.
You MUST respond ONLY with a valid JSON object matching this schema:
{
  "amount": 12.34, // parsed receipt total amount
  "main_category": "Variable Expenses", // Must be EXACTLY one of: "Fixed Expenses", "Variable Expenses"
  "category": "Food", // Must be EXACTLY one of: "Food", "Shopping", "Travel", "Health", "Entertainment", "Rent", "Mortgage", "Insurance", "Utilities" , "Others","if others please specify category", "Subscription". Match the purchase type as closely as possible.
  "date": "YYYY-MM-DD", // Extract transaction date from receipt. If not found, use today's date: "${today}"
  "merchant": "Merchant Name", // Name of store/provider
  "description": "Short description of what was purchased"
}
Do not include any explanation, intro, outro, or markdown block formatting. Return only the raw, minified JSON object.`;

    const response = await fetch(GROQ_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      const errorText = await response.text();
      throw new Error(`AI service returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const parsedText = data.choices[0]?.message?.content;
    console.log('[AIService OCR Response]:', parsedText);
    return JSON.parse(parsedText);
  } catch (error) {
    console.error('[AIService] OCR receipt scanning failed:', error);
    throw error;
  }
};

/**
 * Gets expense tracking suggestions and answers from a high-power language model.
 * @param {Array} messages - Chat history list
 * @param {Array} transactions - Active user transaction data for deep context
 * @returns {Promise<string>} AI assistant response text
 */
export const getFinancialAdvice = async (messages, transactions) => {
  try {
    const compactTransactions = (transactions || []).map(t => ({
      date: t.transaction_date,
      category: t.category,
      amount: t.amount,
      type: t.type,
      description: t.description
    }));

    const systemPrompt = `You are "Aura", a brilliant, supportive, and sophisticated AI Financial Advisor.
You help users manage their money, track habits, analyze expenses, and discover actionable saving suggestions.

Below is the user's current transaction ledger data for your context:
${JSON.stringify(compactTransactions.slice(0, 30))}

Provide clear, encouraging, and personal budgeting/saving advice. 
When summarizing their spending or giving recommendations, quote actual figures and categories from their data where relevant to prove you have analyzed it!
Format your response in neat, readable markdown with bold text and bullet points. Keep it punchy (150-200 words max).`;

    const response = await fetch(GROQ_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      const errorText = await response.text();
      throw new Error(`AI service returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm having trouble analyzing your request right now. Let's try again in a moment!";
  } catch (error) {
    console.error('[AIService] Chat completion failed:', error);
    throw error;
  }
};
