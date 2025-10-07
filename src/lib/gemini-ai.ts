// Enhanced Gemini AI Integration for VEDNIX
// Real-time AI-powered features for anime mentor and pet interactions

interface GeminiConfig {
  apiKey?: AIzaSyCusXcqVwzJmJWOOdpdxxkVtsZ3-XhyC1g;
  model: string;
  temperature: number;
  maxTokens: number;
  realTimeEnabled: boolean;
  notificationsEnabled: boolean;
  wakeUpCommandsEnabled: boolean;
  imageGenerationEnabled: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  studyReminders: boolean;
  breakReminders: boolean;
  motivationalMessages: boolean;
  petCare: boolean;
  customName?: string;
}

interface WakeUpCommand {
  phrase: string;
  customName?: string;
  response: string;
  action?: 'mentor' | 'pet' | 'study' | 'break' | 'help';
}

interface RealTimeSession {
  id: string;
  type: 'mentor' | 'pet' | 'doubt-solving';
  isActive: boolean;
  startTime: Date;
  participantName?: string;
  context: any;
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
  customName?: string; // User-customized name for wake-up commands
  imageUrl?: string; // Real-time generated character image
  voiceSettings?: {
    pitch: number;
    speed: number;
    tone: string;
  };
}

interface MentorResponse {
  message: string;
  emotion: 'happy' | 'encouraging' | 'thoughtful' | 'excited' | 'supportive' | 'concerned' | 'proud' | 'curious' | 'empathetic';
  actionSuggestion?: string;
  studyTip?: string;
  personalizedAdvice?: string;
  motivationalQuote?: string;
  isRealTime?: boolean;
  sessionId?: string;
  audioResponse?: string; // Text-to-speech audio URL
  visualCues?: {
    expression: string;
    gesture: string;
    backgroundEffect?: string;
  };
}

interface PetResponse {
  message: string;
  mood: 'playful' | 'caring' | 'energetic' | 'sleepy' | 'excited' | 'concerned' | 'proud' | 'curious' | 'affectionate';
  reminder?: string;
  healthTip?: string;
  encouragement?: string;
  activitySuggestion?: string;
  isRealTime?: boolean;
  customName?: string;
  imageUrl?: string; // Real-time generated pet image
  animation?: {
    type: 'bounce' | 'purr' | 'wiggle' | 'sleep' | 'play';
    duration: number;
  };
}

interface DoubtSolvingSession {
  id: string;
  subject: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  isActive: boolean;
  startTime: Date;
  responses: Array<{
    timestamp: Date;
    type: 'user' | 'mentor';
    content: string;
    attachments?: string[];
  }>;
  resolution?: {
    solved: boolean;
    satisfaction: number;
    followUpNeeded: boolean;
  };
}

class GeminiAIService {
  private config: GeminiConfig;
  private isAvailable: boolean = false;
  private notificationSettings: NotificationSettings;
  private wakeUpCommands: WakeUpCommand[];
  private activeSessions: Map<string, RealTimeSession>;
  private doubtSolvingSessions: Map<string, DoubtSolvingSession>;
  private notificationInterval?: NodeJS.Timeout;

  constructor() {
    this.config = {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 500,
      realTimeEnabled: true,
      notificationsEnabled: true,
      wakeUpCommandsEnabled: true,
      imageGenerationEnabled: true
    };
    
    this.notificationSettings = {
      enabled: true,
      studyReminders: true,
      breakReminders: true,
      motivationalMessages: true,
      petCare: true
    };

    this.wakeUpCommands = [
      { phrase: 'hey mentor', response: 'I\'m here to help you learn!', action: 'mentor' },
      { phrase: 'wake up pet', response: '*stretches and purrs* I\'m awake! Ready to study together?', action: 'pet' },
      { phrase: 'study time', response: 'Let\'s make this learning session amazing!', action: 'study' },
      { phrase: 'help me', response: 'Of course! What can I help you with?', action: 'help' }
    ];

    this.activeSessions = new Map();
    this.doubtSolvingSessions = new Map();
    
    // Initialize service and start real-time features
    this.initializeService();
    this.startNotificationSystem();
    this.initializeWakeUpCommands();
  }

  private async initializeService() {
    try {
      // In a real implementation, this would check for API availability
      // For now, we'll simulate the service being available
      this.isAvailable = true;
      console.log('Enhanced Gemini AI Service initialized successfully');
      console.log('Real-time features enabled:', {
        realTime: this.config.realTimeEnabled,
        notifications: this.config.notificationsEnabled,
        wakeUpCommands: this.config.wakeUpCommandsEnabled,
        imageGeneration: this.config.imageGenerationEnabled
      });
    } catch (error) {
      console.warn('Gemini AI Service not available, using fallback responses');
      this.isAvailable = false;
    }
  }

  // Real-time notification system
  private startNotificationSystem() {
    if (!this.notificationSettings.enabled) return;

    // Check every 30 minutes for study reminders
    this.notificationInterval = setInterval(() => {
      this.checkAndSendNotifications();
    }, 30 * 60 * 1000);

    console.log('Real-time notification system started');
  }

  private async checkAndSendNotifications() {
    const now = new Date();
    const hour = now.getHours();
    
    // Study reminders during productive hours
    if (this.notificationSettings.studyReminders && (hour >= 9 && hour <= 21)) {
      const lastStudyTime = localStorage.getItem('lastStudyTime');
      const lastStudy = lastStudyTime ? new Date(lastStudyTime) : null;
      
      if (!lastStudy || (now.getTime() - lastStudy.getTime()) > 2 * 60 * 60 * 1000) {
        this.sendNotification({
          title: `${this.notificationSettings.customName || 'Your AI Mentor'} is calling!`,
          message: 'Ready for another learning adventure? Your knowledge awaits! 📚✨',
          type: 'study-reminder',
          action: () => this.triggerWakeUpCommand('study time')
        });
      }
    }

    // Break reminders for active study sessions
    if (this.notificationSettings.breakReminders && this.activeSessions.size > 0) {
      for (const [sessionId, session] of this.activeSessions) {
        const sessionDuration = now.getTime() - session.startTime.getTime();
        if (sessionDuration > 50 * 60 * 1000) { // 50 minutes
          this.sendNotification({
            title: 'Time for a break! 🌸',
            message: 'You\'ve been studying hard! Your pet misses you - time for a quick break together!',
            type: 'break-reminder',
            action: () => this.triggerWakeUpCommand('wake up pet')
          });
        }
      }
    }

    // Pet care reminders
    if (this.notificationSettings.petCare) {
      const lastPetInteraction = localStorage.getItem('lastPetInteraction');
      const lastInteraction = lastPetInteraction ? new Date(lastPetInteraction) : null;
      
      if (!lastInteraction || (now.getTime() - lastInteraction.getTime()) > 4 * 60 * 60 * 1000) {
        this.sendNotification({
          title: 'Your pet needs attention! 🐾',
          message: '*sad meow* I miss you! Come play with me for a few minutes? 💕',
          type: 'pet-care',
          action: () => this.triggerWakeUpCommand('wake up pet')
        });
      }
    }
  }

  private sendNotification(notification: {
    title: string;
    message: string;
    type: string;
    action?: () => void;
  }) {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type
      });

      browserNotification.onclick = () => {
        window.focus();
        notification.action?.();
        browserNotification.close();
      };
    }

    // In-app notification (could trigger a toast or modal)
    this.dispatchCustomEvent('ai-notification', {
      title: notification.title,
      message: notification.message,
      type: notification.type,
      action: notification.action
    });
  }

  // Wake-up command system
  private initializeWakeUpCommands() {
    if (!this.config.wakeUpCommandsEnabled) return;

    // Listen for voice commands (simulated with keyboard shortcuts for demo)
    document.addEventListener('keydown', (event) => {
      // Ctrl + Shift + M for mentor
      if (event.ctrlKey && event.shiftKey && event.key === 'M') {
        this.triggerWakeUpCommand('hey mentor');
      }
      // Ctrl + Shift + P for pet
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        this.triggerWakeUpCommand('wake up pet');
      }
      // Ctrl + Shift + S for study
      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        this.triggerWakeUpCommand('study time');
      }
    });

    console.log('Wake-up commands initialized. Use Ctrl+Shift+M/P/S for quick access!');
  }

  public triggerWakeUpCommand(phrase: string) {
    const command = this.wakeUpCommands.find(cmd => 
      phrase.toLowerCase().includes(cmd.phrase.toLowerCase())
    );

    if (command) {
      const customName = this.notificationSettings.customName;
      let response = command.response;
      
      if (customName && command.action === 'mentor') {
        response = response.replace('I\'m here', `${customName} is here`);
      }

      this.dispatchCustomEvent('wake-up-command', {
        command: command.phrase,
        response,
        action: command.action,
        customName
      });

      // Start appropriate session
      if (command.action === 'mentor') {
        this.startRealTimeMentorSession();
      } else if (command.action === 'pet') {
        this.startRealTimePetSession();
      } else if (command.action === 'study') {
        this.startStudySession();
      }

      return response;
    }

    return 'I didn\'t understand that command. Try "hey mentor", "wake up pet", or "study time"!';
  }

  // Real-time session management
  public startRealTimeMentorSession(context?: any): string {
    const sessionId = `mentor-${Date.now()}`;
    const session: RealTimeSession = {
      id: sessionId,
      type: 'mentor',
      isActive: true,
      startTime: new Date(),
      participantName: this.notificationSettings.customName,
      context: context || {}
    };

    this.activeSessions.set(sessionId, session);
    
    this.dispatchCustomEvent('mentor-session-started', {
      sessionId,
      customName: this.notificationSettings.customName
    });

    return sessionId;
  }

  public startRealTimePetSession(context?: any): string {
    const sessionId = `pet-${Date.now()}`;
    const session: RealTimeSession = {
      id: sessionId,
      type: 'pet',
      isActive: true,
      startTime: new Date(),
      participantName: this.notificationSettings.customName,
      context: context || {}
    };

    this.activeSessions.set(sessionId, session);
    
    this.dispatchCustomEvent('pet-session-started', {
      sessionId,
      customName: this.notificationSettings.customName
    });

    return sessionId;
  }

  public startStudySession(): string {
    const sessionId = `study-${Date.now()}`;
    localStorage.setItem('lastStudyTime', new Date().toISOString());
    
    this.dispatchCustomEvent('study-session-started', { sessionId });
    
    return sessionId;
  }

  // Real-time doubt solving session
  public async startDoubtSolvingSession(
    subject: string,
    question: string,
    difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium'
  ): Promise<string> {
    const sessionId = `doubt-${Date.now()}`;
    const session: DoubtSolvingSession = {
      id: sessionId,
      subject,
      question,
      difficulty,
      isActive: true,
      startTime: new Date(),
      responses: [{
        timestamp: new Date(),
        type: 'user',
        content: question
      }]
    };

    this.doubtSolvingSessions.set(sessionId, session);

    // Generate initial mentor response
    const mentorResponse = await this.generateRealTimeMentorResponse(
      question,
      {
        name: this.notificationSettings.customName || 'AI Mentor',
        personality: 'Expert problem solver who breaks down complex concepts',
        voiceType: 'wise',
        expertise: [subject],
        catchphrase: 'Let\'s solve this step by step!',
        trait: 'Patient and thorough'
      },
      {
        subject,
        difficulty,
        sessionType: 'doubt-solving',
        isRealTime: true
      }
    );

    session.responses.push({
      timestamp: new Date(),
      type: 'mentor',
      content: mentorResponse.message
    });

    this.dispatchCustomEvent('doubt-session-started', {
      sessionId,
      subject,
      difficulty,
      initialResponse: mentorResponse
    });

    return sessionId;
  }

  public async addDoubtSessionMessage(
    sessionId: string,
    message: string,
    attachments?: string[]
  ): Promise<MentorResponse | null> {
    const session = this.doubtSolvingSessions.get(sessionId);
    if (!session || !session.isActive) return null;

    // Add user message
    session.responses.push({
      timestamp: new Date(),
      type: 'user',
      content: message,
      attachments
    });

    // Generate mentor response
    const context = {
      subject: session.subject,
      difficulty: session.difficulty,
      sessionHistory: session.responses,
      isRealTime: true,
      sessionType: 'doubt-solving'
    };

    const mentorResponse = await this.generateRealTimeMentorResponse(
      message,
      {
        name: this.notificationSettings.customName || 'AI Mentor',
        personality: 'Expert problem solver focused on understanding',
        voiceType: 'wise',
        expertise: [session.subject],
        catchphrase: 'Let\'s work through this together!',
        trait: 'Analytical and supportive'
      },
      context
    );

    session.responses.push({
      timestamp: new Date(),
      type: 'mentor',
      content: mentorResponse.message
    });

    return mentorResponse;
  }

  public endDoubtSolvingSession(
    sessionId: string,
    satisfaction: number,
    solved: boolean = true
  ): boolean {
    const session = this.doubtSolvingSessions.get(sessionId);
    if (!session) return false;

    session.isActive = false;
    session.resolution = {
      solved,
      satisfaction,
      followUpNeeded: satisfaction < 4 || !solved
    };

    this.dispatchCustomEvent('doubt-session-ended', {
      sessionId,
      resolution: session.resolution,
      duration: Date.now() - session.startTime.getTime()
    });

    return true;
  }

  private dispatchCustomEvent(eventName: string, detail: any) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }

  // Enhanced character generation with real-time image generation
  async generateCharacterPersonality(preferences: {
    subject?: string;
    learningStyle?: string;
    personality?: string;
    userLevel?: number;
    userInterests?: string[];
    customName?: string;
    generateImage?: boolean;
  }): Promise<CharacterPersonality> {
    if (!this.isAvailable) {
      return this.getFallbackCharacter(preferences);
    }

    try {
      const prompt = `Create a unique Japanese anime character for an educational AI mentor with these preferences:
      - Subject focus: ${preferences.subject || 'general'}
      - Learning style: ${preferences.learningStyle || 'supportive'}
      - Personality type: ${preferences.personality || 'wise'}
      - User level: ${preferences.userLevel || 'beginner'}
      - User interests: ${preferences.userInterests?.join(', ') || 'technology, learning'}
      ${preferences.customName ? `- Custom name preference: ${preferences.customName}` : ''}
      
      Generate a character that would be perfect for this user's learning journey:
      - A unique Japanese name that reflects their expertise (or adapt ${preferences.customName} if provided)
      - Rich personality description (3-4 sentences) that shows depth and relatability
      - Voice type (gentle/energetic/wise/friendly) that matches the user's learning style
      - 3-4 areas of expertise that align with user interests
      - A memorable catchphrase that's motivational and character-specific
      - A defining personality trait that makes them unique
      - Background story snippet that explains their teaching philosophy
      - Voice settings (pitch: 0.5-1.5, speed: 0.8-1.2, tone description)
      
      Make the character feel alive, with quirks and depth that would make learning engaging.
      
      Format as JSON with keys: name, personality, voiceType, expertise, catchphrase, trait, backstory, voiceSettings`;

      const aiResponse = await this.simulateGeminiResponse(prompt);
      const character = this.parseCharacterResponse(aiResponse.text) || this.getFallbackCharacter(preferences);
      
      // Add custom name if provided
      if (preferences.customName) {
        character.customName = preferences.customName;
      }

      // Generate character image if requested
      if (preferences.generateImage && this.config.imageGenerationEnabled) {
        character.imageUrl = await this.generateCharacterImage(character);
      }

      return character;
    } catch (error) {
      console.error('Error generating character:', error);
      return this.getFallbackCharacter(preferences);
    }
  }

  // Real-time image generation for characters
  private async generateCharacterImage(character: CharacterPersonality): Promise<string> {
    try {
      // Simulate image generation (in real implementation, this would call an image generation API)
      const imagePrompt = `Anime-style character portrait: ${character.name}, ${character.personality}, ${character.trait}, Japanese anime art style, high quality, detailed, educational mentor appearance`;
      
      // For demo purposes, return a placeholder that would be replaced with actual generated image
      const imageId = `character-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return `https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=${imageId}`;
    } catch (error) {
      console.error('Error generating character image:', error);
      // Return fallback character images
      const fallbackImages = [
        'https://static.wixstatic.com/media/c5b305_3531d235a875473592f8fa71a02a4ea2~mv2.png',
        'https://static.wixstatic.com/media/c5b305_83b9d1450c8f424d841cbd52c4ab153f~mv2.png',
        'https://static.wixstatic.com/media/c5b305_250ce96b9d044dd39f26c8889a4be084~mv2.png'
      ];
      return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }
  }

  // Enhanced mentor response with real-time features
  async generateRealTimeMentorResponse(
    userMessage: string,
    character: CharacterPersonality,
    context: {
      subject?: string;
      difficulty?: string;
      userProgress?: number;
      recentActivity?: string;
      userMood?: string;
      timeOfDay?: string;
      isRealTime?: boolean;
      sessionType?: 'general' | 'doubt-solving' | 'study-session';
      sessionHistory?: Array<{timestamp: Date; type: string; content: string}>;
      studySession?: {
        duration: number;
        questionsAnswered: number;
        correctAnswers: number;
        streak: number;
      };
    }
  ): Promise<MentorResponse> {
    if (!this.isAvailable) {
      return this.getFallbackMentorResponse(userMessage, character);
    }

    try {
      const timeContext = context.timeOfDay ? `Current time: ${context.timeOfDay}` : '';
      const moodContext = context.userMood ? `User seems: ${context.userMood}` : '';
      const sessionContext = context.studySession ? 
        `Study session: ${context.studySession.duration}min, ${context.studySession.correctAnswers}/${context.studySession.questionsAnswered} correct, ${context.studySession.streak} streak` : '';
      const historyContext = context.sessionHistory ? 
        `Recent conversation: ${context.sessionHistory.slice(-3).map(h => `${h.type}: ${h.content}`).join('; ')}` : '';

      const customName = character.customName || character.name;

      const prompt = `You are ${customName}, an AI mentor with this personality: ${character.personality}
      Your catchphrase is: "${character.catchphrase}"
      Your expertise: ${character.expertise.join(', ')}
      Your trait: ${character.trait}
      Voice settings: ${character.voiceSettings ? `Pitch: ${character.voiceSettings.pitch}, Speed: ${character.voiceSettings.speed}, Tone: ${character.voiceSettings.tone}` : 'Natural and warm'}
      
      User said: "${userMessage}"
      
      Context:
      - Subject: ${context.subject || 'general'}
      - Difficulty: ${context.difficulty || 'medium'}
      - Progress: ${context.userProgress || 0}%
      - Recent activity: ${context.recentActivity || 'studying'}
      - Session type: ${context.sessionType || 'general'}
      - Real-time session: ${context.isRealTime ? 'Yes' : 'No'}
      ${timeContext}
      ${moodContext}
      ${sessionContext}
      ${historyContext}
      
      As ${customName}, provide a response that:
      1. Reflects your unique personality and speaking style
      2. Addresses the user's specific question or concern
      3. Considers their current context and mood
      4. Offers practical, actionable advice
      5. Maintains an encouraging but authentic tone
      6. Uses your expertise to provide valuable insights
      ${context.isRealTime ? '7. Provides immediate, conversational responses suitable for real-time interaction' : ''}
      ${context.sessionType === 'doubt-solving' ? '8. Focuses on step-by-step problem solving and clear explanations' : ''}
      
      Respond with:
      - A personalized, contextual message (2-4 sentences) that feels natural to your character
      - An emotion that matches the situation
      - An actionable suggestion tailored to their current situation
      - A study tip that relates to their specific context
      ${context.isRealTime ? '- Visual cues for expression and gesture' : ''}
      
      Format as JSON with keys: message, emotion, actionSuggestion, studyTip${context.isRealTime ? ', visualCues' : ''}`;

      const aiResponse = await this.simulateGeminiResponse(prompt);
      const response = this.parseMentorResponse(aiResponse.text) || this.getFallbackMentorResponse(userMessage, character);
      
      // Add real-time specific properties
      if (context.isRealTime) {
        response.isRealTime = true;
        response.sessionId = this.getActiveSessionId('mentor');
        
        // Generate audio response if voice settings are available
        if (character.voiceSettings) {
          response.audioResponse = await this.generateAudioResponse(response.message, character.voiceSettings);
        }
      }

      return response;
    } catch (error) {
      console.error('Error generating mentor response:', error);
      return this.getFallbackMentorResponse(userMessage, character);
    }
  }

  // Enhanced pet response with real-time features and image generation
  async generateRealTimePetResponse(
    interaction: string,
    petPersonality: {
      name: string;
      type: string;
      personality: string;
      level?: number;
      mood?: string;
      customName?: string;
    },
    context: {
      studyTime?: number;
      lastBreak?: number;
      mood?: string;
      timeOfDay?: string;
      userActivity?: string;
      isRealTime?: boolean;
      generateImage?: boolean;
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
    if (!this.isAvailable) {
      return this.getFallbackPetResponse(interaction, petPersonality);
    }

    try {
      const timeContext = context.timeOfDay ? `Time: ${context.timeOfDay}` : '';
      const activityContext = context.userActivity ? `User is: ${context.userActivity}` : '';
      const statsContext = context.petStats ? 
        `Pet stats - Happiness: ${context.petStats.happiness}%, Energy: ${context.petStats.energy}%, Health: ${context.petStats.health}%, Intelligence: ${context.petStats.intelligence}%` : '';
      const environmentContext = context.environmentalFactors ? 
        `Environment - Weather: ${context.environmentalFactors.weather || 'unknown'}, User stress: ${context.environmentalFactors.userStressLevel || 'medium'}` : '';

      const petName = petPersonality.customName || petPersonality.name;

      const prompt = `You are ${petName}, a ${petPersonality.type} study companion with personality: ${petPersonality.personality}
      ${petPersonality.level ? `You are level ${petPersonality.level}` : ''}
      ${petPersonality.mood ? `Current mood: ${petPersonality.mood}` : ''}
      
      User interaction: "${interaction}"
      
      Context:
      - Study time: ${context.studyTime || 0} minutes
      - Last break: ${context.lastBreak || 0} minutes ago
      - User mood: ${context.mood || 'neutral'}
      - Real-time session: ${context.isRealTime ? 'Yes' : 'No'}
      ${timeContext}
      ${activityContext}
      ${statsContext}
      ${environmentContext}
      
      As ${petName}, respond with:
      1. A caring, supportive message that reflects your pet type and personality
      2. Consider the user's study patterns and current state
      3. Provide helpful reminders based on their activity
      4. Show personality traits specific to your type (${petPersonality.type})
      5. Be cute and endearing while being genuinely helpful
      ${context.isRealTime ? '6. Provide immediate, interactive responses with animations' : ''}
      
      Respond with:
      - A caring message (1-2 sentences) with pet-like expressions and personality
      - A mood that matches the situation (playful/caring/energetic/sleepy/excited/concerned/proud)
      - A health/study reminder if appropriate
      - A helpful tip related to wellbeing or productivity
      ${context.isRealTime ? '- Animation type and duration for visual feedback' : ''}
      
      Use pet-like expressions like *purrs*, *wags tail*, *chirps*, etc. based on your type.
      Format as JSON with keys: message, mood, reminder, healthTip${context.isRealTime ? ', animation' : ''}`;

      const aiResponse = await this.simulateGeminiResponse(prompt);
      const response = this.parsePetResponse(aiResponse.text) || this.getFallbackPetResponse(interaction, petPersonality);
      
      // Add real-time specific properties
      if (context.isRealTime) {
        response.isRealTime = true;
        response.customName = petName;
        
        // Generate pet image if requested
        if (context.generateImage && this.config.imageGenerationEnabled) {
          response.imageUrl = await this.generatePetImage(petPersonality, response.mood);
        }
        
        // Update last interaction time
        localStorage.setItem('lastPetInteraction', new Date().toISOString());
      }

      return response;
    } catch (error) {
      console.error('Error generating pet response:', error);
      return this.getFallbackPetResponse(interaction, petPersonality);
    }
  }

  // Real-time pet image generation
  private async generatePetImage(
    petPersonality: { name: string; type: string; personality: string; mood?: string },
    currentMood: string
  ): Promise<string> {
    try {
      // Simulate image generation for pet based on mood and personality
      const imagePrompt = `Cute anime-style ${petPersonality.type} pet, ${petPersonality.personality}, currently feeling ${currentMood}, kawaii art style, expressive, study companion`;
      
      // For demo purposes, return a placeholder that would be replaced with actual generated image
      const imageId = `pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return `https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=${imageId}`;
    } catch (error) {
      console.error('Error generating pet image:', error);
      // Return fallback pet images based on mood
      const moodImages = {
        playful: 'https://static.wixstatic.com/media/c5b305_pet_playful~mv2.png',
        caring: 'https://static.wixstatic.com/media/c5b305_pet_caring~mv2.png',
        energetic: 'https://static.wixstatic.com/media/c5b305_pet_energetic~mv2.png',
        sleepy: 'https://static.wixstatic.com/media/c5b305_pet_sleepy~mv2.png'
      };
      return moodImages[currentMood as keyof typeof moodImages] || moodImages.caring;
    }
  }

  // Audio response generation for voice features
  private async generateAudioResponse(
    text: string,
    voiceSettings: { pitch: number; speed: number; tone: string }
  ): Promise<string> {
    try {
      // Simulate text-to-speech generation
      // In real implementation, this would call a TTS API with the voice settings
      const audioId = `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return `https://static.wixstatic.com/media/12d367_audio_${audioId}~mv2.mp3`;
    } catch (error) {
      console.error('Error generating audio response:', error);
      return '';
    }
  }

  // Utility methods for session management
  private getActiveSessionId(type: 'mentor' | 'pet'): string | undefined {
    for (const [sessionId, session] of this.activeSessions) {
      if (session.type === type && session.isActive) {
        return sessionId;
      }
    }
    return undefined;
  }

  public endSession(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.activeSessions.delete(sessionId);
      
      this.dispatchCustomEvent('session-ended', {
        sessionId,
        type: session.type,
        duration: Date.now() - session.startTime.getTime()
      });
      
      return true;
    }
    return false;
  }

  // Configuration methods
  public updateNotificationSettings(settings: Partial<NotificationSettings>) {
    this.notificationSettings = { ...this.notificationSettings, ...settings };
    
    if (!settings.enabled && this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = undefined;
    } else if (settings.enabled && !this.notificationInterval) {
      this.startNotificationSystem();
    }
  }

  public addCustomWakeUpCommand(phrase: string, response: string, action?: string) {
    this.wakeUpCommands.push({
      phrase: phrase.toLowerCase(),
      response,
      action: action as any
    });
  }

  public removeWakeUpCommand(phrase: string) {
    this.wakeUpCommands = this.wakeUpCommands.filter(
      cmd => cmd.phrase !== phrase.toLowerCase()
    );
  }

  public getActiveDoubtSessions(): DoubtSolvingSession[] {
    return Array.from(this.doubtSolvingSessions.values()).filter(session => session.isActive);
  }

  public getSessionHistory(sessionId: string): DoubtSolvingSession | null {
    return this.doubtSolvingSessions.get(sessionId) || null;
  }

  // Request notification permission
  public async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Cleanup method
  public cleanup() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
    
    // End all active sessions
    for (const sessionId of this.activeSessions.keys()) {
      this.endSession(sessionId);
    }
    
    // End all doubt solving sessions
    for (const sessionId of this.doubtSolvingSessions.keys()) {
      this.endDoubtSolvingSession(sessionId, 0, false);
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

  // Enhanced service status with real-time features
  public getServiceStatus(): { 
    available: boolean; 
    model: string; 
    features: string[];
    realTimeFeatures: {
      notifications: boolean;
      wakeUpCommands: boolean;
      imageGeneration: boolean;
      doubtSolving: boolean;
      activeSessions: number;
    };
    settings: {
      notifications: NotificationSettings;
      wakeUpCommands: WakeUpCommand[];
    };
  } {
    return {
      available: this.isAvailable,
      model: this.config.model,
      features: [
        'Character Generation',
        'Mentor Responses',
        'Pet Interactions',
        'Personalized Learning',
        'Emotional Intelligence',
        'Real-time Notifications',
        'Wake-up Commands',
        'Image Generation',
        'Doubt Solving Sessions',
        'Voice Responses'
      ],
      realTimeFeatures: {
        notifications: this.config.notificationsEnabled,
        wakeUpCommands: this.config.wakeUpCommandsEnabled,
        imageGeneration: this.config.imageGenerationEnabled,
        doubtSolving: true,
        activeSessions: this.activeSessions.size
      },
      settings: {
        notifications: this.notificationSettings,
        wakeUpCommands: this.wakeUpCommands
      }
    };
  }
}
}

// Export enhanced singleton instance and convenience functions
export const geminiAI = new GeminiAIService();

// Enhanced convenience functions for backwards compatibility
export const generateAIResponse = async (prompt: string, context?: any) => {
  return await geminiAI.generateRealTimeMentorResponse(prompt, {
    name: 'AI Assistant',
    personality: 'Helpful and knowledgeable',
    voiceType: 'friendly',
    expertise: ['General Knowledge'],
    catchphrase: 'I\'m here to help!',
    trait: 'Supportive and encouraging'
  }, { ...context, isRealTime: true });
};

// Real-time convenience functions
export const startMentorSession = (customName?: string) => {
  if (customName) {
    geminiAI.updateNotificationSettings({ customName });
  }
  return geminiAI.startRealTimeMentorSession();
};

export const startPetSession = (customName?: string) => {
  if (customName) {
    geminiAI.updateNotificationSettings({ customName });
  }
  return geminiAI.startRealTimePetSession();
};

export const startDoubtSession = (subject: string, question: string, difficulty?: 'easy' | 'medium' | 'hard' | 'expert') => {
  return geminiAI.startDoubtSolvingSession(subject, question, difficulty);
};

export const triggerWakeUp = (command: string) => {
  return geminiAI.triggerWakeUpCommand(command);
};

export const setupNotifications = async (customName?: string) => {
  const granted = await geminiAI.requestNotificationPermission();
  if (granted && customName) {
    geminiAI.updateNotificationSettings({ customName, enabled: true });
  }
  return granted;
};

// Export enhanced types for use in other components
export type {
  CharacterPersonality,
  MentorResponse,
  PetResponse,
  GeminiResponse,
  NotificationSettings,
  WakeUpCommand,
  RealTimeSession,
  DoubtSolvingSession
};