# Gemini API Integration Setup Guide

This guide explains how to set up the Gemini API integration for the AI Mentor System.

## Overview

The AI Mentor System includes support for Google's Gemini API to provide intelligent, context-aware responses from AI mentors. The integration is designed with security in mind - API keys are never exposed to the frontend.

## Architecture

```
Frontend (React)
    ↓
Backend Endpoint (/api/gemini)
    ↓
Google Gemini API
```

## Setup Steps

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key (keep it secret!)

### 2. Create Backend Endpoint

You need to create a backend endpoint at `/api/gemini` that:
- Accepts POST requests with message data
- Securely stores and uses your Gemini API key
- Communicates with Google's Gemini API
- Returns responses to the frontend

**Example Node.js/Express endpoint:**

```typescript
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/gemini', async (req, res) => {
  try {
    const { systemPrompt, messages, mentorContext } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Start chat session
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });

    // Send the latest message
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

export default router;
```

### 3. Environment Variables

Add to your `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

### 4. Enable in Frontend

In the Mentor Page, toggle the "Use Gemini API" checkbox to enable API-based responses.

## Features

### Text Sentiment Analysis
- Analyzes user messages for emotional tone
- Detects emotions: very_positive, positive, neutral, negative, very_negative
- Provides confidence scores
- Extracts sentiment keywords

### AI Recommendations
- Generates personalized learning recommendations
- Considers user level, completed topics, and learning style
- Suggests next topics based on content availability
- Scores recommendations by relevance

### Mentor Personality System
- Each mentor has a defined personality type (empathetic, analytical, motivational, patient, creative)
- System prompts adapt mentor responses to their personality
- Ensures consistent character throughout conversations

## Frontend Components

### MentorSelector
- Browse and select from available mentors
- View mentor specialties, personality types, and experience levels
- Visual mentor cards with avatars

### AIChatInterface
- Real-time chat with selected mentor
- Sentiment analysis of user messages
- Message history and timestamps
- Loading states and error handling

### VideoCallInterface
- Simulated video call UI
- Mentor avatar display
- Call duration tracking
- Microphone and camera controls
- Connection status indicators

### EmotionDetector
- Simulated emotion detection UI
- User selects emotion from 5 options
- Animated detection feedback
- Ready for real webcam integration

### AIRecommendationsDisplay
- Shows personalized learning recommendations
- Displays match scores and reasons
- Suggests next topic to study
- Links to reels, quests, and topics

## Fallback Mode

If the Gemini API is not available or disabled:
- The system uses `generateMentorResponseFallback()` function
- Provides contextual responses based on user input
- Maintains conversation flow without API dependency

## Security Considerations

1. **Never expose API keys in frontend code**
2. **Use environment variables for sensitive data**
3. **Implement rate limiting on backend endpoint**
4. **Validate and sanitize user input**
5. **Log API usage for monitoring**

## Testing

### Test Sentiment Analysis
```typescript
import { analyzeSentiment } from '@/lib/sentiment-analysis';

const result = analyzeSentiment('I love this course!');
console.log(result); // { score: 1, emotion: 'very_positive', ... }
```

### Test Recommendations
```typescript
import { generateRecommendations } from '@/lib/ai-recommendations';

const recs = generateRecommendations(userProfile, reels, quests, topics);
console.log(recs); // Array of recommendations with scores
```

## Troubleshooting

### API Key Errors
- Verify API key is correct
- Check that API is enabled in Google Cloud Console
- Ensure rate limits haven't been exceeded

### No Responses
- Check backend endpoint is running
- Verify CORS settings if frontend and backend are on different domains
- Check browser console for network errors

### Sentiment Analysis Not Working
- Ensure keywords are in lowercase
- Check that text contains recognizable sentiment words
- Verify sentiment analysis library is imported correctly

## Future Enhancements

1. **Real Webcam Integration**
   - Add face-api.js or ml5.js for real emotion detection
   - Integrate with video call interface

2. **Advanced NLP**
   - Implement more sophisticated sentiment analysis
   - Add entity recognition for better context understanding

3. **Conversation Memory**
   - Store conversation history in database
   - Implement long-term learning from user interactions

4. **Multi-Language Support**
   - Translate mentor responses
   - Support international users

5. **Analytics Dashboard**
   - Track user engagement with mentors
   - Monitor recommendation effectiveness
   - Analyze learning patterns

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Google Generative AI documentation
3. Check browser console for error messages
4. Verify all environment variables are set correctly
