import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EpisodeProgressionTimeline } from '@/components/ui/episode-progression-timeline';

export default function EpisodeProgressionPage() {
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
            Episode Progression
          </h1>
          <p className="text-xl font-paragraph text-light-gray max-w-2xl">
            Track your learning journey episode by episode. Watch your progress unfold like a compelling anime series with cliffhangers, revelations, and character growth moments.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EpisodeProgressionTimeline />
        </motion.div>
      </div>
    </div>
  );
}
