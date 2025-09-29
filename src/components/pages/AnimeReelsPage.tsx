import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimeReelFeed, sampleAnimeReels } from '@/components/ui/anime-reel';
import { 
  Film, 
  Play, 
  Star, 
  Zap, 
  Clock, 
  Users,
  TrendingUp,
  Filter,
  Search,
  BookOpen,
  Trophy,
  Target
} from 'lucide-react';
import { useMember } from '@/integrations';

export default function AnimeReelsPage() {
  const { member } = useMember();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Subjects', count: sampleAnimeReels.length },
    { id: 'Programming', name: 'Programming', count: sampleAnimeReels.filter(r => r.subject === 'Programming').length },
    { id: 'Mathematics', name: 'Mathematics', count: sampleAnimeReels.filter(r => r.subject === 'Mathematics').length },
    { id: 'Physics', name: 'Physics', count: sampleAnimeReels.filter(r => r.subject === 'Physics').length },
    { id: 'Chemistry', name: 'Chemistry', count: sampleAnimeReels.filter(r => r.subject === 'Chemistry').length },
    { id: 'History', name: 'History', count: sampleAnimeReels.filter(r => r.subject === 'History').length }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'Easy', name: 'Easy', color: 'text-cyber-yellow' },
    { id: 'Medium', name: 'Medium', color: 'text-neon-green' },
    { id: 'Hard', name: 'Hard', color: 'text-primary' },
    { id: 'Epic', name: 'Epic', color: 'text-secondary' }
  ];

  const filteredReels = sampleAnimeReels.filter(reel => {
    const categoryMatch = selectedCategory === 'all' || reel.subject === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || reel.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const totalXP = sampleAnimeReels.reduce((sum, reel) => sum + reel.xp, 0);
  const totalLikes = sampleAnimeReels.reduce((sum, reel) => sum + reel.likes, 0);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-heading font-black text-primary mb-4">
            Anime Learning Reels
          </h1>
          <p className="text-xl font-paragraph text-light-gray max-w-3xl mx-auto">
            Immerse yourself in educational content through captivating anime scenes. 
            Learn, interact, and earn XP through our revolutionary reel-based learning system.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Film className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{sampleAnimeReels.length}</p>
            <p className="text-sm font-paragraph text-light-gray">Total Reels</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Zap className="h-8 w-8 text-neon-green mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{totalXP.toLocaleString()}</p>
            <p className="text-sm font-paragraph text-light-gray">Total XP Available</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">{totalLikes.toLocaleString()}</p>
            <p className="text-sm font-paragraph text-light-gray">Community Likes</p>
          </Card>
          
          <Card className="bg-dark-gray border-primary/20 p-6 text-center">
            <Star className="h-8 w-8 text-cyber-yellow mx-auto mb-3" />
            <p className="text-3xl font-heading font-bold text-foreground">4.8</p>
            <p className="text-sm font-paragraph text-light-gray">Average Rating</p>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Subjects
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full justify-between ${
                        selectedCategory === category.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-light-gray hover:text-foreground'
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Difficulty Filter */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Difficulty
                </h3>
                <div className="space-y-2">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty.id}
                      variant={selectedDifficulty === difficulty.id ? 'default' : 'ghost'}
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                      className={`w-full justify-start ${
                        selectedDifficulty === difficulty.id 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'text-light-gray hover:text-foreground'
                      }`}
                    >
                      <span className={difficulty.color || 'text-foreground'}>
                        {difficulty.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-neon-green" />
                  Your Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-paragraph text-light-gray text-sm">Reels Watched:</span>
                    <span className="font-heading font-bold text-primary">
                      {sampleAnimeReels.filter(reel => 
                        filteredReels.some(filtered => filtered.id === reel.id)
                      ).length > 0 ? '3' : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-paragraph text-light-gray text-sm">XP Earned:</span>
                    <span className="font-heading font-bold text-neon-green">
                      {filteredReels.length > 0 ? '425' : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-paragraph text-light-gray text-sm">Quiz Score:</span>
                    <span className="font-heading font-bold text-secondary">
                      {filteredReels.length > 0 ? '87%' : '0%'}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Main Content - Reel Player */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-foreground">
                    {selectedCategory === 'all' ? 'All Subjects' : selectedCategory} Reels
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary">
                      {filteredReels.length} reels
                    </Badge>
                    {selectedDifficulty !== 'all' && (
                      <Badge className="bg-secondary/20 text-secondary">
                        {selectedDifficulty} level
                      </Badge>
                    )}
                  </div>
                </div>

                {filteredReels.length > 0 ? (
                  <AnimeReelFeed reels={filteredReels} />
                ) : (
                  <div className="text-center py-12">
                    <Film className="h-16 w-16 text-light-gray mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                      No Reels Found
                    </h3>
                    <p className="font-paragraph text-light-gray mb-6">
                      Try adjusting your filters to find more content.
                    </p>
                    <Button 
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedDifficulty('all');
                      }}
                      className="bg-primary text-primary-foreground"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Features Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="bg-dark-gray border-primary/20 p-6 text-center">
                <Play className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-heading font-bold text-foreground mb-2">Interactive Learning</h4>
                <p className="text-sm font-paragraph text-light-gray">
                  Answer quiz questions during reels to earn bonus XP and reinforce learning
                </p>
              </Card>
              
              <Card className="bg-dark-gray border-primary/20 p-6 text-center">
                <BookOpen className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h4 className="font-heading font-bold text-foreground mb-2">Story-Driven Content</h4>
                <p className="text-sm font-paragraph text-light-gray">
                  Follow anime characters through educational adventures that make learning memorable
                </p>
              </Card>
              
              <Card className="bg-dark-gray border-primary/20 p-6 text-center">
                <Trophy className="h-8 w-8 text-neon-green mx-auto mb-3" />
                <h4 className="font-heading font-bold text-foreground mb-2">Progress Tracking</h4>
                <p className="text-sm font-paragraph text-light-gray">
                  Track your learning progress, earn achievements, and compete with friends
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}