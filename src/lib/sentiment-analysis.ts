/**
 * Text Sentiment Analysis
 * Analyzes user text for emotional tone and sentiment
 */

interface SentimentResult {
  score: number; // -1 (very negative) to 1 (very positive)
  emotion: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  confidence: number; // 0 to 1
  keywords: string[];
}

const sentimentKeywords = {
  very_positive: ['amazing', 'excellent', 'fantastic', 'wonderful', 'love', 'awesome', 'brilliant', 'perfect', 'great', 'incredible'],
  positive: ['good', 'nice', 'happy', 'glad', 'enjoy', 'like', 'better', 'great', 'wonderful', 'helpful'],
  neutral: ['okay', 'fine', 'normal', 'regular', 'standard', 'average', 'usual', 'typical'],
  negative: ['bad', 'sad', 'angry', 'frustrated', 'disappointed', 'hate', 'dislike', 'poor', 'terrible', 'awful'],
  very_negative: ['horrible', 'disgusting', 'hate', 'despise', 'worst', 'terrible', 'awful', 'pathetic', 'useless', 'garbage'],
};

export function analyzeSentiment(text: string): SentimentResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  let score = 0;
  let foundKeywords: string[] = [];
  let totalKeywordsFound = 0;

  // Count sentiment keywords
  Object.entries(sentimentKeywords).forEach(([sentiment, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        foundKeywords.push(keyword);
        totalKeywordsFound++;
        
        if (sentiment === 'very_positive') score += 1;
        else if (sentiment === 'positive') score += 0.5;
        else if (sentiment === 'neutral') score += 0;
        else if (sentiment === 'negative') score -= 0.5;
        else if (sentiment === 'very_negative') score -= 1;
      }
    });
  });

  // Normalize score
  if (totalKeywordsFound > 0) {
    score = score / totalKeywordsFound;
  }

  // Clamp score between -1 and 1
  score = Math.max(-1, Math.min(1, score));

  // Determine emotion category
  let emotion: SentimentResult['emotion'];
  if (score >= 0.6) emotion = 'very_positive';
  else if (score >= 0.2) emotion = 'positive';
  else if (score <= -0.6) emotion = 'very_negative';
  else if (score <= -0.2) emotion = 'negative';
  else emotion = 'neutral';

  // Calculate confidence based on keyword matches
  const confidence = Math.min(1, totalKeywordsFound / 5);

  return {
    score,
    emotion,
    confidence,
    keywords: [...new Set(foundKeywords)],
  };
}

export function getEmotionEmoji(emotion: SentimentResult['emotion']): string {
  const emojiMap = {
    very_positive: '😄',
    positive: '🙂',
    neutral: '😐',
    negative: '😕',
    very_negative: '😢',
  };
  return emojiMap[emotion];
}

export function getEmotionColor(emotion: SentimentResult['emotion']): string {
  const colorMap = {
    very_positive: 'text-green-500',
    positive: 'text-green-400',
    neutral: 'text-gray-400',
    negative: 'text-orange-400',
    very_negative: 'text-red-500',
  };
  return colorMap[emotion];
}
