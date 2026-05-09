const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Check if the API key actually exists in the system
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ ERROR: GEMINI_API_KEY is missing from .env file!");
      return res.status(500).json({ reply: "My API Key is missing. Please check the .env file." });
    }

    // 2. Initialize the AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const SYSTEM_PROMPT = `You are Uni, an AI for Unices Services. 
    Services: Cleaning (₹599), Sofa (₹299), Bathroom (₹199), Salon (₹399), Electrician (₹199).
    Be friendly and keep it short.`;

    // 3. Try to get a response
    console.log("--- Sending to Google AI ---");
    const result = await model.generateContent(`${SYSTEM_PROMPT}\nUser: ${message}`);
    const response = await result.response;
    const text = response.text();

    console.log("✅ AI Response Success!");
    res.json({ reply: text });

  } catch (err) {
    // 4. THIS IS THE RECTIFICATION: Detailed error logging
    console.log("--- DETAILED ERROR LOG ---");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    
    // If it's a Google-specific error, it often has a 'status'
    if (err.status) console.error("Status Code:", err.status);
    
    res.status(500).json({ 
      reply: "Sorry, I am having trouble. Check the terminal for the 'Detailed Error Log'." 
    });
  }
};