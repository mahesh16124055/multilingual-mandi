# 🤖 Hugging Face API Setup Guide

## Quick Setup Steps

### 1. Get Your API Key
1. Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Sign up/Login to your account
3. Click "New token"
4. Name: `multilingual-mandi`
5. Role: `Read`
6. Copy the generated token (starts with `hf_...`)

### 2. Configure Your Project
Replace `your_huggingface_api_key_here` in `server/.env` with your actual API key:

```bash
# In server/.env file
HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

### 3. Restart the Server
```bash
cd server
npm restart
# or
npm run dev
```

## ✅ Verification

After adding your API key, the translation service will:
- Use real AI translation models instead of mock translations
- Support all 7 languages: English, Hindi, Tamil, Telugu, Kannada, Marathi, Bengali
- Provide high-quality translations for agricultural and trading terms

## 🔧 Supported Translation Models

The app uses these Helsinki-NLP models from Hugging Face:
- `Helsinki-NLP/opus-mt-en-hi` (English ↔ Hindi)
- `Helsinki-NLP/opus-mt-en-ta` (English → Tamil)
- `Helsinki-NLP/opus-mt-en-te` (English → Telugu)
- `Helsinki-NLP/opus-mt-en-bn` (English → Bengali)
- `Helsinki-NLP/opus-mt-en-mr` (English → Marathi)

## 💡 Benefits of Real API

**Without API Key (Mock Mode):**
- Shows `[हिंदी में अनुवादित] Hello` 
- Basic phrase translation only

**With API Key (AI Mode):**
- Shows `नमस्ते` (proper translation)
- Context-aware translations
- Agricultural terminology support
- Better conversation flow

## 🚨 Important Notes

1. **Free Tier**: Hugging Face provides generous free usage
2. **Rate Limits**: ~1000 requests/hour on free tier
3. **Fallback**: App works without API key using mock translations
4. **Security**: Never commit your API key to version control

## 🔍 Testing Your Setup

1. Start both client and server
2. Go to dashboard → Chat tab
3. Type a message in English
4. Switch language to Hindi
5. You should see proper Hindi translation instead of mock text

## 📞 Need Help?

If you encounter issues:
1. Check server logs for API errors
2. Verify your API key is correct
3. Ensure you have internet connection
4. Try regenerating your token if needed

---

**Made with ❤️ for Viksit Bharat 2047**