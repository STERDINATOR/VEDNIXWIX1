// Gemini AI Integration for VEDNIX
// This service provides AI-powered features for the anime mentor and pet
// STABLE MODE: Uses only local mock/simulated responses - no external API calls

interface GeminiConfig {
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface GeminiResponse {
  text: string;
  confidence: number;
  metadata?: any;
}

interface CharacterPersonality {
  name: string;
  personality: string;
  voiceType: 'gentle' | 'energetic' | 'wise' | 'friendly';
  expertise: string[];
  catchphrase: string;
  trait: string;
  backstory?: string;
}

interface MentorResponse {
  message: string;
  emotion: 'happy' | 'encouraging' | 'thoughtful' | 'excited' | 'supportive' | 'concerned' | 'proud' | 'curious' | 'empathetic';
  actionSuggestion?: string;
  studyTip?: string;
  personalizedAdvice?: string;
  motivationalQuote?: string;
}

interface PetResponse {
  message: string;
  mood: 'playful' | 'caring' | 'energetic' | 'sleepy' | 'excited' | 'concerned' | 'proud' | 'curious' | 'affectionate';
  reminder?: string;
  healthTip?: string;
  encouragement?: string;
  activitySuggestion?: string;
}

class GeminiAIService {
  private config: GeminiConfig;
  private isAvailable: boolean = true; // Always true - using local mock responses only

  constructor() {
    this.config = {
      model: 'gemini-pro-local',
      temperature: 0.7,
      maxTokens: 500
    };
    
    // Initialize service with local mock mode
    this.initializeService();
  }

  private async initializeService() {
    // Service is always available in stable mode - uses only local mock responses
    this.isAvailable = true;
    console.log('🎯 Gemini AI Service initialized in STABLE MODE (Local Mock Responses)');
    console.log('✅ No external API calls - using reliable fallback responses');
  }

  // Generate anime character personality using AI (STABLE MODE - Local Mock Only)
  async generateCharacterPersonality(preferences: {
    subject?: string;
    learningStyle?: string;
    personality?: string;
    userLevel?: number;
    userInterests?: string[];
  }): Promise<CharacterPersonality> {
    // STABLE MODE: Always use local mock responses - no external API calls
    try {
      // Simulate brief processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      
      // Use reliable local mock response
      const character = this.getFallbackCharacter(preferences);
      console.log(`✅ Character generated locally: ${character.name}`);
      return character;
    } catch (error) {
      console.error('Error generating character:', error);
      return this.getFallbackCharacter(preferences);
    }
  }

  // Generate mentor response using AI (STABLE MODE - Local Mock Only)
  async generateMentorResponse(
    userMessage: string,
    character: CharacterPersonality,
    context: {
      subject?: string;
      difficulty?: string;
      userProgress?: number;
      recentActivity?: string;
      userMood?: string;
      timeOfDay?: string;
      studySession?: {
        duration: number;
        questionsAnswered: number;
        correctAnswers: number;
        streak: number;
      };
    }
  ): Promise<MentorResponse> {
    // STABLE MODE: Always use local mock responses - no external API calls
    try {
      // Simulate brief processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
      
      // Use reliable local mock response
      const response = this.getFallbackMentorResponse(userMessage, character);
      console.log(`✅ Mentor response generated locally`);
      return response;
    } catch (error) {
      console.error('Error generating mentor response:', error);
      return this.getFallbackMentorResponse(userMessage, character);
    }
  }

  // Generate pet response using AI (STABLE MODE - Local Mock Only)
  async generatePetResponse(
    interaction: string,
    petPersonality: {
      name: string;
      type: string;
      personality: string;
      level?: number;
      mood?: string;
    },
    context: {
      studyTime?: number;
      lastBreak?: number;
      mood?: string;
      timeOfDay?: string;
      userActivity?: string;
      petStats?: {
        happiness: number;
        energy: number;
        health: number;
        intelligence: number;
      };
      environmentalFactors?: {
        weather?: string;
        season?: string;
        userStressLevel?: 'low' | 'medium' | 'high';
      };
    }
  ): Promise<PetResponse> {
    // STABLE MODE: Always use local mock responses - no external API calls
    try {
      // Simulate brief processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
      
      // Use reliable local mock response
      const response = this.getFallbackPetResponse(interaction, petPersonality);
      console.log(`✅ Pet response generated locally`);
      return response;
    } catch (error) {
      console.error('Error generating pet response:', error);
      return this.getFallbackPetResponse(interaction, petPersonality);
    }
  }

  // Simulate Gemini API response (replace with actual API call)
  private async simulateGeminiResponse(prompt: string): Promise<GeminiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // In a real implementation, this would make an actual API call to Gemini
    // For now, we'll return more sophisticated structured responses based on the prompt
    
    if (prompt.includes('Create a unique Japanese anime character')) {
      return {
        text: JSON.stringify({
          name: this.getRandomCharacterName(),
          personality: this.getRandomPersonalityDescription(),
          voiceType: this.getRandomVoiceType(),
          expertise: this.getRandomExpertise(),
          catchphrase: this.getRandomCatchphrase(),
          trait: this.getRandomTrait()
        }),
        confidence: 0.85
      };
    }
    
    if (prompt.includes('You are') && prompt.includes('mentor')) {
      // Enhanced mentor responses based on context
      const isEncouraging = prompt.includes('struggling') || prompt.includes('difficult') || prompt.includes('hard');
      const isExcited = prompt.includes('breakthrough') || prompt.includes('success') || prompt.includes('achievement');
      const isThoughtful = prompt.includes('question') || prompt.includes('concept') || prompt.includes('understand');
      
      let emotion = 'supportive';
      if (isEncouraging) emotion = 'encouraging';
      if (isExcited) emotion = 'excited';
      if (isThoughtful) emotion = 'thoughtful';
      
      return {
        text: JSON.stringify({
          message: this.getContextualMentorMessage(prompt),
          emotion: emotion,
          actionSuggestion: this.getContextualActionSuggestion(prompt),
          studyTip: this.getContextualStudyTip(prompt),
          personalizedAdvice: this.getPersonalizedAdvice(prompt),
          motivationalQuote: this.getMotivationalQuote(prompt)
        }),
        confidence: 0.85
      };
    }
    
    if (prompt.includes('study companion')) {
      // Enhanced pet responses based on context
      const isPlayful = prompt.includes('play') || prompt.includes('fun') || prompt.includes('game');
      const isCaring = prompt.includes('tired') || prompt.includes('stress') || prompt.includes('break');
      const isEnergetic = prompt.includes('energy') || prompt.includes('excited') || prompt.includes('motivated');
      
      let mood = 'caring';
      if (isPlayful) mood = 'playful';
      if (isCaring) mood = 'caring';
      if (isEnergetic) mood = 'energetic';
      
      return {
        text: JSON.stringify({
          message: this.getContextualPetMessage(prompt),
          mood: mood,
          reminder: this.getContextualReminder(prompt),
          healthTip: this.getContextualHealthTip(prompt),
          encouragement: this.getPetEncouragement(prompt),
          activitySuggestion: this.getPetActivitySuggestion(prompt)
        }),
        confidence: 0.80
      };
    }
    
    return {
      text: '{"message": "I\'m here to help you learn!", "emotion": "supportive"}',
      confidence: 0.5
    };
  }

  // Parse AI responses
  private parseCharacterResponse(response: string): CharacterPersonality | null {
    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  private parseMentorResponse(response: string): MentorResponse | null {
    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  private parsePetResponse(response: string): PetResponse | null {
    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  // Fallback responses when AI is not available
  private getFallbackCharacter(preferences: any): CharacterPersonality {
    const characters = [
      {
        name: 'Akira Sensei',
        personality: 'Wise and encouraging mentor who believes in the potential of every student. Always ready with insightful guidance and motivational words.',
        voiceType: 'wise' as const,
        expertise: ['Programming', 'Mathematics', 'Study Techniques', 'Problem Solving'],
        catchphrase: 'Knowledge is the key to unlocking your true potential!',
        trait: 'Infinitely patient and understanding'
      },
      {
        name: 'Yuki Stormcaster',
        personality: 'Energetic and enthusiastic teacher who makes learning fun and exciting. Loves to challenge students with creative approaches.',
        voiceType: 'energetic' as const,
        expertise: ['Science', 'Physics', 'Innovation', 'Creative Thinking'],
        catchphrase: 'Let\'s turn this challenge into an adventure!',
        trait: 'Boundlessly optimistic and creative'
      },
      {
        name: 'Rei Mindweaver',
        personality: 'Gentle and supportive guide who focuses on emotional intelligence and holistic learning. Creates a safe space for growth.',
        voiceType: 'gentle' as const,
        expertise: ['Psychology', 'Emotional Intelligence', 'Mindfulness', 'Personal Growth'],
        catchphrase: 'Every step forward is a victory worth celebrating.',
        trait: 'Deeply empathetic and nurturing'
      }
    ];
    
    return characters[Math.floor(Math.random() * characters.length)];
  }

  private getFallbackMentorResponse(userMessage: string, character: CharacterPersonality): MentorResponse {
    const responses = [
      {
        message: `That's a great question! As ${character.name}, I believe every challenge is an opportunity to grow. Let's work through this together step by step.`,
        emotion: 'encouraging' as const,
        actionSuggestion: 'Try breaking the problem into smaller, manageable parts',
        studyTip: 'Remember to take breaks every 25 minutes to maintain focus'
      },
      {
        message: `I can see you're putting in great effort! ${character.catchphrase} Let me help you understand this concept better.`,
        emotion: 'supportive' as const,
        actionSuggestion: 'Practice with similar examples to reinforce your understanding',
        studyTip: 'Teaching someone else is one of the best ways to solidify your knowledge'
      },
      {
        message: `Excellent thinking! Your curiosity reminds me why I love being a mentor. This topic connects to many other areas you'll explore.`,
        emotion: 'excited' as const,
        actionSuggestion: 'Explore related topics to build a stronger foundation',
        studyTip: 'Create mind maps to visualize connections between concepts'
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getFallbackPetResponse(interaction: string, petPersonality: any): PetResponse {
    const responses = [
      {
        message: `*purrs* You're doing amazing! I'm so proud of how hard you're working. Remember, I'm always here to support you!`,
        mood: 'caring' as const,
        reminder: 'Don\'t forget to drink some water!',
        healthTip: 'Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds'
      },
      {
        message: `*bounces excitedly* Learning is so much fun when we do it together! You're getting stronger every day!`,
        mood: 'playful' as const,
        reminder: 'How about a quick stretch break?',
        healthTip: 'Stand up and do some light stretching to keep your energy up'
      },
      {
        message: `*nuzzles gently* I can sense you're working really hard. Remember to be kind to yourself and celebrate small victories!`,
        mood: 'caring' as const,
        reminder: 'You\'ve been studying for a while - maybe time for a short break?',
        healthTip: 'Deep breathing exercises can help reduce stress and improve focus'
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Random generators for fallback content
  private getRandomCharacterName(): string {
    const names = ['Akira Sensei', 'Yuki Stormcaster', 'Rei Mindweaver', 'Hana Brightstar', 'Kenji Codemaster', 'Saki Dreamweaver'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private getRandomPersonalityDescription(): string {
    const descriptions = [
      'Wise and encouraging mentor who believes in every student\'s potential',
      'Energetic and creative teacher who makes learning an adventure',
      'Gentle and supportive guide focused on holistic growth',
      'Passionate and innovative educator who loves problem-solving',
      'Calm and methodical instructor with infinite patience',
      'Inspiring and motivational coach who celebrates every achievement'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getRandomVoiceType(): 'gentle' | 'energetic' | 'wise' | 'friendly' {
    const types = ['gentle', 'energetic', 'wise', 'friendly'] as const;
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomExpertise(): string[] {
    const allExpertise = ['Programming', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Art', 'Music', 'Psychology'];
    const count = 3 + Math.floor(Math.random() * 2); // 3-4 expertise areas
    return allExpertise.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private getRandomCatchphrase(): string {
    const catchphrases = [
      'Knowledge is the key to unlocking your true potential!',
      'Let\'s turn this challenge into an adventure!',
      'Every step forward is a victory worth celebrating.',
      'Together, we can conquer any learning obstacle!',
      'Your curiosity is your greatest superpower!',
      'Learning never stops, and neither do we!'
    ];
    return catchphrases[Math.floor(Math.random() * catchphrases.length)];
  }

  private getRandomTrait(): string {
    const traits = [
      'Infinitely patient and understanding',
      'Boundlessly optimistic and creative',
      'Deeply empathetic and nurturing',
      'Brilliantly analytical and logical',
      'Wonderfully encouraging and supportive',
      'Remarkably intuitive and insightful'
    ];
    return traits[Math.floor(Math.random() * traits.length)];
  }

  private getRandomMentorMessage(): string {
    const messages = [
      'That\'s a fantastic question! Let\'s explore this concept together and unlock its mysteries.',
      'I can see you\'re really thinking deeply about this. Your analytical approach is impressive!',
      'Excellent progress! You\'re building a strong foundation that will serve you well.',
      'This is exactly the kind of curiosity that leads to breakthrough moments. Keep questioning!',
      'I love how you\'re connecting different concepts. That\'s the mark of a true scholar.',
      'Your persistence is admirable. Remember, every expert was once a beginner.'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getRandomEmotion(): 'happy' | 'encouraging' | 'thoughtful' | 'excited' | 'supportive' {
    const emotions = ['happy', 'encouraging', 'thoughtful', 'excited', 'supportive'] as const;
    return emotions[Math.floor(Math.random() * emotions.length)];
  }

  private getRandomActionSuggestion(): string {
    const suggestions = [
      'Try practicing with a few more examples to reinforce your understanding',
      'Consider creating a mind map to visualize the connections',
      'Break this problem down into smaller, manageable steps',
      'Look for patterns and relationships between different concepts',
      'Practice explaining this to someone else to deepen your knowledge',
      'Apply this concept to a real-world scenario you\'re interested in'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  private getRandomStudyTip(): string {
    const tips = [
      'Use the Pomodoro Technique: 25 minutes of focused study, then a 5-minute break',
      'Create flashcards for key concepts and review them regularly',
      'Teach the concept to someone else - it\'s one of the best ways to learn',
      'Connect new information to things you already know',
      'Take handwritten notes - it helps with memory retention',
      'Practice active recall by testing yourself without looking at notes'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  private getRandomPetMessage(): string {
    const messages = [
      '*purrs contentedly* You\'re doing such a great job! I\'m so proud of your dedication.',
      '*bounces with excitement* Learning together is the best! You make studying fun!',
      '*nuzzles gently* I can feel your determination. You\'re going to achieve amazing things!',
      '*stretches and yawns* Remember to take care of yourself while you learn. Health is important too!',
      '*playful chirp* Your brain is getting stronger every day! Keep up the fantastic work!',
      '*gentle head tilt* I believe in you completely. You have everything it takes to succeed!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getRandomPetMood(): 'playful' | 'caring' | 'energetic' | 'sleepy' | 'excited' {
    const moods = ['playful', 'caring', 'energetic', 'sleepy', 'excited'] as const;
    return moods[Math.floor(Math.random() * moods.length)];
  }

  private getRandomReminder(): string {
    const reminders = [
      'Don\'t forget to drink some water! Hydration helps your brain work better.',
      'How about a quick stretch? Your body will thank you!',
      'Remember to blink often and rest your eyes occasionally.',
      'Time for a short walk? Fresh air can boost your creativity!',
      'Have you eaten recently? Your brain needs fuel to function well.',
      'Consider doing some deep breathing exercises to stay relaxed.'
    ];
    return reminders[Math.floor(Math.random() * reminders.length)];
  }

  private getRandomHealthTip(): string {
    const tips = [
      'Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds',
      'Stand up and do some light stretching to improve circulation',
      'Deep breathing exercises can help reduce stress and improve focus',
      'Keep your workspace well-lit to reduce eye strain',
      'Maintain good posture to prevent back and neck pain',
      'Take regular breaks to prevent mental fatigue'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // Enhanced contextual response generators with additional helper methods
  private getPersonalizedAdvice(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('programming') || lowerPrompt.includes('code')) {
      const programmingAdvice = [
        'Consider joining coding communities like GitHub or Stack Overflow to learn from others',
        'Build a portfolio of projects that showcase your growing skills',
        'Practice pair programming with friends to learn collaborative coding',
        'Set up a consistent coding environment and learn keyboard shortcuts for efficiency'
      ];
      return programmingAdvice[Math.floor(Math.random() * programmingAdvice.length)];
    }
    
    if (lowerPrompt.includes('math') || lowerPrompt.includes('calculation')) {
      const mathAdvice = [
        'Keep a math journal to track your problem-solving strategies and insights',
        'Form study groups to discuss different approaches to complex problems',
        'Use online tools like Desmos or GeoGebra to visualize mathematical concepts',
        'Connect math to your interests - find applications in music, art, or sports'
      ];
      return mathAdvice[Math.floor(Math.random() * mathAdvice.length)];
    }
    
    const generalAdvice = [
      'Create a dedicated study space that inspires focus and creativity',
      'Set specific, achievable goals for each study session',
      'Reward yourself for reaching milestones to maintain motivation',
      'Track your progress visually to see how far you\'ve come'
    ];
    return generalAdvice[Math.floor(Math.random() * generalAdvice.length)];
  }

  private getMotivationalQuote(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('struggling') || lowerPrompt.includes('difficult')) {
      const encouragingQuotes = [
        '"The expert in anything was once a beginner." - Helen Hayes',
        '"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
        '"It does not matter how slowly you go as long as you do not stop." - Confucius',
        '"Believe you can and you\'re halfway there." - Theodore Roosevelt'
      ];
      return encouragingQuotes[Math.floor(Math.random() * encouragingQuotes.length)];
    }
    
    if (lowerPrompt.includes('success') || lowerPrompt.includes('achievement')) {
      const successQuotes = [
        '"Success is the sum of small efforts repeated day in and day out." - Robert Collier',
        '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
        '"Excellence is not a skill, it\'s an attitude." - Ralph Marston',
        '"Your limitation—it\'s only your imagination."'
      ];
      return successQuotes[Math.floor(Math.random() * successQuotes.length)];
    }
    
    const generalQuotes = [
      '"Learning never exhausts the mind." - Leonardo da Vinci',
      '"The beautiful thing about learning is that no one can take it away from you." - B.B. King',
      '"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela',
      '"Live as if you were to die tomorrow. Learn as if you were to live forever." - Mahatma Gandhi'
    ];
    return generalQuotes[Math.floor(Math.random() * generalQuotes.length)];
  }
  private getContextualMentorMessage(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('struggling') || lowerPrompt.includes('difficult')) {
      const encouragingMessages = [
        "I can see you're facing a challenge, but remember - every expert was once a beginner. Let's break this down together step by step.",
        "Difficulties are just opportunities in disguise! Your persistence shows real character, and I believe in your ability to overcome this.",
        "I understand this feels overwhelming right now. Take a deep breath - we'll tackle this systematically and you'll master it.",
        "Struggling is part of learning! Your brain is literally rewiring itself right now. That's incredible progress, even if it doesn't feel like it."
      ];
      return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    }
    
    if (lowerPrompt.includes('success') || lowerPrompt.includes('achievement') || lowerPrompt.includes('completed')) {
      const celebratoryMessages = [
        "Outstanding work! Your dedication is paying off beautifully. I'm genuinely proud of how far you've come!",
        "Incredible achievement! You've shown that persistence and smart work lead to real results. Keep this momentum going!",
        "Fantastic! This success is proof of your growing expertise. You're becoming quite the scholar!",
        "Brilliant! Your hard work has culminated in this wonderful achievement. You should feel very proud!"
      ];
      return celebratoryMessages[Math.floor(Math.random() * celebratoryMessages.length)];
    }
    
    if (lowerPrompt.includes('question') || lowerPrompt.includes('understand') || lowerPrompt.includes('explain')) {
      const thoughtfulMessages = [
        "That's an excellent question that shows you're thinking deeply about this concept. Let me help clarify this for you.",
        "I love your curiosity! This question demonstrates real analytical thinking. Here's how I'd approach this...",
        "Great question! Understanding comes from asking the right questions, and you're definitely on the right track.",
        "Your question reveals sophisticated thinking about this topic. Let's explore this concept together."
      ];
      return thoughtfulMessages[Math.floor(Math.random() * thoughtfulMessages.length)];
    }
    
    // Default contextual responses
    return this.getRandomMentorMessage();
  }

  private getContextualActionSuggestion(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('struggling') || lowerPrompt.includes('difficult')) {
      const supportiveActions = [
        'Break this problem into smaller, more manageable pieces and tackle them one at a time',
        'Try explaining the concept out loud to yourself - this often reveals where understanding breaks down',
        'Look for patterns or connections to concepts you already understand well',
        'Take a short break and return with fresh eyes - sometimes distance brings clarity'
      ];
      return supportiveActions[Math.floor(Math.random() * supportiveActions.length)];
    }
    
    if (lowerPrompt.includes('success') || lowerPrompt.includes('completed')) {
      const progressiveActions = [
        'Build on this success by tackling the next challenge while your confidence is high',
        'Teach this concept to someone else to reinforce your understanding',
        'Apply this knowledge to a real-world project or problem',
        'Reflect on what strategies worked well here and apply them to future learning'
      ];
      return progressiveActions[Math.floor(Math.random() * progressiveActions.length)];
    }
    
    return this.getRandomActionSuggestion();
  }

  private getContextualStudyTip(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('programming') || lowerPrompt.includes('code')) {
      const codingTips = [
        'Practice coding daily, even if just for 15 minutes - consistency builds muscle memory',
        'Read other people\'s code to learn different approaches and best practices',
        'Debug by explaining your code line-by-line to a rubber duck (or imaginary friend)',
        'Build small projects to apply concepts in practical, meaningful ways'
      ];
      return codingTips[Math.floor(Math.random() * codingTips.length)];
    }
    
    if (lowerPrompt.includes('math') || lowerPrompt.includes('calculation')) {
      const mathTips = [
        'Practice mental math daily to build number sense and calculation speed',
        'Draw diagrams and visual representations to understand abstract concepts',
        'Work through problems step-by-step and check each step before proceeding',
        'Connect mathematical concepts to real-world applications you care about'
      ];
      return mathTips[Math.floor(Math.random() * mathTips.length)];
    }
    
    if (lowerPrompt.includes('physics') || lowerPrompt.includes('science')) {
      const scienceTips = [
        'Visualize concepts with diagrams, animations, or physical demonstrations',
        'Connect abstract theories to everyday phenomena you can observe',
        'Practice solving problems with different approaches to deepen understanding',
        'Explain scientific concepts in simple terms to test your comprehension'
      ];
      return scienceTips[Math.floor(Math.random() * scienceTips.length)];
    }
    
    return this.getRandomStudyTip();
  }

  private getContextualPetMessage(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('tired') || lowerPrompt.includes('stress') || lowerPrompt.includes('overwhelmed')) {
      const caringMessages = [
        "*nuzzles gently* I can sense you're feeling overwhelmed. Remember, even the strongest warriors need rest. You're doing amazing! 💙",
        "*purrs softly* Your energy feels low, dear friend. How about we take a little break together? I'll keep you company! 🐾",
        "*gentle head bump* I notice you seem stressed. Let's do some deep breathing together - in and out, nice and slow. You've got this! ✨",
        "*curls up beside you* Feeling tired is your body's way of saying you've been working hard. I'm proud of your dedication! 💕"
      ];
      return caringMessages[Math.floor(Math.random() * caringMessages.length)];
    }
    
    if (lowerPrompt.includes('play') || lowerPrompt.includes('fun') || lowerPrompt.includes('game')) {
      const playfulMessages = [
        "*bounces excitedly* Yay! Play time! Learning is so much more fun when we make it a game! What shall we explore together? 🎮",
        "*spins in circles* I love when you're in a playful mood! Your brain learns best when you're having fun! Let's make this awesome! 🌟",
        "*playful pounce* Games make everything better! Your curiosity and joy are the best learning tools you have! 🎯",
        "*happy wiggle* Fun time! When we play while learning, our brains create stronger memories. You're so smart! 🎪"
      ];
      return playfulMessages[Math.floor(Math.random() * playfulMessages.length)];
    }
    
    if (lowerPrompt.includes('achievement') || lowerPrompt.includes('success') || lowerPrompt.includes('completed')) {
      const proudMessages = [
        "*proud purr* You did it! I'm so incredibly proud of you! Your hard work is really paying off! 🏆",
        "*happy dance* Amazing work! Watching you grow and succeed fills my heart with joy! You're incredible! ⭐",
        "*excited chirp* Success! Your determination and effort have led to this wonderful moment! Celebrate! 🎉",
        "*beaming with pride* Look at you go! Every achievement is proof of your amazing potential! I believe in you! 💫"
      ];
      return proudMessages[Math.floor(Math.random() * proudMessages.length)];
    }
    
    return this.getRandomPetMessage();
  }

  private getContextualReminder(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('long') || lowerPrompt.includes('hours') || lowerPrompt.includes('study time')) {
      const breakReminders = [
        'You\'ve been studying for a while! Time for a 10-minute break to recharge your brain',
        'Long study sessions need breaks! How about some fresh air or a quick walk?',
        'Your brain processes information better with regular breaks. Time to pause and refresh!',
        'Extended focus is impressive, but your mind needs rest to consolidate learning'
      ];
      return breakReminders[Math.floor(Math.random() * breakReminders.length)];
    }
    
    if (lowerPrompt.includes('late') || lowerPrompt.includes('night') || lowerPrompt.includes('evening')) {
      const sleepReminders = [
        'It\'s getting late! Your brain consolidates memories during sleep - don\'t skip rest',
        'Late night studying? Remember that quality sleep is crucial for memory formation',
        'Evening study sessions are great, but make sure to wind down before bed',
        'Night owl studying? Just remember your brain needs sleep to process today\'s learning'
      ];
      return sleepReminders[Math.floor(Math.random() * sleepReminders.length)];
    }
    
    return this.getRandomReminder();
  }

  private getContextualHealthTip(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('eyes') || lowerPrompt.includes('screen') || lowerPrompt.includes('computer')) {
      const eyeCareTips = [
        'Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds',
        'Adjust your screen brightness to match your surroundings to reduce eye strain',
        'Blink frequently and consciously - we blink less when focusing on screens',
        'Position your screen slightly below eye level and about arm\'s length away'
      ];
      return eyeCareTips[Math.floor(Math.random() * eyeCareTips.length)];
    }
    
    if (lowerPrompt.includes('posture') || lowerPrompt.includes('back') || lowerPrompt.includes('sitting')) {
      const postureTips = [
        'Keep your feet flat on the floor and your back straight against the chair',
        'Adjust your chair height so your elbows are at 90 degrees when typing',
        'Take micro-breaks every 30 minutes to stand and stretch your spine',
        'Keep your shoulders relaxed and avoid hunching forward toward the screen'
      ];
      return postureTips[Math.floor(Math.random() * postureTips.length)];
    }
    
    if (lowerPrompt.includes('stress') || lowerPrompt.includes('anxiety') || lowerPrompt.includes('overwhelmed')) {
      const stressTips = [
        'Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8',
        'Progressive muscle relaxation can help release physical tension from studying',
        'Take a 5-minute mindfulness break to center yourself and reduce stress',
        'Remember that some stress is normal - you\'re challenging yourself to grow!'
      ];
      return stressTips[Math.floor(Math.random() * stressTips.length)];
    }
    
    return this.getRandomHealthTip();
  }

  // Additional helper methods for enhanced pet responses
  private getPetEncouragement(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('tired') || lowerPrompt.includes('overwhelmed')) {
      const encouragements = [
        'You\'re stronger than you know! Every challenge makes you grow! 💪',
        'I believe in you completely! Rest when you need to, then keep going! 🌟',
        'You\'ve overcome difficulties before, and you\'ll do it again! 🦋',
        'Your determination inspires me every day! You\'ve got this! ⭐'
      ];
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    }
    
    if (lowerPrompt.includes('success') || lowerPrompt.includes('achievement')) {
      const celebrations = [
        'Your hard work is paying off beautifully! I\'m so proud! 🎉',
        'Look how far you\'ve come! You\'re amazing! 🏆',
        'Every success is proof of your incredible potential! 🌈',
        'You make learning look so graceful! Keep shining! ✨'
      ];
      return celebrations[Math.floor(Math.random() * celebrations.length)];
    }
    
    const generalEncouragements = [
      'You make every day brighter just by being you! 🌞',
      'Your curiosity and dedication are truly inspiring! 📚',
      'I love watching you grow and learn! You\'re incredible! 🌱',
      'Your journey is unique and beautiful! Keep going! 🦋'
    ];
    return generalEncouragements[Math.floor(Math.random() * generalEncouragements.length)];
  }

  private getPetActivitySuggestion(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('break') || lowerPrompt.includes('tired')) {
      const breakActivities = [
        'How about a quick dance party? Just 2 minutes of moving to your favorite song!',
        'Let\'s do some gentle stretches together - reach for the sky like a cat! 🐱',
        'Time for a mindful breathing exercise - breathe in calm, breathe out stress',
        'How about looking out the window and naming 5 things you can see in nature?'
      ];
      return breakActivities[Math.floor(Math.random() * breakActivities.length)];
    }
    
    if (lowerPrompt.includes('play') || lowerPrompt.includes('fun')) {
      const playActivities = [
        'Let\'s turn your next study session into a game! Set a timer and race against it!',
        'How about creating flashcards with colorful drawings? Make learning visual!',
        'Try explaining what you learned to me like I\'m 5 years old - it\'s fun and helpful!',
        'Let\'s make up a song or rhyme about what you\'re studying! Music helps memory!'
      ];
      return playActivities[Math.floor(Math.random() * playActivities.length)];
    }
    
    const generalActivities = [
      'Try the Pomodoro technique - 25 minutes focused study, then a 5-minute break with me!',
      'How about setting a small reward for yourself when you complete your next goal?',
      'Let\'s practice active recall - close your notes and tell me what you remember!',
      'Try changing your study environment - sometimes a new space brings new energy!'
    ];
    return generalActivities[Math.floor(Math.random() * generalActivities.length)];
  }

  // Public method to check if AI is available
  public isAIAvailable(): boolean {
    return this.isAvailable;
  }

  // Public method to get service status
  public getServiceStatus(): { available: boolean; model: string; features: string[] } {
    return {
      available: this.isAvailable,
      model: this.config.model,
      features: [
        'Character Generation',
        'Mentor Responses',
        'Pet Interactions',
        'Personalized Learning',
        'Emotional Intelligence'
      ]
    };
  }
}

// Export singleton instance and convenience function
export const geminiAI = new GeminiAIService();

// Convenience function for backwards compatibility
export const generateAIResponse = async (prompt: string, context?: any) => {
  return await geminiAI.generateMentorResponse(prompt, {
    name: 'AI Assistant',
    personality: 'Helpful and knowledgeable',
    voiceType: 'friendly',
    expertise: ['General Knowledge'],
    catchphrase: 'I\'m here to help!',
    trait: 'Supportive and encouraging'
  }, context || {});
};

// Export types for use in other components
export type {
  CharacterPersonality,
  MentorResponse,
  PetResponse,
  GeminiResponse
};