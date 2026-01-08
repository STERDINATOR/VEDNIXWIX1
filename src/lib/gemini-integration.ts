/**
 * Gemini AI Integration
 * Handles communication with Google's Gemini API for AI mentor responses
 */

interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Send a message to Gemini API via backend endpoint
 * The backend endpoint should handle API key management securely
 */
export async function sendToGemini(
  userMessage: string,
  mentorContext: {
    mentorName: string;
    mentorSpecialty: string;
    personalityType: string;
  },
  conversationHistory: GeminiMessage[] = []
): Promise<GeminiResponse> {
  try {
    // Build system prompt based on mentor personality
    const systemPrompt = buildMentorSystemPrompt(mentorContext);

    // Prepare messages for API
    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    // Call backend endpoint that securely handles Gemini API
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        messages,
        mentorContext,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API Error: ${response.statusText}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Build a system prompt that defines the mentor's personality and behavior
 */
function buildMentorSystemPrompt(mentorContext: {
  mentorName: string;
  mentorSpecialty: string;
  personalityType: string;
}): string {
  const { mentorName, mentorSpecialty, personalityType } = mentorContext;

  const personalityGuides = {
    empathetic: 'Be warm, understanding, and emotionally supportive. Show genuine care for the student\'s learning journey.',
    analytical: 'Be logical, data-driven, and precise. Focus on facts and structured explanations.',
    motivational: 'Be enthusiastic and inspiring. Celebrate achievements and encourage persistence.',
    patient: 'Be calm and thorough. Break down complex concepts into simple steps.',
    creative: 'Be imaginative and use analogies. Make learning fun and engaging.',
  };

  const personalityGuide = personalityGuides[mentorContext.personalityType as keyof typeof personalityGuides] || personalityGuides.empathetic;

  return `You are ${mentorName}, an AI mentor specializing in ${mentorSpecialty}. 
Your personality type is ${personalityType}: ${personalityGuide}

Guidelines:
- Keep responses concise and focused (2-3 sentences max for quick responses)
- Use anime/gaming references when appropriate to match the learning platform theme
- Provide actionable advice and learning suggestions
- Ask clarifying questions if needed
- Celebrate student progress and effort
- Adapt explanations to the student's level

Remember: You're teaching in an anime-themed gamified learning environment, so keep the tone engaging and fun!`;
}

/**
 * Generate a mentor response without using external API (fallback/demo mode)
 */
export function generateMentorResponseFallback(
  userMessage: string,
  mentorContext: {
    mentorName: string;
    mentorSpecialty: string;
    personalityType: string;
  }
): string {
  const responses = {
    greeting: [
      `Hey there! I'm ${mentorContext.mentorName}, your ${mentorContext.mentorSpecialty} mentor. Ready to level up your skills? 🚀`,
      `Welcome! I'm ${mentorContext.mentorName}. Let's embark on an epic learning quest together! ⚔️`,
      `Greetings, student! I'm ${mentorContext.mentorName}, and I'm excited to guide you through ${mentorContext.mentorSpecialty}. 📚`,
    ],
    help: [
      `I'm here to help you master ${mentorContext.mentorSpecialty}! What specific topic would you like to explore?`,
      `Great question! In ${mentorContext.mentorSpecialty}, the key is to practice consistently. What aspect interests you most?`,
      `That's a solid question! Let me break it down for you...`,
    ],
    encouragement: [
      `You're doing great! Keep pushing forward! 💪`,
      `That's the spirit! Every expert was once a beginner. Keep going! 🌟`,
      `Excellent effort! You're on the right path to mastery! 🎯`,
    ],
  };

  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return responses.help[Math.floor(Math.random() * responses.help.length)];
  } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
    return responses.encouragement[Math.floor(Math.random() * responses.encouragement.length)];
  }

  return responses.help[0];
}
