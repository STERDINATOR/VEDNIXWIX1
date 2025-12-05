import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Mentor {
  id: string;
  name: string;
  emoji: string;
  specialty: string;
  level: number;
  expertise: string[];
  collaboration: number;
  quote: string;
  color: string;
}

const mentors: Mentor[] = [
  {
    id: 'logic-sage',
    name: 'Logic Sage',
    emoji: '🧙‍♂️',
    specialty: 'Logic & Reasoning',
    level: 15,
    expertise: ['Problem Solving', 'Algorithms', 'Critical Thinking'],
    collaboration: 85,
    quote: 'Every problem has a logical solution. Find the pattern.',
    color: '#00FFFF'
  },
  {
    id: 'code-master',
    name: 'Code Master',
    emoji: '💻',
    specialty: 'Programming',
    level: 18,
    expertise: ['Python', 'JavaScript', 'System Design'],
    collaboration: 92,
    quote: 'Code is poetry. Write it with purpose.',
    color: '#00FF00'
  },
  {
    id: 'math-wizard',
    name: 'Math Wizard',
    emoji: '🔢',
    specialty: 'Mathematics',
    level: 16,
    expertise: ['Calculus', 'Linear Algebra', 'Statistics'],
    collaboration: 78,
    quote: 'Numbers tell stories. Listen to them.',
    color: '#FFFF00'
  },
  {
    id: 'physics-oracle',
    name: 'Physics Oracle',
    emoji: '⚛️',
    specialty: 'Physics',
    level: 17,
    expertise: ['Mechanics', 'Quantum Theory', 'Relativity'],
    collaboration: 88,
    quote: 'The universe speaks in equations.',
    color: '#FF00FF'
  }
];

export function MultiMentorCollaboration() {
  const [selectedMentors, setSelectedMentors] = useState<string[]>(['logic-sage', 'code-master']);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('');

  const toggleMentor = (mentorId: string) => {
    setSelectedMentors(prev =>
      prev.includes(mentorId)
        ? prev.filter(id => id !== mentorId)
        : [...prev, mentorId]
    );
  };

  const selectedMentorData = mentors.filter(m => selectedMentors.includes(m.id));
  const collaborationScore = selectedMentorData.length > 1
    ? Math.round(selectedMentorData.reduce((acc, m) => acc + m.collaboration, 0) / selectedMentorData.length)
    : 0;

  return (
    <div className="w-full py-24 md:py-40 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-[120rem] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-6xl md:text-7xl text-foreground mb-4">
            MULTI-MENTOR <span className="text-primary">COLLABORATION AI</span>
          </h2>
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Learn from multiple mentors simultaneously. Their combined expertise creates powerful synergies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentor Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mentor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentors.map((mentor, index) => {
                const isSelected = selectedMentors.includes(mentor.id);

                return (
                  <motion.button
                    key={mentor.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => toggleMentor(mentor.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`transition-all border-2 rounded-lg p-6 text-left ${
                      isSelected ? 'bg-dark-gray' : 'bg-background/40 hover:bg-background/60'
                    }`}
                    style={{
                      borderColor: isSelected ? mentor.color : '#333333',
                      boxShadow: isSelected ? `0 0 20px ${mentor.color}40` : 'none'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{mentor.emoji}</div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>

                    <h3 className="font-heading text-xl text-foreground mb-1">
                      {mentor.name}
                    </h3>
                    <p className="text-sm text-light-gray mb-3">
                      {mentor.specialty}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-light-gray">Level {mentor.level}</span>
                      <div className="flex-1 h-1 bg-background/40 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: mentor.color,
                            width: `${(mentor.level / 20) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-light-gray italic">
                      "{mentor.quote}"
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Collaboration Session */}
            {selectedMentorData.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <Card className="bg-dark-gray border-2 border-primary p-6">
                  <h3 className="font-heading text-xl text-foreground mb-4">
                    Collaboration Session
                  </h3>

                  {/* Selected Mentors Display */}
                  <div className="mb-6">
                    <p className="text-xs text-light-gray uppercase tracking-widest mb-3">
                      Active Mentors
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedMentorData.map((mentor) => (
                        <motion.div
                          key={mentor.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2 bg-background/40 rounded-lg px-3 py-2 border border-primary/20"
                        >
                          <span className="text-2xl">{mentor.emoji}</span>
                          <div>
                            <p className="font-heading text-sm text-foreground">
                              {mentor.name}
                            </p>
                            <p className="text-xs text-light-gray">
                              Collab: {mentor.collaboration}%
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Collaboration Score */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-light-gray uppercase tracking-widest">
                        Collaboration Synergy
                      </span>
                      <span className="text-sm font-heading text-primary">
                        {collaborationScore}%
                      </span>
                    </div>
                    <Progress value={collaborationScore} className="h-3" />
                  </div>

                  {/* Combined Expertise */}
                  <div className="mb-6">
                    <p className="text-xs text-light-gray uppercase tracking-widest mb-3">
                      Combined Expertise
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        new Set(selectedMentorData.flatMap(m => m.expertise))
                      ).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-primary text-primary"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Topic Input */}
                  <div className="mb-4">
                    <label className="text-xs text-light-gray uppercase tracking-widest block mb-2">
                      Learning Topic
                    </label>
                    <input
                      type="text"
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      placeholder="Enter a topic to learn about..."
                      className="w-full bg-background/60 border border-primary/30 rounded px-3 py-2 text-foreground placeholder-light-gray focus:outline-none focus:border-primary"
                    />
                  </div>

                  <Button
                    onClick={() => setCollaborationMode(true)}
                    disabled={!sessionTopic}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase disabled:opacity-50"
                  >
                    Start Collaboration Session
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Collaboration Session View */}
            <AnimatePresence>
              {collaborationMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <Card className="bg-dark-gray border-2 border-cyber-yellow p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-2xl text-foreground">
                        Live Collaboration
                      </h3>
                      <Button
                        onClick={() => setCollaborationMode(false)}
                        variant="outline"
                        className="border-primary text-primary"
                      >
                        End Session
                      </Button>
                    </div>

                    <div className="bg-background/60 rounded-lg p-6 mb-6 border border-primary/20">
                      <p className="text-xs text-light-gray uppercase tracking-widest mb-3">
                        Current Topic
                      </p>
                      <h4 className="font-heading text-2xl text-cyber-yellow mb-4">
                        {sessionTopic}
                      </h4>

                      {/* Mentor Responses */}
                      <div className="space-y-4">
                        {selectedMentorData.map((mentor, index) => (
                          <motion.div
                            key={mentor.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-background/40 rounded p-4 border-l-4"
                            style={{ borderColor: mentor.color }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">{mentor.emoji}</span>
                              <div className="flex-1">
                                <p className="font-heading text-sm text-foreground mb-2">
                                  {mentor.name}
                                </p>
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                  className="font-paragraph text-sm text-light-gray"
                                >
                                  {mentor.quote}
                                </motion.p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" className="border-primary text-primary">
                        Ask Question
                      </Button>
                      <Button variant="outline" className="border-primary text-primary">
                        Get Exercise
                      </Button>
                      <Button variant="outline" className="border-primary text-primary">
                        Take Quiz
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mentor Stats */}
          <div className="space-y-4">
            <Card className="bg-dark-gray border-2 border-primary p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Mentor Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                    Selected Mentors
                  </p>
                  <p className="font-heading text-3xl text-primary">
                    {selectedMentors.length}
                  </p>
                </div>

                {selectedMentorData.length > 0 && (
                  <>
                    <div>
                      <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                        Avg. Level
                      </p>
                      <p className="font-heading text-2xl text-secondary">
                        {Math.round(
                          selectedMentorData.reduce((acc, m) => acc + m.level, 0) /
                          selectedMentorData.length
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-light-gray uppercase tracking-widest mb-2">
                        Synergy Score
                      </p>
                      <p className="font-heading text-2xl text-cyber-yellow">
                        {collaborationScore}%
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="bg-background/40 border border-primary/20 p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">Tips</h3>
              <ul className="space-y-2 text-sm font-paragraph text-light-gray">
                <li>• Select 2+ mentors for collaboration</li>
                <li>• Higher synergy = better learning</li>
                <li>• Each mentor has unique expertise</li>
                <li>• Combined knowledge is powerful</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
