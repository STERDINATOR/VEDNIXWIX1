/**
 * Mentor Selector Component
 * Allows users to select and interact with AI mentors
 */

import { useState, useEffect } from 'react';
import { Mentors } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';

interface MentorSelectorProps {
  onSelectMentor: (mentor: Mentors) => void;
  selectedMentorId?: string;
}

export function MentorSelector({ onSelectMentor, selectedMentorId }: MentorSelectorProps) {
  const [mentors, setMentors] = useState<Mentors[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentors();
  }, []);

  async function loadMentors() {
    try {
      const { items } = await BaseCrudService.getAll<Mentors>('mentors');
      setMentors(items);
    } catch (error) {
      console.error('Failed to load mentors:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-400">No mentors available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-heading font-bold text-foreground">Choose Your Mentor</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map((mentor, index) => (
          <motion.div
            key={mentor._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selectedMentorId === mentor._id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-700 hover:border-primary/50'
              }`}
              onClick={() => onSelectMentor(mentor)}
            >
              <div className="space-y-3">
                {/* Avatar */}
                {mentor.avatarImage && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={mentor.avatarImage}
                      alt={mentor.name || 'Mentor'}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Name */}
                <div>
                  <h4 className="font-heading font-bold text-foreground text-sm">
                    {mentor.name}
                  </h4>
                  <p className="text-xs text-primary font-semibold">
                    {mentor.specialty}
                  </p>
                </div>

                {/* Personality & Experience */}
                <div className="flex gap-2 flex-wrap">
                  {mentor.personalityType && (
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                      {mentor.personalityType}
                    </span>
                  )}
                  {mentor.experienceLevel && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {mentor.experienceLevel}
                    </span>
                  )}
                </div>

                {/* Bio */}
                {mentor.bio && (
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {mentor.bio}
                  </p>
                )}

                {/* Select Button */}
                <Button
                  onClick={() => onSelectMentor(mentor)}
                  className={`w-full text-xs ${
                    selectedMentorId === mentor._id
                      ? 'bg-primary text-black'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {selectedMentorId === mentor._id ? '✓ Selected' : 'Select'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
