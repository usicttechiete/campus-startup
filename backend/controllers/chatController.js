const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.sendMessage = async (req, res) => {
    try {
        console.log('--- Chat Request Received ---');
        console.log('API Key configured:', !!process.env.GEMINI_API_KEY);

        const { message } = req.body;
        console.log('Message payload:', message);

        if (!message) {
            console.error('Error: Message is missing');
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('CRITICAL: GEMINI_API_KEY is missing from environment variables');
            return res.status(500).json({ error: 'Server configuration error: API Key missing' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini response success');
        res.json({ reply: text });
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
};
