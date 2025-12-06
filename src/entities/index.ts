/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: achievementdefinitions
 * Interface for AchievementDefinitions
 */
export interface AchievementDefinitions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image */
  icon?: string;
  /** @wixFieldType text */
  unlockRequirement?: string;
  /** @wixFieldType number */
  xpReward?: number;
  /** @wixFieldType text */
  rarity?: string;
}


/**
 * Collection ID: animeeducationalreels
 * Interface for AnimeEducationalReels
 */
export interface AnimeEducationalReels {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  reelTitle?: string;
  /** @wixFieldType text */
  reelDescription?: string;
  /** @wixFieldType text */
  topic?: string;
  /** @wixFieldType text */
  difficultyLevel?: string;
  /** @wixFieldType number */
  videoDuration?: number;
  /** @wixFieldType url */
  videoUrl?: string;
  /** @wixFieldType url */
  thumbnailUrl?: string;
  /** @wixFieldType datetime */
  creationDate?: Date | string;
  /** @wixFieldType number */
  viewCount?: number;
  /** @wixFieldType number */
  likeCount?: number;
}


/**
 * Collection ID: learningtopics
 * Interface for LearningTopics
 */
export interface LearningTopics {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  topicName?: string;
  /** @wixFieldType text */
  topicDescription?: string;
  /** @wixFieldType image */
  topicIcon?: string;
  /** @wixFieldType text */
  topicColor?: string;
  /** @wixFieldType number */
  totalReels?: number;
  /** @wixFieldType number */
  totalQuizzes?: number;
}


/**
 * Collection ID: quests
 * Interface for Quests
 */
export interface Quests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  objectives?: string;
  /** @wixFieldType number */
  xpReward?: number;
  /** @wixFieldType text */
  itemRewardName?: string;
  /** @wixFieldType text */
  difficulty?: string;
  /** @wixFieldType image */
  questImage?: string;
}


/**
 * Collection ID: reelquizzes
 * Interface for ReelQuizzes
 */
export interface ReelQuizzes {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  questionText?: string;
  /** @wixFieldType text */
  optionA?: string;
  /** @wixFieldType text */
  optionB?: string;
  /** @wixFieldType text */
  optionC?: string;
  /** @wixFieldType text */
  optionD?: string;
  /** @wixFieldType text */
  correctAnswer?: string;
  /** @wixFieldType text */
  answerExplanation?: string;
  /** @wixFieldType text */
  difficulty?: string;
  /** @wixFieldType number */
  pointsValue?: number;
}


/**
 * Collection ID: shopitems
 * Interface for ShopItems
 */
export interface ShopItems {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType image */
  itemImage?: string;
  /** @wixFieldType number */
  itemCost?: number;
  /** @wixFieldType text */
  itemCategory?: string;
  /** @wixFieldType text */
  acquisitionMethod?: string;
  /** @wixFieldType boolean */
  isLimitedEdition?: boolean;
}


/**
 * Collection ID: studyguilds
 * Interface for StudyGuilds
 */
export interface StudyGuilds {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  guildName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  memberCount?: number;
  /** @wixFieldType text */
  goals?: string;
  /** @wixFieldType text */
  announcements?: string;
  /** @wixFieldType datetime */
  creationDate?: Date | string;
  /** @wixFieldType image */
  guildImage?: string;
}
