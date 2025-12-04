import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, BookOpen, Zap } from 'lucide-react';

interface EngagementDashboardProps {
  totalXP: number;
  level: number;
  completedReels: number;
  completedQuizzes: number;
  achievements: number;
}

export function EngagementDashboard({
  totalXP,
  level,
  completedReels,
  completedQuizzes,
  achievements,
}: EngagementDashboardProps) {
  const [xpData, setXpData] = useState<any[]>([]);
  const [topicData, setTopicData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock XP progression data
    const xpProgression = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      xp: Math.floor(Math.random() * 500) + 100,
    }));
    setXpData(xpProgression);

    // Generate mock topic performance data
    const topics = [
      { name: 'Algebra', value: 35, color: '#00FFFF' },
      { name: 'Geometry', value: 25, color: '#FF00FF' },
      { name: 'Calculus', value: 20, color: '#FFFF00' },
      { name: 'Statistics', value: 20, color: '#00FF00' },
    ];
    setTopicData(topics);
  }, []);

  const stats = [
    { label: 'Current Level', value: level, icon: TrendingUp, color: 'text-primary' },
    { label: 'Total XP', value: totalXP, icon: Zap, color: 'text-cyber-yellow' },
    { label: 'Reels Completed', value: completedReels, icon: BookOpen, color: 'text-secondary' },
    { label: 'Achievements', value: achievements, icon: Award, color: 'text-neon-green' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-dark-gray/50 border-primary/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-paragraph text-xs text-light-gray/60 mb-1">
                      {stat.label}
                    </p>
                    <p className={`font-heading text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Progression Chart */}
        <Card className="bg-dark-gray/50 border-primary/20 p-6">
          <h3 className="font-heading text-lg text-primary mb-4">XP Progression (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="day" stroke="#CCCCCC" />
              <YAxis stroke="#CCCCCC" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #00FFFF',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#CCCCCC' }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#00FFFF"
                dot={{ fill: '#00FFFF', r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Topic Distribution Chart */}
        <Card className="bg-dark-gray/50 border-primary/20 p-6">
          <h3 className="font-heading text-lg text-primary mb-4">Topic Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topicData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #00FFFF',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#CCCCCC' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="bg-dark-gray/50 border-primary/20 p-6">
        <h3 className="font-heading text-lg text-primary mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-paragraph text-light-gray/60 text-sm mb-2">Quiz Success Rate</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-dark-gray/50 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="font-heading text-primary font-bold">85%</span>
            </div>
          </div>
          <div>
            <p className="font-paragraph text-light-gray/60 text-sm mb-2">Learning Consistency</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-dark-gray/50 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-secondary to-cyber-yellow h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <span className="font-heading text-secondary font-bold">72%</span>
            </div>
          </div>
          <div>
            <p className="font-paragraph text-light-gray/60 text-sm mb-2">Topic Mastery</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-dark-gray/50 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-cyber-yellow to-neon-green h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
              <span className="font-heading text-neon-green font-bold">68%</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
