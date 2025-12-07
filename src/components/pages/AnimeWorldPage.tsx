import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimeWorldMap } from '@/components/ui/anime-world-map';

export default function AnimeWorldPage() {
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
            Anime World Map
          </h1>
          <p className="text-xl font-paragraph text-light-gray max-w-2xl">
            Explore the vast anime universe and discover new learning territories. Each region represents a different subject area with unique challenges and rewards.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimeWorldMap />
        </motion.div>
      </div>
    </div>
  );
}
