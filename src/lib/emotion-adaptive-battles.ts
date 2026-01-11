/**
 * Emotion-Adaptive Battle System
 * Generates story-based battles and quizzes that adapt to user's emotional state
 */

import { geminiAPI } from '@/lib/gemini-api-service';

export type UserEmotion = 'happy' | 'sad' | 'neutral' | 'confused' | 'excited' | 'frustrated';

export interface BattleQuestion {
  id: string;
  narrative: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  points: number;
  emotionalContext: string;
  storyElement: string;
}

export interface AdaptiveBattle {
  id: string;
  title: string;
  narrative: string;
  userEmotion: UserEmotion;
  difficulty: string;
  questions: BattleQuestion[];
  enemyCharacter: {
    name: string;
    personality: string;
    specialMove: string;
    emotionalResponse: string;
  };
  rewards: {
    xp: number;
    emotionalBonus: number;
    motivationalMessage: string;
  };
}

export interface EmotionalQuiz {
  id: string;
  title: string;
  topic: string;
  userEmotion: UserEmotion;
  difficulty: string;
  questions: BattleQuestion[];
  adaptiveContent: string;
  encouragement: string;
  pacing: 'slow' | 'moderate' | 'fast';
}

/**
 * Generate an emotion-adaptive battle based on user's current emotional state
 */
export async function generateEmotionalBattle(
  userEmotion: UserEmotion,
  topic: string,
  difficulty: string = 'Medium'
): Promise<AdaptiveBattle> {
  try {
    const prompt = `Create an engaging, story-based educational battle scenario for a user who is currently feeling ${userEmotion}.

Topic: ${topic}
Difficulty: ${difficulty}

The battle should:
1. Adapt the narrative tone to match their emotional state
2. Include 3-4 quiz questions embedded in the story
3. Feature an anime-style enemy character
4. Provide emotional support and encouragement
5. Adjust difficulty based on their mood

For ${userEmotion} emotion:
${getEmotionalAdaptations(userEmotion)}

Generate a JSON response with this structure:
{
  "title": "Battle title",
  "narrative": "Opening story narrative",
  "enemyCharacter": {
    "name": "Character name",
    "personality": "Brief personality",
    "specialMove": "Special attack name",
    "emotionalResponse": "How they respond to the user's emotion"
  },
  "questions": [
    {
      "narrative": "Story context for this question",
      "question": "The actual question",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct",
      "storyElement": "How this connects to the battle narrative"
    }
  ],
  "rewards": {
    "xp": 500,
    "emotionalBonus": 100,
    "motivationalMessage": "Encouraging message based on their emotion"
  }
}`;

    const response = await geminiAPI.generateContent(prompt, {
      temperature: 0.85,
      maxTokens: 2500
    });

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');

    const battleData = JSON.parse(jsonMatch[0]);

    return {
      id: `battle_${Date.now()}`,
      title: battleData.title,
      narrative: battleData.narrative,
      userEmotion,
      difficulty,
      questions: battleData.questions.map((q: any, idx: number) => ({
        id: `q_${idx}`,
        narrative: q.narrative,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty,
        points: getDifficultyPoints(difficulty),
        emotionalContext: `Adapted for ${userEmotion} mood`,
        storyElement: q.storyElement
      })),
      enemyCharacter: battleData.enemyCharacter,
      rewards: battleData.rewards
    };
  } catch (error) {
    console.error('Error generating emotional battle:', error);
    return getFallbackBattle(userEmotion, topic, difficulty);
  }
}

/**
 * Generate an emotion-adaptive quiz
 */
export async function generateEmotionalQuiz(
  userEmotion: UserEmotion,
  topic: string,
  difficulty: string = 'Medium'
): Promise<EmotionalQuiz> {
  try {
    const prompt = `Create an adaptive quiz for a user who is currently feeling ${userEmotion}.

Topic: ${topic}
Difficulty: ${difficulty}

The quiz should:
1. Adapt pacing based on their emotional state
2. Include encouraging messages throughout
3. Adjust question difficulty dynamically
4. Provide emotional support
5. Be engaging and motivating

For ${userEmotion} emotion, use this approach:
${getEmotionalAdaptations(userEmotion)}

Generate a JSON response with this structure:
{
  "title": "Quiz title",
  "adaptiveContent": "Introduction adapted to their mood",
  "encouragement": "Motivational message",
  "pacing": "slow|moderate|fast",
  "questions": [
    {
      "question": "The question",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation"
    }
  ]
}`;

    const response = await geminiAPI.generateContent(prompt, {
      temperature: 0.8,
      maxTokens: 2000
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');

    const quizData = JSON.parse(jsonMatch[0]);

    return {
      id: `quiz_${Date.now()}`,
      title: quizData.title,
      topic,
      userEmotion,
      difficulty,
      questions: quizData.questions.map((q: any, idx: number) => ({
        id: `q_${idx}`,
        narrative: `Question ${idx + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty,
        points: getDifficultyPoints(difficulty),
        emotionalContext: `Adapted for ${userEmotion} mood`,
        storyElement: `Part of ${topic} quiz`
      })),
      adaptiveContent: quizData.adaptiveContent,
      encouragement: quizData.encouragement,
      pacing: quizData.pacing
    };
  } catch (error) {
    console.error('Error generating emotional quiz:', error);
    return getFallbackQuiz(userEmotion, topic, difficulty);
  }
}

/**
 * Generate adaptive battle questions based on emotion and topic
 */
export async function generateAdaptiveQuestions(
  userEmotion: UserEmotion,
  topic: string,
  count: number = 5,
  difficulty: string = 'Medium'
): Promise<BattleQuestion[]> {
  try {
    const prompt = `Generate ${count} educational quiz questions about "${topic}" at ${difficulty} level.
The user is currently feeling ${userEmotion}.

Adapt the questions to their emotional state:
${getEmotionalAdaptations(userEmotion)}

Make questions:
1. Engaging and story-based
2. Emotionally appropriate
3. Progressively challenging
4. Include real-world applications

Generate a JSON array of questions:
[
  {
    "question": "The question",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation",
    "narrative": "Story context",
    "storyElement": "How it connects to the narrative"
  }
]`;

    const response = await geminiAPI.generateContent(prompt, {
      temperature: 0.8,
      maxTokens: 2500
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid response format');

    const questionsData = JSON.parse(jsonMatch[0]);

    return questionsData.map((q: any, idx: number) => ({
      id: `q_${idx}`,
      narrative: q.narrative || `Question ${idx + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty,
      points: getDifficultyPoints(difficulty),
      emotionalContext: `Adapted for ${userEmotion} mood`,
      storyElement: q.storyElement || 'Part of the learning journey'
    }));
  } catch (error) {
    console.error('Error generating adaptive questions:', error);
    return getFallbackQuestions(topic, count, difficulty);
  }
}

/**
 * Get emotional adaptations based on user's current emotion
 */
function getEmotionalAdaptations(emotion: UserEmotion): string {
  const adaptations: Record<UserEmotion, string> = {
    happy: `
      - Use celebratory and positive language
      - Include fun challenges and achievements
      - Emphasize progress and growth
      - Add bonus points for correct answers
      - Use encouraging emojis and celebratory messages
      - Make questions slightly easier to maintain momentum
    `,
    excited: `
      - Create challenging and fast-paced content
      - Include epic battles and dramatic scenarios
      - Use action-oriented language
      - Provide immediate feedback and rewards
      - Include power-up mechanics
      - Make questions moderately difficult to match their energy
    `,
    neutral: `
      - Use balanced, informative language
      - Include interesting facts and applications
      - Provide clear explanations
      - Use moderate difficulty
      - Include both challenges and achievable goals
      - Maintain steady pacing
    `,
    confused: `
      - Use simple, clear language
      - Break down complex concepts
      - Provide extra explanations
      - Make questions easier to build confidence
      - Include helpful hints
      - Use encouraging and supportive tone
      - Offer step-by-step guidance
    `,
    frustrated: `
      - Use supportive and empathetic language
      - Acknowledge their effort and progress
      - Make questions slightly easier to build confidence
      - Provide detailed explanations
      - Include motivational messages
      - Celebrate small wins
      - Offer breaks and pacing options
    `,
    sad: `
      - Use uplifting and hopeful language
      - Include inspiring stories and examples
      - Emphasize personal growth and achievement
      - Make questions achievable to build confidence
      - Provide emotional support messages
      - Include positive reinforcement
      - Suggest taking breaks when needed
    `
  };

  return adaptations[emotion] || adaptations.neutral;
}

/**
 * Get points based on difficulty level
 */
function getDifficultyPoints(difficulty: string): number {
  switch (difficulty) {
    case 'Easy':
      return 50;
    case 'Medium':
      return 100;
    case 'Hard':
      return 150;
    case 'Epic':
      return 250;
    default:
      return 100;
  }
}

/**
 * Fallback battle when API fails
 */
function getFallbackBattle(
  emotion: UserEmotion,
  topic: string,
  difficulty: string
): AdaptiveBattle {
  return {
    id: `battle_fallback_${Date.now()}`,
    title: `${topic} Battle Challenge`,
    narrative: `You enter the ${topic} arena. A mysterious opponent appears, ready to test your knowledge!`,
    userEmotion: emotion,
    difficulty,
    questions: getFallbackQuestions(topic, 3, difficulty),
    enemyCharacter: {
      name: 'Knowledge Guardian',
      personality: 'Wise and challenging',
      specialMove: 'Quiz Barrage',
      emotionalResponse: `Acknowledges your ${emotion} mood and adapts accordingly`
    },
    rewards: {
      xp: 500,
      emotionalBonus: 100,
      motivationalMessage: getEmotionalMessage(emotion)
    }
  };
}

/**
 * Fallback quiz when API fails
 */
function getFallbackQuiz(
  emotion: UserEmotion,
  topic: string,
  difficulty: string
): EmotionalQuiz {
  return {
    id: `quiz_fallback_${Date.now()}`,
    title: `${topic} Quiz`,
    topic,
    userEmotion: emotion,
    difficulty,
    questions: getFallbackQuestions(topic, 4, difficulty),
    adaptiveContent: `Let's explore ${topic} together. Take your time and do your best!`,
    encouragement: getEmotionalMessage(emotion),
    pacing: emotion === 'excited' ? 'fast' : emotion === 'frustrated' ? 'slow' : 'moderate'
  };
}

/**
 * Fallback questions when API fails
 */
function getFallbackQuestions(
  topic: string,
  count: number,
  difficulty: string
): BattleQuestion[] {
  const validDifficulty = (['Easy', 'Medium', 'Hard', 'Epic'].includes(difficulty) 
    ? difficulty 
    : 'Medium') as 'Easy' | 'Medium' | 'Hard' | 'Epic';
  const questions: BattleQuestion[] = [
    {
      id: 'q_1',
      narrative: 'First Challenge',
      question: `What is a fundamental concept in ${topic}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'This is the correct answer because...',
      difficulty: validDifficulty,
      points: getDifficultyPoints(difficulty),
      emotionalContext: 'Adapted to your current mood',
      storyElement: 'Part of your learning journey'
    },
    {
      id: 'q_2',
      narrative: 'Second Challenge',
      question: `How would you apply ${topic} in practice?`,
      options: ['Approach A', 'Approach B', 'Approach C', 'Approach D'],
      correctAnswer: 1,
      explanation: 'This approach is most effective because...',
      difficulty: validDifficulty,
      points: getDifficultyPoints(difficulty),
      emotionalContext: 'Adapted to your current mood',
      storyElement: 'Building your understanding'
    },
    {
      id: 'q_3',
      narrative: 'Final Challenge',
      question: `What is the advanced aspect of ${topic}?`,
      options: ['Advanced A', 'Advanced B', 'Advanced C', 'Advanced D'],
      correctAnswer: 2,
      explanation: 'This is the most advanced concept because...',
      difficulty: validDifficulty,
      points: getDifficultyPoints(difficulty),
      emotionalContext: 'Adapted to your current mood',
      storyElement: 'Mastering the topic'
    }
  ];

  return questions.slice(0, count);
}

/**
 * Get emotional message based on user's emotion
 */
function getEmotionalMessage(emotion: UserEmotion): string {
  const messages: Record<UserEmotion, string> = {
    happy: '🎉 Keep up that amazing energy! You\'re doing fantastic!',
    excited: '⚡ Your enthusiasm is incredible! Let\'s conquer these challenges!',
    neutral: '📚 Let\'s focus and make great progress together!',
    confused: '💡 Take your time, you\'ve got this! Every question helps you learn.',
    frustrated: '💪 I know it\'s tough, but you\'re stronger than you think. Keep going!',
    sad: '🌟 Remember, every step forward is a victory. You\'re doing great!'
  };

  return messages[emotion] || messages.neutral;
}

/**
 * Analyze user performance and provide emotional feedback
 */
export function getEmotionalFeedback(
  userEmotion: UserEmotion,
  score: number,
  totalPoints: number,
  timeSpent: number
): {
  message: string;
  encouragement: string;
  nextSteps: string;
  emotionalBonus: number;
} {
  const percentage = (score / totalPoints) * 100;

  let message = '';
  let encouragement = '';
  let nextSteps = '';
  let emotionalBonus = 0;

  // Base feedback
  if (percentage >= 90) {
    message = '🏆 Outstanding performance!';
    encouragement = 'You absolutely crushed it!';
    emotionalBonus = 50;
  } else if (percentage >= 70) {
    message = '✨ Great job!';
    encouragement = 'You\'re doing really well!';
    emotionalBonus = 30;
  } else if (percentage >= 50) {
    message = '👍 Good effort!';
    encouragement = 'You\'re making progress!';
    emotionalBonus = 15;
  } else {
    message = '💪 Keep practicing!';
    encouragement = 'Every attempt helps you improve!';
    emotionalBonus = 10;
  }

  // Emotion-specific adjustments
  switch (userEmotion) {
    case 'happy':
      encouragement += ' Your positive energy is contagious!';
      nextSteps = 'Ready for the next challenge?';
      break;
    case 'excited':
      encouragement += ' Your enthusiasm is amazing!';
      nextSteps = 'Want to tackle something harder?';
      emotionalBonus += 20;
      break;
    case 'neutral':
      encouragement += ' You\'re on track!';
      nextSteps = 'Ready to continue?';
      break;
    case 'confused':
      encouragement += ' You\'re learning and that\'s what matters!';
      nextSteps = 'Would you like to review the concepts?';
      emotionalBonus += 25;
      break;
    case 'frustrated':
      encouragement += ' Your persistence is admirable!';
      nextSteps = 'Take a break if you need one, then try again!';
      emotionalBonus += 35;
      break;
    case 'sad':
      encouragement += ' You\'re stronger than you know!';
      nextSteps = 'Remember, progress is progress!';
      emotionalBonus += 40;
      break;
  }

  return {
    message,
    encouragement,
    nextSteps,
    emotionalBonus
  };
}
