# Gemini API Component Implementation Examples

This document provides detailed examples of how to integrate Gemini API into each AI-related component.

## 1. AI Chat Interface Component

### Current Implementation (Mock Mode)
```typescript
// /src/components/ui/ai-chat-interface.tsx
import { sendToGemini, generateMentorResponseFallback } from '@/lib/gemini-integration';

const handleSendMessage = async () => {
  if (useGeminiAPI) {
    const result = await sendToGemini(inputValue, {
      mentorName: mentor.name || 'Mentor',
      mentorSpecialty: mentor.specialty || 'Learning',
      personalityType: mentor.personalityType || 'empathetic',
    }, messages.map(m => ({
      role: m.role === 'mentor' ? 'assistant' : m.role,
      content: m.content,
    })));
    
    mentorResponse = result.success
      ? result.message || 'I understand. Tell me more!'
      : 'I encountered an issue. Please try again.';
  } else {
    mentorResponse = generateMentorResponseFallback(inputValue, {
      mentorName: mentor.name || 'Mentor',
      mentorSpecialty: mentor.specialty || 'Learning',
      personalityType: mentor.personalityType || 'empathetic',
    });
  }
};
```

### Updated Implementation (Gemini API)
```typescript
// /src/components/ui/ai-chat-interface.tsx
import { geminiAPI } from '@/lib/gemini-api-service';
import { generateMentorResponseFallback } from '@/lib/gemini-integration';

const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  // Add user message
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: inputValue,
    timestamp: new Date(),
    sentiment: analyzeSentiment(inputValue),
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsLoading(true);

  try {
    let mentorResponse: string;

    if (useGeminiAPI && geminiAPI.isAvailable()) {
      // Use Gemini API
      mentorResponse = await geminiAPI.generateMentorResponse(
        inputValue,
        {
          name: mentor.name || 'Mentor',
          specialty: mentor.specialty || 'Learning',
          personality: mentor.personalityType || 'empathetic',
          expertise: mentor.expertise || []
        }
      );
    } else {
      // Use fallback response
      mentorResponse = generateMentorResponseFallback(inputValue, {
        mentorName: mentor.name || 'Mentor',
        mentorSpecialty: mentor.specialty || 'Learning',
        personalityType: mentor.personalityType || 'empathetic',
      });
    }

    // Add mentor response
    const mentorMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'mentor',
      content: mentorResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, mentorMsg]);
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Fallback to mock response on error
    const fallbackResponse = generateMentorResponseFallback(inputValue, {
      mentorName: mentor.name || 'Mentor',
      mentorSpecialty: mentor.specialty || 'Learning',
      personalityType: mentor.personalityType || 'empathetic',
    });

    const errorMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'mentor',
      content: fallbackResponse,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, errorMsg]);
  } finally {
    setIsLoading(false);
  }
};
```

## 2. Anime Mentor Component

### Integration Example
```typescript
// /src/components/ui/anime-mentor.tsx
import { geminiAPI } from '@/lib/gemini-api-service';
import { geminiAI } from '@/lib/gemini-ai';

// In the mentor response handler
const handleMentorResponse = async (userMessage: string) => {
  setIsAIThinking(true);

  try {
    let response: string;

    // Check if Gemini API is available
    if (geminiAPI.isAvailable()) {
      response = await geminiAPI.generateMentorResponse(
        userMessage,
        {
          name: selectedMentor?.name || 'Mentor',
          specialty: selectedMentor?.specialty || 'Learning',
          personality: selectedMentor?.personalityType || 'empathetic',
          expertise: selectedMentor?.expertise || []
        }
      );
    } else {
      // Fallback to mock responses
      const mentorResponse = await geminiAI.generateMentorResponse(
        userMessage,
        {
          name: selectedMentor?.name || 'Mentor',
          personality: selectedMentor?.personalityType || 'empathetic',
          voiceType: 'friendly',
          expertise: selectedMentor?.expertise || [],
          catchphrase: 'Let\'s learn together!',
          trait: 'Supportive'
        },
        {
          subject: selectedMentor?.specialty,
          difficulty: 'Medium',
          userProgress: 50
        }
      );
      response = mentorResponse.message;
    }

    // Add to chat history
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'mentor',
      message: response,
      timestamp: new Date()
    }]);

  } catch (error) {
    console.error('Error getting mentor response:', error);
    
    // Fallback response
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'mentor',
      message: 'I apologize, but I encountered an issue. Please try again.',
      timestamp: new Date()
    }]);
  } finally {
    setIsAIThinking(false);
  }
};
```

## 3. Anime Pet Component

### Integration Example
```typescript
// /src/components/ui/anime-pet.tsx
import { geminiAPI } from '@/lib/gemini-api-service';
import { geminiAI } from '@/lib/gemini-ai';

const handlePetInteraction = async (interaction: string) => {
  try {
    let petResponse: string;

    if (geminiAPI.isAvailable()) {
      petResponse = await geminiAPI.generatePetResponse(
        interaction,
        {
          name: petName,
          type: petType,
          personality: petPersonality,
          mood: currentMood
        }
      );
    } else {
      const response = await geminiAI.generatePetResponse(
        interaction,
        {
          name: petName,
          type: petType,
          personality: petPersonality,
          level: petLevel,
          mood: currentMood
        },
        {
          studyTime: userStudyTime,
          lastBreak: lastBreakTime,
          mood: userMood,
          timeOfDay: new Date().getHours() > 12 ? 'afternoon' : 'morning',
          userActivity: currentActivity,
          petStats: {
            happiness: petStats.happiness,
            energy: petStats.energy,
            health: petStats.health,
            intelligence: petStats.intelligence
          }
        }
      );
      petResponse = response.message;
    }

    // Display pet response
    setPetMessage(petResponse);
    
    // Update pet animation
    setPetAnimationState('speaking');
    setTimeout(() => setPetAnimationState('idle'), 3000);

  } catch (error) {
    console.error('Error getting pet response:', error);
    setPetMessage('*looks at you with concern*');
  }
};
```

## 4. Character Generator Component

### Integration Example
```typescript
// /src/components/ui/anime-character-generator.tsx
import { geminiAPI } from '@/lib/gemini-api-service';
import { geminiAI } from '@/lib/gemini-ai';

const generateCharacter = async () => {
  setIsGenerating(true);

  try {
    let character: any;

    if (geminiAPI.isAvailable()) {
      character = await geminiAPI.generateCharacterPersonality({
        subject: selectedSubject,
        personality: selectedPersonality,
        learningStyle: selectedLearningStyle
      });
    } else {
      character = await geminiAI.generateCharacterPersonality({
        subject: selectedSubject,
        learningStyle: selectedLearningStyle,
        personality: selectedPersonality,
        userLevel: userLevel,
        userInterests: userInterests
      });
    }

    setGeneratedCharacter(character);
    setShowPreview(true);

  } catch (error) {
    console.error('Error generating character:', error);
    
    // Show error message
    setError('Failed to generate character. Please try again.');
    
    // Fallback: use a default character
    setGeneratedCharacter({
      name: 'Akira Sensei',
      personality: 'Wise and encouraging mentor',
      voiceType: 'wise',
      expertise: ['General Learning'],
      catchphrase: 'Knowledge is power!',
      trait: 'Patient and supportive'
    });
  } finally {
    setIsGenerating(false);
  }
};
```

## 5. Emotion Adaptive Reality Component

### Integration Example
```typescript
// /src/components/ui/emotion-adaptive-reality-shift.tsx
import { geminiAPI } from '@/lib/gemini-api-service';

const handleEmotionDetection = async (emotion: string) => {
  try {
    // Analyze user sentiment
    const sentimentAnalysis = await geminiAPI.analyzeSentiment(
      userInput || emotion
    );

    // Generate adaptive content based on emotion
    const adaptiveContent = await geminiAPI.generateAdaptiveContent(
      currentTopic,
      userLevel,
      sentimentAnalysis.emotion
    );

    // Update learning content
    setAdaptiveContent(adaptiveContent);
    setCurrentEmotion(sentimentAnalysis.emotion);
    setEmotionConfidence(sentimentAnalysis.confidence);

    // Show suggestions
    setSuggestions(sentimentAnalysis.suggestions);

    // Adjust difficulty if needed
    if (sentimentAnalysis.emotion === 'frustrated') {
      setDifficulty('easy');
      showNotification('I notice you might be struggling. Let me simplify this for you.');
    } else if (sentimentAnalysis.emotion === 'excited') {
      setDifficulty('hard');
      showNotification('You seem excited! Ready for a bigger challenge?');
    }

  } catch (error) {
    console.error('Error analyzing emotion:', error);
    // Continue with default content
  }
};
```

## 6. Learning Recommendations Component

### Integration Example
```typescript
// /src/lib/ai-recommendations.ts
import { geminiAPI } from '@/lib/gemini-api-service';

export async function generateAIRecommendations(
  userProfile: UserLearningProfile,
  availableContent: {
    reels: AnimeEducationalReels[];
    quests: Quests[];
    topics: LearningTopics[];
  }
): Promise<Recommendation[]> {
  try {
    // Use Gemini to generate personalized recommendations
    const recommendationText = await geminiAPI.generateRecommendations(
      {
        level: userProfile.currentLevel,
        completedTopics: userProfile.completedTopics,
        preferredTopics: userProfile.preferredTopics,
        learningStyle: userProfile.learningStyle
      },
      {
        topics: availableContent.topics.map(t => t.topicName || ''),
        quests: availableContent.quests.map(q => q.title || ''),
        reels: availableContent.reels.map(r => r.reelTitle || '')
      }
    );

    // Parse recommendations and match with actual content
    const recommendations: Recommendation[] = [];
    
    // Extract mentioned topics from recommendation text
    availableContent.reels.forEach(reel => {
      if (recommendationText.includes(reel.reelTitle || '')) {
        recommendations.push({
          type: 'reel',
          item: reel,
          score: 0.9,
          reason: 'Recommended by AI based on your profile'
        });
      }
    });

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    
    // Fallback to rule-based recommendations
    return generateRecommendations(userProfile, availableContent.reels, availableContent.quests, availableContent.topics);
  }
}
```

## 7. Interactive Quiz Component

### Integration Example
```typescript
// /src/components/ui/interactive-quiz.tsx
import { geminiAPI } from '@/lib/gemini-api-service';

const generateQuiz = async (topic: string, difficulty: string) => {
  setIsLoading(true);

  try {
    const questions = await geminiAPI.generateQuizQuestions(
      topic,
      difficulty,
      5
    );

    setQuestions(questions);
    setCurrentQuestionIndex(0);

  } catch (error) {
    console.error('Error generating quiz:', error);
    
    // Fallback to predefined questions
    setQuestions(getPredefinedQuestions(topic, difficulty));
  } finally {
    setIsLoading(false);
  }
};

const handleAnswerSubmit = async (selectedAnswer: number) => {
  const question = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;

  // Show explanation
  setShowExplanation(true);
  setExplanationText(question.explanation);

  // Update score
  if (isCorrect) {
    setScore(prev => prev + 10);
    setFeedback('Correct! Great job!');
  } else {
    setFeedback(`Incorrect. The correct answer is ${question.options[question.correctAnswer]}`);
  }

  // Move to next question
  setTimeout(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  }, 3000);
};
```

## 8. Mentor Monologue Component

### Integration Example
```typescript
// /src/components/ui/mentor-monologue.tsx
import { geminiAPI } from '@/lib/gemini-api-service';

const generateMonologue = async (topic: string, difficulty: string) => {
  setIsGenerating(true);

  try {
    const monologue = await geminiAPI.generateContent(
      `Create an engaging mentor monologue about "${topic}" at ${difficulty} level.
      
      The monologue should:
      - Be 2-3 minutes of speaking time
      - Use anime/gaming references
      - Include practical examples
      - Be encouraging and motivational
      - End with a call to action
      
      Format as a natural spoken monologue.`,
      {
        temperature: 0.8,
        maxTokens: 1500
      }
    );

    setMonologueText(monologue);
    
    // Optional: Use text-to-speech
    if (useTextToSpeech) {
      await synthesizeSpeech(monologue);
    }

  } catch (error) {
    console.error('Error generating monologue:', error);
    setMonologueText(getFallbackMonologue(topic));
  } finally {
    setIsGenerating(false);
  }
};
```

## 9. Multi-Mentor Collaboration Component

### Integration Example
```typescript
// /src/components/ui/multi-mentor-collaboration.tsx
import { geminiAPI } from '@/lib/gemini-api-service';

const generateMultiplePerspectives = async (topic: string) => {
  setIsLoading(true);

  try {
    const mentors = [
      { name: 'Analytical Mentor', style: 'logical and data-driven' },
      { name: 'Creative Mentor', style: 'imaginative and metaphorical' },
      { name: 'Empathetic Mentor', style: 'warm and supportive' }
    ];

    const perspectives = await Promise.all(
      mentors.map(mentor =>
        geminiAPI.generateContent(
          `You are ${mentor.name}. Explain "${topic}" in a ${mentor.style} way.
          Keep it concise (2-3 sentences) and engaging.`,
          {
            temperature: 0.8,
            maxTokens: 300
          }
        )
      )
    );

    setMentorPerspectives(
      mentors.map((mentor, index) => ({
        mentor: mentor.name,
        perspective: perspectives[index]
      }))
    );

  } catch (error) {
    console.error('Error generating perspectives:', error);
    setMentorPerspectives(getFallbackPerspectives(topic));
  } finally {
    setIsLoading(false);
  }
};
```

## 10. Error Handling Pattern

### Recommended Error Handling
```typescript
import { geminiAPI } from '@/lib/gemini-api-service';
import { getFallbackResponse } from '@/lib/gemini-ai';

async function safeGeminiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T,
  context: string
): Promise<T> {
  try {
    // Check if API is available
    if (!geminiAPI.isAvailable()) {
      console.warn(`⚠️ Gemini API not available for ${context}, using fallback`);
      return fallback;
    }

    // Make API call with timeout
    const timeoutPromise = new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('API timeout')), 30000)
    );

    const result = await Promise.race([
      apiCall(),
      timeoutPromise
    ]);

    return result;

  } catch (error) {
    console.error(`❌ Error in ${context}:`, error);
    
    // Log error for monitoring
    logError({
      context,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date()
    });

    // Return fallback
    return fallback;
  }
}

// Usage
const response = await safeGeminiCall(
  () => geminiAPI.generateMentorResponse(message, mentorContext),
  generateMentorResponseFallback(message, mentorContext),
  'mentor_response'
);
```

## 11. Caching Strategy

### Implement Smart Caching
```typescript
import { geminiAPI } from '@/lib/gemini-api-service';

// Cache frequently used responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 3600000; // 1 hour

async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Check cache
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached response');
    return cached.data;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  responseCache.set(key, { data, timestamp: Date.now() });

  return data;
}

// Usage
const mentorResponse = await getCachedOrFetch(
  `mentor_${mentorId}_${topic}`,
  () => geminiAPI.generateMentorResponse(message, mentorContext)
);
```

## 12. Performance Monitoring

### Add Monitoring
```typescript
import { geminiAPI } from '@/lib/gemini-api-service';

interface APIMetrics {
  endpoint: string;
  duration: number;
  success: boolean;
  timestamp: Date;
  error?: string;
}

const metrics: APIMetrics[] = [];

async function monitoredGeminiCall<T>(
  endpoint: string,
  call: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await call();
    const duration = performance.now() - startTime;

    metrics.push({
      endpoint,
      duration,
      success: true,
      timestamp: new Date()
    });

    return result;

  } catch (error) {
    const duration = performance.now() - startTime;

    metrics.push({
      endpoint,
      duration,
      success: false,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : String(error)
    });

    throw error;
  }
}

// Get metrics
function getMetrics() {
  const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
  const successRate = (metrics.filter(m => m.success).length / metrics.length) * 100;

  return {
    totalCalls: metrics.length,
    avgDuration,
    successRate,
    cacheSize: geminiAPI.getCacheStats().size
  };
}
```

## Summary

These examples show how to:
1. ✅ Replace mock responses with Gemini API calls
2. ✅ Implement proper error handling and fallbacks
3. ✅ Add loading states and user feedback
4. ✅ Cache responses for performance
5. ✅ Monitor API usage and performance
6. ✅ Gracefully degrade when API is unavailable

Each component can be updated independently following these patterns.
