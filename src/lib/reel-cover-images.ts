/**
 * Reel Cover Image Generator
 * Maps topics to anime-style cover images
 */

export interface ReelCoverConfig {
  topic: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  coverImage: string;
  accentColor: string;
}

export const REEL_COVER_IMAGES: Record<string, ReelCoverConfig> = {
  'Algebra': {
    topic: 'Algebra',
    icon: '📐',
    gradientFrom: 'from-cyan-500/30',
    gradientTo: 'to-blue-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_b9e52984a4764ded9a100c3de8c0b3fe~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-cyan-400'
  },
  'Geometry': {
    topic: 'Geometry',
    icon: '△',
    gradientFrom: 'from-green-500/30',
    gradientTo: 'to-emerald-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_443f3b42afd5479e9e3e07396d11d1b0~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-green-400'
  },
  'Calculus': {
    topic: 'Calculus',
    icon: '∞',
    gradientFrom: 'from-purple-500/30',
    gradientTo: 'to-pink-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_c43e742485b6413b8f21f1d9e6c96e22~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-purple-400'
  },
  'Statistics': {
    topic: 'Statistics',
    icon: '📊',
    gradientFrom: 'from-yellow-500/30',
    gradientTo: 'to-amber-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_2644f04ad3c84f70bdfd1bc5688c5fbb~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-yellow-400'
  },
  'Physics': {
    topic: 'Physics',
    icon: '⚡',
    gradientFrom: 'from-red-500/30',
    gradientTo: 'to-orange-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_8c1022bac04a4c18b3e45f9ccd4cd96e~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-red-400'
  },
  'Chemistry': {
    topic: 'Chemistry',
    icon: '⚗️',
    gradientFrom: 'from-violet-500/30',
    gradientTo: 'to-purple-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_b9e52984a4764ded9a100c3de8c0b3fe~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-violet-400'
  },
  'Biology': {
    topic: 'Biology',
    icon: '🧬',
    gradientFrom: 'from-teal-500/30',
    gradientTo: 'to-cyan-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_443f3b42afd5479e9e3e07396d11d1b0~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-teal-400'
  },
  'History': {
    topic: 'History',
    icon: '📜',
    gradientFrom: 'from-orange-500/30',
    gradientTo: 'to-yellow-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_2644f04ad3c84f70bdfd1bc5688c5fbb~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-orange-400'
  },
  'Literature': {
    topic: 'Literature',
    icon: '📚',
    gradientFrom: 'from-pink-500/30',
    gradientTo: 'to-rose-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_c43e742485b6413b8f21f1d9e6c96e22~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-pink-400'
  },
  'Languages': {
    topic: 'Languages',
    icon: '🌍',
    gradientFrom: 'from-indigo-500/30',
    gradientTo: 'to-blue-500/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_8c1022bac04a4c18b3e45f9ccd4cd96e~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-indigo-400'
  }
};

/**
 * Get cover image config for a topic
 */
export function getCoverImageForTopic(topic: string): ReelCoverConfig {
  return REEL_COVER_IMAGES[topic] || {
    topic: topic,
    icon: '📖',
    gradientFrom: 'from-primary/30',
    gradientTo: 'to-secondary/30',
    coverImage: 'https://static.wixstatic.com/media/c5b305_b9e52984a4764ded9a100c3de8c0b3fe~mv2.png?originWidth=384&originHeight=448',
    accentColor: 'text-primary'
  };
}

/**
 * Get all available topics
 */
export function getAvailableTopics(): string[] {
  return Object.keys(REEL_COVER_IMAGES);
}

/**
 * Generate a gradient class for a topic
 */
export function getTopicGradient(topic: string): string {
  const config = getCoverImageForTopic(topic);
  return `${config.gradientFrom} ${config.gradientTo}`;
}

/**
 * Get accent color for a topic
 */
export function getTopicAccentColor(topic: string): string {
  const config = getCoverImageForTopic(topic);
  return config.accentColor;
}

/**
 * Get icon for a topic
 */
export function getTopicIcon(topic: string): string {
  const config = getCoverImageForTopic(topic);
  return config.icon;
}

/**
 * Get cover image URL for a topic
 */
export function getTopicCoverImage(topic: string): string {
  const config = getCoverImageForTopic(topic);
  return config.coverImage;
}
