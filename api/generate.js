export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    // 2. Access your API Key from Vercel's Environment Variables
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel.' });
    }

    // 3. Forward the prompt to Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
            temperature: 0.2, 
            maxOutputTokens: 1800 
        }
      })
    });

    const data = await response.json();

    // 4. Send the Gemini response back to your HTML page
    res.status(200).json(data);

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
