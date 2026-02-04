# Gemini Chatbot Setup Guide

## 🚨 Important: API Key Setup Required

To use the Gemini AI chatbot feature, you **must** configure your own API key.

### Step 1: Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure Environment Variables

1. In the **root directory** of the project (`campus-network/`), create a file named `.env`
2. Add your API key to this file:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Replace** `your_actual_api_key_here` with the actual API key you copied.

### Step 3: Verify Setup

1. Restart your backend server if it's running
2. The chatbot should now work correctly

## 🔒 Security Notes

- **NEVER** commit the `.env` file to git
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Each person using this project needs their own API key
- If your API key is leaked, get a new one immediately from Google AI Studio

## ⚠️ Troubleshooting

### Error: "Your API key was reported as leaked"
- Your API key was exposed publicly (e.g., committed to git)
- **Solution**: Get a new API key and update your `.env` file

### Error: "API Key missing"
- The `.env` file is not configured
- **Solution**: Follow Step 2 above

### Chatbot not responding
- Check that the backend server is running
- Verify the `.env` file exists and contains the API key
- Check terminal logs for error messages
