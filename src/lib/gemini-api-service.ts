/**
 * Gemini API Service
 * Handles direct API calls to Google's Gemini API
 * Replaces mock responses with real AI-generated content
 */

interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

class GeminiAPIService {
  private config: GeminiConfig;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private requestCache = new Map<string, any>();
  private cacheExpiry = 3600000; // 1 hour

  constructor(apiKey?: string) {
    this.config = {
      apiKey: apiKey || import.meta.env.VITE_GEMINI_API_KEY || '',
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-pro',
      temperature: 0.7,
      maxTokens: 1024
    };

    if (!this.config.apiKey) {
      console.warn('⚠️ Gemini API Key not configured. Using fallback responses.');
    }
  }

  /**
   * Generate content using Gemini API
   */
  async generateContent(prompt: string, options?: {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  }): Promise<string> {
    // Check cache first
    const cacheKey = this.getCacheKey(prompt);
    if (this.requestCache.has(cacheKey)) {
      const cached = this.requestCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log('📦 Using cached response');
        return cached.content;
      }
    }

    try {
      if (!this.config.apiKey) {
        throw new Error('Gemini API Key not configured');
      }

      const request: GeminiRequest = {
        contents: [{
          parts: [{
            text: options?.systemPrompt 
              ? `${options.systemPrompt}\n\n${prompt}`
              : prompt
          }]
        }],
        generationConfig: {
          temperature: options?.temperature || this.config.temperature,
          maxOutputTokens: options?.maxTokens || this.config.maxTokens,
          topP: 0.95,
          topK: 40
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      const response = await fetch(
        `${this.baseUrl}/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      const content = data.candidates[0].content.parts[0].text;

      // Cache the response
      this.requestCache.set(cacheKey, {
        content,
        timestamp: Date.now()
      });

      return content;
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw error;
    }
  }

  /**
   * Generate mentor response
   */
  async generateMentorResponse(
    userMessage: string,
    mentorContext: {
      name: string;
      specialty: string;
      personality: string;
      expertise: string[];
    }
  ): Promise<string> {
    const systemPrompt = `You are ${mentorContext.name}, an AI mentor specializing in ${mentorContext.specialty}.
Your personality: ${mentorContext.personality}
Your expertise areas: ${mentorContext.expertise.join(', ')}

Guidelines:
- Keep responses concise (2-3 sentences for quick responses)
- Use encouraging and supportive tone
- Provide actionable advice
- Adapt to the student's level
- Use anime/gaming references when appropriate
- Celebrate progress and effort

Remember: You're teaching in an anime-themed gamified learning environment!`;

    return this.generateContent(userMessage, {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 500
    });
  }

  /**
   * Generate pet response
   */
  async generatePetResponse(
    interaction: string,
    petContext: {
      name: string;
      type: string;
      personality: string;
      mood?: string;
    }
  ): Promise<string> {
    const systemPrompt = `You are ${petContext.name}, a ${petContext.type} companion in an anime learning platform.
Your personality: ${petContext.personality}
Current mood: ${petContext.mood || 'cheerful'}

Guidelines:
- Keep responses short and playful (1-2 sentences)
- Use emojis and cute expressions
- Be supportive and encouraging
- Suggest breaks and self-care
- React to the user's learning progress
- Show personality and emotion

Remember: You're a cute, supportive learning companion!`;

    return this.generateContent(interaction, {
      systemPrompt,
      temperature: 0.9,
      maxTokens: 300
    });
  }

  /**
   * Generate character personality
   */
  async generateCharacterPersonality(preferences: {
    subject?: string;
    personality?: string;
    learningStyle?: string;
  }): Promise<any> {
    const prompt = `Create a unique anime character with the following preferences:
Subject: ${preferences.subject || 'General Learning'}
Personality Type: ${preferences.personality || 'Encouraging'}
Learning Style: ${preferences.learningStyle || 'Interactive'}

Generate a JSON response with:
{
  "name": "Character Name",
  "personality": "Brief personality description",
  "voiceType": "gentle|energetic|wise|friendly",
  "expertise": ["area1", "area2", "area3"],
  "catchphrase": "A memorable catchphrase",
  "trait": "A defining characteristic",
  "backstory": "A brief backstory"
}

Make it creative and anime-themed!`;

    try {
      const response = await this.generateContent(prompt, {
        temperature: 0.9,
        maxTokens: 500
      });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing character response:', error);
      throw error;
    }
  }

  /**
   * Generate learning recommendations
   */
  async generateRecommendations(
    userProfile: {
      level: string;
      completedTopics: string[];
      preferredTopics: string[];
      learningStyle: string;
    },
    availableContent: {
      topics: string[];
      quests: string[];
      reels: string[];
    }
  ): Promise<string> {
    const prompt = `Based on this user profile:
Level: ${userProfile.level}
Completed Topics: ${userProfile.completedTopics.join(', ')}
Preferred Topics: ${userProfile.preferredTopics.join(', ')}
Learning Style: ${userProfile.learningStyle}

Available Content:
Topics: ${availableContent.topics.join(', ')}
Quests: ${availableContent.quests.join(', ')}
Reels: ${availableContent.reels.join(', ')}

Provide 3-5 personalized learning recommendations with brief explanations for why each would be beneficial.`;

    return this.generateContent(prompt, {
      temperature: 0.7,
      maxTokens: 800
    });
  }

  /**
   * Analyze user sentiment/emotion
   */
  async analyzeSentiment(text: string): Promise<{
    emotion: string;
    confidence: number;
    suggestions: string[];
  }> {
    const prompt = `Analyze the emotional sentiment of this text and provide learning support suggestions:
"${text}"

Respond with JSON:
{
  "emotion": "happy|sad|frustrated|confused|excited|neutral",
  "confidence": 0.0-1.0,
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    try {
      const response = await this.generateContent(prompt, {
        temperature: 0.5,
        maxTokens: 300
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing sentiment response:', error);
      throw error;
    }
  }

  /**
   * Generate adaptive learning content
   */
  async generateAdaptiveContent(
    topic: string,
    userLevel: string,
    userMood: string
  ): Promise<string> {
    const prompt = `Generate adaptive learning content for:
Topic: ${topic}
User Level: ${userLevel}
User Mood: ${userMood}

Create engaging, personalized content that:
- Matches the user's current level
- Adapts to their emotional state
- Uses anime/gaming references
- Includes practical examples
- Suggests next steps

Keep it concise but comprehensive.`;

    return this.generateContent(prompt, {
      temperature: 0.8,
      maxTokens: 1000
    });
  }

  /**
   * Generate quiz questions
   */
  async generateQuizQuestions(
    topic: string,
    difficulty: string,
    count: number = 5
  ): Promise<any[]> {
    const prompt = `Generate ${count} quiz questions about "${topic}" at ${difficulty} level.

Format as JSON array:
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct"
  }
]

Make questions engaging and educational.`;

    try {
      const response = await this.generateContent(prompt, {
        temperature: 0.7,
        maxTokens: 2000
      });

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing quiz response:', error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.requestCache.clear();
    console.log('✅ Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.requestCache.size,
      entries: this.requestCache.size
    };
  }

  /**
   * Check if API is available
   */
  isAvailable(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Get service status
   */
  getStatus(): {
    available: boolean;
    model: string;
    cacheSize: number;
    apiKeyConfigured: boolean;
  } {
    return {
      available: this.isAvailable(),
      model: this.config.model,
      cacheSize: this.requestCache.size,
      apiKeyConfigured: !!this.config.apiKey
    };
  }

  /**
   * Generate cache key
   */
  private getCacheKey(prompt: string): string {
    return `gemini_${prompt.substring(0, 100).replace(/\s+/g, '_')}`;
  }
}

// Export singleton instance
export const geminiAPI = new GeminiAPIService();

// Export convenience functions
export async function callGemini(prompt: string, options?: any): Promise<string> {
  return geminiAPI.generateContent(prompt, options);
}

export async function generateMentorResponse(
  message: string,
  mentorContext: any
): Promise<string> {
  return geminiAPI.generateMentorResponse(message, mentorContext);
}

export async function generatePetResponse(
  interaction: string,
  petContext: any
): Promise<string> {
  return geminiAPI.generatePetResponse(interaction, petContext);
}

export async function generateCharacter(preferences: any): Promise<any> {
  return geminiAPI.generateCharacterPersonality(preferences);
}

export async function getRecommendations(
  userProfile: any,
  availableContent: any
): Promise<string> {
  return geminiAPI.generateRecommendations(userProfile, availableContent);
}

export async function analyzeSentiment(text: string): Promise<any> {
  return geminiAPI.analyzeSentiment(text);
}

export type { GeminiConfig, GeminiRequest, GeminiResponse };
