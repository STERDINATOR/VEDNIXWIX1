import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Brain, Sparkles, Flame, Lightbulb, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { EmotionAdaptiveRealityShift } from '@/components/ui/emotion-adaptive-reality-shift';
import { KnowledgeGenomeMapping } from '@/components/ui/knowledge-genome-mapping';
import { NeuralStoryCombat } from '@/components/ui/neural-story-combat';
import { MultiMentorCollaboration } from '@/components/ui/multi-mentor-collaboration';
import { AdaptiveAnimeEmotionActing } from '@/components/ui/adaptive-anime-emotion-acting';
import { TimeSkipTrainingRoom } from '@/components/ui/time-skip-training-room';
import { QuantumLearningShard } from '@/components/ui/quantum-learning-shards';
import { MultiverseLearningRoutes } from '@/components/ui/multiverse-learning-routes';
import { SpiritPowerMeter } from '@/components/ui/spirit-power-meter';

export default function AdvancedLearningPage() {
  const features = [
    {
      title: 'Emotion-Adaptive Reality Shift',
      description: 'Learning content that adapts based on your emotional state and engagement level',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'text-primary'
    },
    {
      title: 'Knowledge Genome Mapping',
      description: 'Visualize your knowledge structure and connections between concepts',
      icon: <Brain className="h-6 w-6" />,
      color: 'text-secondary'
    },
    {
      title: 'Neural Story Combat',
      description: 'Battle against knowledge challenges in real-time story scenarios',
      icon: <Flame className="h-6 w-6" />,
      color: 'text-neon-green'
    },
    {
      title: 'Multi-Mentor Collaboration',
      description: 'Learn from multiple AI mentors with different teaching styles',
      icon: <Lightbulb className="h-6 w-6" />,
      color: 'text-cyber-yellow'
    },
    {
      title: 'Adaptive Anime Emotion Acting',
      description: 'Characters respond to your learning progress with emotional reactions',
      icon: <Zap className="h-6 w-6" />,
      color: 'text-primary'
    },
    {
      title: 'Time-Skip Training Room',
      description: 'Accelerated learning sessions with compressed time progression',
      icon: <Wand2 className="h-6 w-6" />,
      color: 'text-secondary'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link to="/profile">
            <Button variant="outline" className="border-primary text-primary mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-5xl font-heading font-black text-primary mb-4">
            Advanced Learning Features
          </h1>
          <p className="text-xl font-paragraph text-light-gray max-w-2xl">
            Unlock cutting-edge learning technologies powered by AI and anime-inspired narratives. These advanced features adapt to your learning style and emotional state.
          </p>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-dark-gray border-primary/20 p-6 hover:border-primary/50 transition-all"
            >
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm font-paragraph text-light-gray">
                {feature.description}
              </p>
            </Card>
          ))}
        </motion.div>

        {/* Detailed Features */}
        <div className="space-y-20">
          {/* Emotion-Adaptive Reality Shift */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Emotion-Adaptive Reality Shift
            </h2>
            <EmotionAdaptiveRealityShift />
          </motion.div>

          {/* Knowledge Genome Mapping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Knowledge Genome Mapping
            </h2>
            <KnowledgeGenomeMapping />
          </motion.div>

          {/* Neural Story Combat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Neural Story Combat
            </h2>
            <NeuralStoryCombat />
          </motion.div>

          {/* Multi-Mentor Collaboration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Multi-Mentor Collaboration
            </h2>
            <MultiMentorCollaboration />
          </motion.div>

          {/* Adaptive Anime Emotion Acting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Adaptive Anime Emotion Acting
            </h2>
            <AdaptiveAnimeEmotionActing />
          </motion.div>

          {/* Time-Skip Training Room */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Time-Skip Training Room
            </h2>
            <TimeSkipTrainingRoom />
          </motion.div>

          {/* Quantum Learning Shards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Quantum Learning Shards
            </h2>
            <QuantumLearningShard />
          </motion.div>

          {/* Multiverse Learning Routes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Multiverse Learning Routes
            </h2>
            <MultiverseLearningRoutes />
          </motion.div>

          {/* Spirit Power Meter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              Spirit Power Meter
            </h2>
            <SpiritPowerMeter />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
