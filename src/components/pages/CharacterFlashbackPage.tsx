import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CharacterFlashbackScenes } from '@/components/ui/character-flashback-scenes';

export default function CharacterFlashbackPage() {
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
            Character Flashbacks
          </h1>
          <p className="text-xl font-paragraph text-light-gray max-w-2xl">
            Dive into character backstories and flashback scenes. Understand the deeper context and motivations behind key concepts through character-driven narratives.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CharacterFlashbackScenes />
        </motion.div>
      </div>
    </div>
  );
}
