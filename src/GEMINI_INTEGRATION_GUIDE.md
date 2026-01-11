# Gemini AI Integration Guide for VEDNIX

## Overview
This guide explains how to integrate Google's Gemini API for all AI-related features in the VEDNIX learning platform.

## Current Status
- ✅ **Local Mock Mode**: All AI features currently use local mock responses (stable, no external API calls)
- ⏳ **Gemini Integration**: Ready to be implemented with actual API calls
- 🔧 **Components Using AI**: Mentor, Pet, Emotion Detection, Recommendations, Character Generation

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_MODEL=gemini-pro
VITE_USE_GEMINI_API=true
```

### 3. Enable Gemini in Components
Update component props to use Gemini:
```typescript
// Before (Mock Mode)
<AIChatInterface mentor={mentor} useGeminiAPI={false} />

// After (Gemini API)
<AIChatInterface mentor={mentor} useGeminiAPI={true} />
```

## API Features to Integrate

### 1. Mentor Responses
**File**: `/src/lib/gemini-integration.ts`
**Function**: `sendToGemini()`
- Generates contextual mentor responses
- Supports conversation history
- Personality-based responses

### 2. Pet Interactions
**File**: `/src/lib/gemini-ai.ts`
**Function**: `generatePetResponse()`
- Pet personality-based responses
- Context-aware suggestions
- Emotional support messages

### 3. Character Generation
**File**: `/src/lib/gemini-ai.ts`
**Function**: `generateCharacterPersonality()`
- Creates unique anime character personalities
- Customizable based on user preferences
- Generates expertise areas and catchphrases

### 4. Emotion Detection & Adaptation
**File**: `/src/components/ui/emotion-detector.tsx`
- Detects user emotional state
- Adapts learning content accordingly
- Provides mood-based recommendations

### 5. Learning Recommendations
**File**: `/src/lib/ai-recommendations.ts`
- Personalized content suggestions
- Difficulty progression
- Topic recommendations

## Implementation Steps

### Step 1: Update Gemini AI Service
The `geminiAI` service in `/src/lib/gemini-ai.ts` needs to be updated to make actual API calls:

```typescript
// Replace mock responses with actual Gemini API calls
async generateMentorResponse(userMessage, character, context) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: buildPrompt(userMessage, character, context)
        }]
      }]
    })
  });
  
  const data = await response.json();
  return parseResponse(data);
}
```

### Step 2: Update Components to Use Gemini
Components that need updates:
- `AIChatInterface` - Already has `useGeminiAPI` prop
- `AnimeMentor` - Add Gemini toggle
- `AnimePet` - Add Gemini toggle
- `EmotionDetector` - Integrate emotion-based Gemini calls

### Step 3: Add Error Handling
Implement fallback to mock responses if API fails:
```typescript
try {
  const response = await callGeminiAPI(...);
  return response;
} catch (error) {
  console.warn('Gemini API failed, using fallback:', error);
  return getFallbackResponse(...);
}
```

### Step 4: Rate Limiting & Caching
Implement caching to avoid excessive API calls:
```typescript
const cache = new Map();
const getCachedOrFetch = async (key, fetcher) => {
  if (cache.has(key)) return cache.get(key);
  const result = await fetcher();
  cache.set(key, result);
  return result;
};
```

## API Endpoints

### Gemini Pro API
- **Base URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **Method**: POST
- **Auth**: API Key in header or query parameter

### Request Format
```json
{
  "contents": [{
    "parts": [{
      "text": "Your prompt here"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 1024
  }
}
```

### Response Format
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Generated response text"
      }]
    },
    "finishReason": "STOP"
  }]
}
```

## Features by Component

### 1. AI Chat Interface
**Location**: `/src/components/ui/ai-chat-interface.tsx`
**Current**: Uses `sendToGemini()` with fallback
**Enhancement**: Add streaming responses, typing indicators

### 2. Anime Mentor
**Location**: `/src/components/ui/anime-mentor.tsx`
**Current**: Uses `geminiAI.generateMentorResponse()`
**Enhancement**: Add voice synthesis, emotion-aware responses

### 3. Anime Pet
**Location**: `/src/components/ui/anime-pet.tsx`
**Current**: Uses `geminiAI.generatePetResponse()`
**Enhancement**: Add pet personality evolution, mood tracking

### 4. Emotion Adaptive Reality
**Location**: `/src/components/ui/emotion-adaptive-reality-shift.tsx`
**Current**: Mock emotion detection
**Enhancement**: Integrate real emotion detection with Gemini analysis

### 5. Character Generator
**Location**: `/src/components/ui/anime-character-generator.tsx`
**Current**: Uses `geminiAI.generateCharacterPersonality()`
**Enhancement**: Add image generation with Gemini Vision

## Testing

### Test Gemini Connection
```typescript
async function testGeminiConnection() {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, Gemini!'
          }]
        }]
      })
    }
  );
  
  const data = await response.json();
  console.log('Gemini Response:', data);
}
```

### Test Each Feature
1. **Mentor Chat**: Send messages and verify responses
2. **Pet Interaction**: Trigger pet responses
3. **Character Generation**: Create new characters
4. **Emotion Detection**: Test mood-based adaptations
5. **Recommendations**: Verify personalized suggestions

## Troubleshooting

### API Key Issues
- Verify API key is valid in Google AI Studio
- Check environment variable is set correctly
- Ensure API is enabled in Google Cloud Console

### Rate Limiting
- Implement exponential backoff
- Cache responses when possible
- Use batch requests for multiple queries

### Response Parsing
- Validate JSON structure
- Handle partial responses
- Implement timeout handling

## Security Considerations

1. **API Key Management**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Request Validation**
   - Sanitize user input
   - Validate response format
   - Implement rate limiting

3. **Data Privacy**
   - Don't send sensitive user data
   - Use appropriate content filters
   - Comply with data protection regulations

## Performance Optimization

1. **Caching**
   - Cache character personalities
   - Cache mentor responses for similar queries
   - Cache recommendations

2. **Batching**
   - Combine multiple requests
   - Use batch API endpoints
   - Reduce API calls

3. **Async Operations**
   - Use async/await properly
   - Implement loading states
   - Show fallback content while loading

## Future Enhancements

1. **Gemini Vision**
   - Analyze user-uploaded images
   - Generate visual explanations
   - Create custom learning materials

2. **Gemini Audio**
   - Voice-based mentor interactions
   - Text-to-speech for responses
   - Audio-based emotion detection

3. **Advanced Features**
   - Multi-turn conversations
   - Context-aware learning paths
   - Real-time collaboration

## Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/python_quickstart)
- [API Reference](https://ai.google.dev/api/rest)
- [Pricing](https://ai.google.dev/pricing)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Google Gemini API documentation
3. Check component-specific implementation guides
4. Test with the provided test functions
