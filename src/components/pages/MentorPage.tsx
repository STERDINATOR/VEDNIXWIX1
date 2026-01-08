/**
 * Mentor Page
 * Complete AI mentor system with video calls, chat, and emotion detection
 */

import { useState, useEffect } from 'react';
import { Mentors, AnimeEducationalReels, Quests, LearningTopics } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { MentorSelector } from '@/components/ui/mentor-selector';
import { VideoCallInterface } from '@/components/ui/video-call-interface';
import { AIChatInterface } from '@/components/ui/ai-chat-interface';
import { EmotionDetector } from '@/components/ui/emotion-detector';
import { AIRecommendationsDisplay } from '@/components/ui/ai-recommendations-display';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Video, MessageSquare, Zap, BookOpen } from 'lucide-react';

export default function MentorPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentors | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [reels, setReels] = useState<AnimeEducationalReels[]>([]);
  const [quests, setQuests] = useState<Quests[]>([]);
  const [topics, setTopics] = useState<LearningTopics[]>([]);
  const [loading, setLoading] = useState(true);
  const [useGeminiAPI, setUseGeminiAPI] = useState(false);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            AI Mentor System
          </h1>
          <p className="text-gray-400">
            Connect with AI mentors for personalized learning guidance
          </p>
        </motion.div>

        {/* API Toggle */}
        <div className="mb-6 flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <input
            type="checkbox"
            id="gemini-toggle"
            checked={useGeminiAPI}
            onChange={(e) => setUseGeminiAPI(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="gemini-toggle" className="text-sm text-gray-300">
            Use Gemini API (requires backend endpoint and API key)
          </label>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Mentor Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="border-primary/30 p-4 sticky top-4">
              <MentorSelector
                selectedMentorId={selectedMentor?._id}
                onSelectMentor={setSelectedMentor}
              />
            </Card>
          </motion.div>

          {/* Right Column - Interaction Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {selectedMentor ? (
              <>
                {/* Mentor Info Card */}
                <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-foreground">
                        {selectedMentor.name}
                      </h2>
                      <p className="text-primary text-sm">
                        {selectedMentor.specialty}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        {selectedMentor.bio}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-2">Personality</p>
                      <p className="text-sm font-bold text-secondary mb-3">
                        {selectedMentor.personalityType}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">Experience</p>
                      <p className="text-sm font-bold text-primary">
                        {selectedMentor.experienceLevel}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Interaction Tabs */}
                <Tabs defaultValue="chat" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700">
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
                    <Card className="border-primary/30 p-4 h-96">
                      <AIChatInterface
                        mentor={selectedMentor}
                        useGeminiAPI={useGeminiAPI}
                      />
                    </Card>
                  </TabsContent>

                  {/* Video Tab */}
                  <TabsContent value="video" className="space-y-4">
                    <Card className="border-primary/30 p-4">
                      <VideoCallInterface
                        mentor={selectedMentor}
                        isActive={isCallActive}
                        onEndCall={() => setIsCallActive(false)}
                      />
                    </Card>
                    {!isCallActive && (
                      <Button
                        onClick={() => setIsCallActive(true)}
                        className="w-full bg-primary text-black hover:bg-primary/90 font-bold"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Video Call
                      </Button>
                    )}
                  </TabsContent>

                  {/* Emotion Detection Tab */}
                  <TabsContent value="emotion" className="space-y-4">
                    <Card className="border-primary/30 p-4">
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
                    <Card className="border-primary/30 p-4">
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
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                  Select a Mentor
                </h3>
                <p className="text-gray-400">
                  Choose a mentor from the left panel to start your learning journey
                </p>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="border-gray-700 p-4">
            <h4 className="font-heading font-bold text-foreground mb-2">💬 Chat</h4>
            <p className="text-sm text-gray-400">
              Have real-time conversations with your AI mentor about any topic
            </p>
          </Card>
          <Card className="border-gray-700 p-4">
            <h4 className="font-heading font-bold text-foreground mb-2">📹 Video Calls</h4>
            <p className="text-sm text-gray-400">
              Engage in simulated video calls with your mentor for interactive learning
            </p>
          </Card>
          <Card className="border-gray-700 p-4">
            <h4 className="font-heading font-bold text-foreground mb-2">🎯 Smart Recommendations</h4>
            <p className="text-sm text-gray-400">
              Get AI-powered personalized learning recommendations based on your progress
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
