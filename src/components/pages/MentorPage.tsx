/**
 * Unified Mentor Page
 * Complete AI mentor system combining:
 * - AI Mentor System (video calls, chat, emotion detection)
 * - AI Learning Mentor (character generation, mood detection, personalized guidance)
 */

import { useState, useEffect, useRef } from 'react';
import { Mentors, AnimeEducationalReels, Quests, LearningTopics } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { MentorSelector } from '@/components/ui/mentor-selector';
import { VideoCallInterface } from '@/components/ui/video-call-interface';
import { AIChatInterface } from '@/components/ui/ai-chat-interface';
import { EmotionDetector } from '@/components/ui/emotion-detector';
import { AIRecommendationsDisplay } from '@/components/ui/ai-recommendations-display';
import { AnimeCharacterGenerator } from '@/components/ui/anime-character-generator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  MessageSquare, 
  Zap, 
  BookOpen,
  Sparkles,
  Brain,
  Heart,
  TrendingUp,
  Settings,
  Palette,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MoodDetectionResult {
  mood: 'happy' | 'sad' | 'confused' | 'excited' | 'frustrated' | 'focused' | 'tired' | 'neutral';
  confidence: number;
  indicators: string[];
  timestamp: Date;
}

export default function MentorPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentors | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [reels, setReels] = useState<AnimeEducationalReels[]>([]);
  const [quests, setQuests] = useState<Quests[]>([]);
  const [topics, setTopics] = useState<LearningTopics[]>([]);
  const [loading, setLoading] = useState(true);
  const [useGeminiAPI, setUseGeminiAPI] = useState(false);
  
  // AI Learning Mentor States
  const [showCharacterGenerator, setShowCharacterGenerator] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<any>(null);
  const [currentMood, setCurrentMood] = useState<MoodDetectionResult | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodDetectionResult[]>([]);
  const [isMoodDetectionActive, setIsMoodDetectionActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'mentor' | 'character' | 'mood' | 'insights'>('mentor');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [reelsData, questsData, topicsData] = await Promise.all([
        BaseCrudService.getAll<AnimeEducationalReels>('animeeducationalreels'),
        BaseCrudService.getAll<Quests>('quests'),
        BaseCrudService.getAll<LearningTopics>('learningtopics'),
      ]);

      setReels(reelsData.items);
      setQuests(questsData.items);
      setTopics(topicsData.items);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handleMoodDetected = (mood: MoodDetectionResult) => {
    setCurrentMood(mood);
    setMoodHistory(prev => [...prev, mood].slice(-10)); // Keep last 10 moods
  };

  const handleEmotionDetected = (emotion: 'happy' | 'sad' | 'neutral' | 'confused' | 'excited') => {
    // Convert simple emotion string to MoodDetectionResult
    const moodMap: Record<typeof emotion, MoodDetectionResult['mood']> = {
      'happy': 'happy',
      'sad': 'sad',
      'neutral': 'neutral',
      'confused': 'confused',
      'excited': 'excited'
    };
    
    const moodResult: MoodDetectionResult = {
      mood: moodMap[emotion],
      confidence: 0.85, // Default confidence for emotion detector
      indicators: [`Detected ${emotion} emotion`],
      timestamp: new Date()
    };
    
    handleMoodDetected(moodResult);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'stable';
    const recent = moodHistory.slice(-3);
    const avgConfidence = recent.reduce((sum, m) => sum + m.confidence, 0) / recent.length;
    return avgConfidence > 0.7 ? 'improving' : avgConfidence < 0.4 ? 'declining' : 'stable';
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/dashboard">
            <Button variant="outline" className="border-primary text-primary mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-5xl font-heading font-black text-primary mb-4">
            AI Mentor Academy
          </h1>
          <p className="text-xl font-paragraph text-light-gray max-w-3xl">
            Connect with personalized AI mentors, generate your learning character, and receive mood-adaptive guidance for your educational journey.
          </p>
        </motion.div>

        {/* API Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-center gap-3 bg-dark-gray/50 p-4 rounded-lg border border-primary/20"
        >
          <input
            type="checkbox"
            id="gemini-toggle"
            checked={useGeminiAPI}
            onChange={(e) => setUseGeminiAPI(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="gemini-toggle" className="text-sm text-light-gray cursor-pointer flex-1">
            Use Gemini API for advanced AI responses (requires backend endpoint and API key)
          </label>
        </motion.div>

        {/* Main Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-dark-gray border border-primary/20">
              <TabsTrigger value="mentor" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Mentor</span>
              </TabsTrigger>
              <TabsTrigger value="character" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Character</span>
              </TabsTrigger>
              <TabsTrigger value="mood" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Mood</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>

            {/* Mentor Tab */}
            <TabsContent value="mentor" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mentor Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-1"
                >
                  <Card className="border-primary/30 p-6 sticky top-4">
                    <h3 className="text-lg font-heading font-bold text-primary mb-4">Select Your Mentor</h3>
                    <MentorSelector
                      selectedMentorId={selectedMentor?._id}
                      onSelectMentor={setSelectedMentor}
                    />
                  </Card>
                </motion.div>

                {/* Mentor Interaction */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-2 space-y-6"
                >
                  {selectedMentor ? (
                    <>
                      {/* Mentor Info Card */}
                      <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                              {selectedMentor.name}
                            </h2>
                            <p className="text-primary text-sm font-paragraph mb-2">
                              {selectedMentor.specialty}
                            </p>
                            <p className="text-light-gray text-sm font-paragraph">
                              {selectedMentor.bio}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="mb-4">
                              <p className="text-xs text-light-gray mb-1">Personality</p>
                              <Badge className="bg-secondary text-secondary-foreground">
                                {selectedMentor.personalityType}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-light-gray mb-1">Experience</p>
                              <Badge className="bg-primary text-primary-foreground">
                                {selectedMentor.experienceLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Interaction Tabs */}
                      <Tabs defaultValue="chat" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4 bg-dark-gray border border-primary/20">
                          <TabsTrigger value="chat" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">Chat</span>
                          </TabsTrigger>
                          <TabsTrigger value="video" className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            <span className="hidden sm:inline">Video</span>
                          </TabsTrigger>
                          <TabsTrigger value="emotion" className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span className="hidden sm:inline">Emotion</span>
                          </TabsTrigger>
                          <TabsTrigger value="recommendations" className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span className="hidden sm:inline">AI Recs</span>
                          </TabsTrigger>
                        </TabsList>

                        {/* Chat Tab */}
                        <TabsContent value="chat" className="space-y-4">
                          <Card className="border-primary/30 p-6 min-h-96">
                            <AIChatInterface
                              mentor={selectedMentor}
                              useGeminiAPI={useGeminiAPI}
                            />
                          </Card>
                        </TabsContent>

                        {/* Video Tab */}
                        <TabsContent value="video" className="space-y-4">
                          <Card className="border-primary/30 p-6">
                            <VideoCallInterface
                              mentor={selectedMentor}
                              isActive={isCallActive}
                              onEndCall={() => setIsCallActive(false)}
                            />
                          </Card>
                          {!isCallActive && (
                            <Button
                              onClick={() => setIsCallActive(true)}
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Start Video Call
                            </Button>
                          )}
                        </TabsContent>

                        {/* Emotion Detection Tab */}
                        <TabsContent value="emotion" className="space-y-4">
                          <Card className="border-primary/30 p-6">
                            <EmotionDetector
                              showWebcamPlaceholder={true}
                              onEmotionDetected={(emotion) => {
                                console.log('Detected emotion:', emotion);
                              }}
                            />
                          </Card>
                        </TabsContent>

                        {/* Recommendations Tab */}
                        <TabsContent value="recommendations" className="space-y-4">
                          <Card className="border-primary/30 p-6">
                            <AIRecommendationsDisplay
                              reels={reels}
                              quests={quests}
                              topics={topics}
                              userLevel="beginner"
                              onSelectItem={(item, type) => {
                                console.log('Selected item:', item, type);
                              }}
                            />
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </>
                  ) : (
                    <Card className="border-primary/30 p-12 text-center">
                      <div className="text-6xl mb-4">🎓</div>
                      <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                        Select a Mentor
                      </h3>
                      <p className="text-light-gray font-paragraph">
                        Choose a mentor from the left panel to start your personalized learning journey
                      </p>
                    </Card>
                  )}
                </motion.div>
              </div>
            </TabsContent>

            {/* Character Generator Tab */}
            <TabsContent value="character" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/30 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-primary mb-2">
                        Generate Your Learning Character
                      </h2>
                      <p className="text-light-gray font-paragraph">
                        Create a personalized anime character that represents your learning identity
                      </p>
                    </div>
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>

                  {generatedCharacter ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                            Your Character
                          </h3>
                          {generatedCharacter.imageUrl && (
                            <Image
                              src={generatedCharacter.imageUrl}
                              alt={generatedCharacter.name}
                              width={400}
                              height={400}
                              className="w-full rounded-lg border-2 border-primary/30 mb-4"
                            />
                          )}
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-light-gray uppercase tracking-widest mb-1">Name</p>
                              <p className="text-lg font-heading font-bold text-foreground">
                                {generatedCharacter.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-light-gray uppercase tracking-widest mb-1">Personality</p>
                              <p className="text-sm font-paragraph text-light-gray">
                                {generatedCharacter.personality}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-light-gray uppercase tracking-widest mb-1">Specialties</p>
                              <div className="flex flex-wrap gap-2">
                                {generatedCharacter.specialties?.map((spec: string, idx: number) => (
                                  <Badge key={idx} className="bg-secondary/20 text-secondary border-secondary/30">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Card className="border-primary/20 p-4 bg-primary/5">
                            <h4 className="font-heading font-bold text-primary mb-3">Character Traits</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-paragraph text-light-gray">Motivation</span>
                                <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                                  High
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-paragraph text-light-gray">Adaptability</span>
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  Excellent
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-paragraph text-light-gray">Learning Style</span>
                                <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                                  Multi-Modal
                                </Badge>
                              </div>
                            </div>
                          </Card>

                          <Card className="border-primary/20 p-4 bg-secondary/5">
                            <h4 className="font-heading font-bold text-secondary mb-3">Recommended Focus Areas</h4>
                            <ul className="space-y-2 text-sm font-paragraph text-light-gray">
                              <li>• Interactive learning modules</li>
                              <li>• Real-time mentor sessions</li>
                              <li>• Gamified challenges</li>
                              <li>• Peer collaboration</li>
                            </ul>
                          </Card>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={() => setGeneratedCharacter(null)}
                          variant="outline"
                          className="flex-1 border-primary text-primary hover:bg-primary/10"
                        >
                          Generate New Character
                        </Button>
                        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                          Save Character
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Palette className="w-16 h-16 text-primary/50 mb-4" />
                      <p className="text-light-gray font-paragraph mb-6 text-center max-w-md">
                        Click the button below to generate your unique learning character powered by AI
                      </p>
                      <Button
                        onClick={() => setShowCharacterGenerator(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Character
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Character Generator Modal */}
                <AnimatePresence>
                  {showCharacterGenerator && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-background border-2 border-primary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-heading font-bold text-primary">
                              Create Your Character
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowCharacterGenerator(false)}
                              className="text-light-gray hover:text-foreground"
                            >
                              ✕
                            </Button>
                          </div>
                          <AnimeCharacterGenerator
                            onCharacterGenerated={(character) => {
                              setGeneratedCharacter(character);
                              setShowCharacterGenerator(false);
                            }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>

            {/* Mood Detection Tab */}
            <TabsContent value="mood" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Mood Detection */}
                  <div className="lg:col-span-2">
                    <Card className="border-primary/30 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-heading font-bold text-primary">
                          Mood Detection
                        </h2>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="mood-toggle"
                            checked={isMoodDetectionActive}
                            onChange={(e) => setIsMoodDetectionActive(e.target.checked)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="mood-toggle" className="text-sm text-light-gray cursor-pointer">
                            Active
                          </label>
                        </div>
                      </div>

                      <EmotionDetector
                        showWebcamPlaceholder={true}
                        onEmotionDetected={handleEmotionDetected}
                      />

                      {currentMood && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg"
                        >
                          <p className="text-sm text-light-gray mb-2">Current Mood</p>
                          <p className="text-2xl font-heading font-bold text-primary capitalize mb-2">
                            {currentMood.mood}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-dark-gray rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${currentMood.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-light-gray">
                              {Math.round(currentMood.confidence * 100)}%
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </div>

                  {/* Mood Stats */}
                  <div className="space-y-4">
                    <Card className="border-primary/30 p-6">
                      <h3 className="text-lg font-heading font-bold text-primary mb-4">Mood Trend</h3>
                      <div className="text-center">
                        <p className="text-3xl mb-2">
                          {getMoodTrend() === 'improving' ? '📈' : getMoodTrend() === 'declining' ? '📉' : '➡️'}
                        </p>
                        <p className="text-sm font-paragraph text-light-gray capitalize">
                          {getMoodTrend()} mood
                        </p>
                      </div>
                    </Card>

                    <Card className="border-primary/30 p-6">
                      <h3 className="text-lg font-heading font-bold text-primary mb-4">Recent Moods</h3>
                      <div className="space-y-2">
                        {moodHistory.slice(-5).reverse().map((mood, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-light-gray capitalize">{mood.mood}</span>
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {Math.round(mood.confidence * 100)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-primary/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-heading font-bold text-foreground">Learning Consistency</h3>
                      <TrendingUp className="w-5 h-5 text-neon-green" />
                    </div>
                    <p className="text-3xl font-heading font-black text-neon-green mb-2">87%</p>
                    <p className="text-sm text-light-gray font-paragraph">
                      You're maintaining excellent study habits
                    </p>
                  </Card>

                  <Card className="border-primary/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-heading font-bold text-foreground">Mentor Interactions</h3>
                      <Brain className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="text-3xl font-heading font-black text-secondary mb-2">24</p>
                    <p className="text-sm text-light-gray font-paragraph">
                      Sessions completed this month
                    </p>
                  </Card>

                  <Card className="border-primary/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-heading font-bold text-foreground">Mood Stability</h3>
                      <Heart className="w-5 h-5 text-cyber-yellow" />
                    </div>
                    <p className="text-3xl font-heading font-black text-cyber-yellow mb-2">92%</p>
                    <p className="text-sm text-light-gray font-paragraph">
                      Positive emotional engagement
                    </p>
                  </Card>
                </div>

                <Card className="border-primary/30 p-6 mt-6">
                  <h3 className="text-2xl font-heading font-bold text-primary mb-6">Personalized Recommendations</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h4 className="font-heading font-bold text-foreground mb-2">🎯 Focus Areas</h4>
                      <p className="text-sm text-light-gray font-paragraph">
                        Based on your mood patterns, we recommend focusing on interactive learning sessions during your peak energy hours (9-11 AM).
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                      <h4 className="font-heading font-bold text-foreground mb-2">💡 Mentor Suggestion</h4>
                      <p className="text-sm text-light-gray font-paragraph">
                        Your learning style matches well with mentors who use visual demonstrations and real-world examples.
                      </p>
                    </div>
                    <div className="p-4 bg-neon-green/10 border border-neon-green/20 rounded-lg">
                      <h4 className="font-heading font-bold text-foreground mb-2">🚀 Next Steps</h4>
                      <p className="text-sm text-light-gray font-paragraph">
                        Complete 3 more video call sessions to unlock advanced mentor features and personalized learning paths.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="border-primary/20 p-6">
            <MessageSquare className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-heading font-bold text-foreground mb-2">AI Chat</h4>
            <p className="text-sm text-light-gray font-paragraph">
              Real-time conversations with AI mentors about any topic
            </p>
          </Card>
          <Card className="border-primary/20 p-6">
            <Video className="w-8 h-8 text-secondary mb-3" />
            <h4 className="font-heading font-bold text-foreground mb-2">Video Calls</h4>
            <p className="text-sm text-light-gray font-paragraph">
              Interactive video sessions for personalized guidance
            </p>
          </Card>
          <Card className="border-primary/20 p-6">
            <Sparkles className="w-8 h-8 text-cyber-yellow mb-3" />
            <h4 className="font-heading font-bold text-foreground mb-2">Character Gen</h4>
            <p className="text-sm text-light-gray font-paragraph">
              Create your unique learning character with AI
            </p>
          </Card>
          <Card className="border-primary/20 p-6">
            <Heart className="w-8 h-8 text-neon-green mb-3" />
            <h4 className="font-heading font-bold text-foreground mb-2">Mood Tracking</h4>
            <p className="text-sm text-light-gray font-paragraph">
              Adaptive learning based on emotional state
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
