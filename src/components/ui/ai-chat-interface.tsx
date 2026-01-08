/**
 * AI Chat Interface Component
 * Handles mentor-student conversations with sentiment analysis
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mentors } from '@/entities';
import { analyzeSentiment, getEmotionEmoji, getEmotionColor } from '@/lib/sentiment-analysis';
import { sendToGemini, generateMentorResponseFallback } from '@/lib/gemini-integration';
import { Send, Loader } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  timestamp: Date;
  sentiment?: ReturnType<typeof analyzeSentiment>;
}

interface AIChatInterfaceProps {
  mentor: Mentors;
  useGeminiAPI?: boolean;
}

export function AIChatInterface({ mentor, useGeminiAPI = false }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      sentiment: analyzeSentiment(inputValue),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let mentorResponse: string;

      if (useGeminiAPI) {
        // Use Gemini API
        const result = await sendToGemini(inputValue, {
          mentorName: mentor.name || 'Mentor',
          mentorSpecialty: mentor.specialty || 'Learning',
          personalityType: mentor.personalityType || 'empathetic',
        }, messages.map(m => ({
          role: m.role === 'mentor' ? 'assistant' : m.role,
          content: m.content,
        })));

        mentorResponse = result.success
          ? result.message || 'I understand. Tell me more!'
          : 'I encountered an issue. Please try again.';
      } else {
        // Use fallback response
        mentorResponse = generateMentorResponseFallback(inputValue, {
          mentorName: mentor.name || 'Mentor',
          mentorSpecialty: mentor.specialty || 'Learning',
          personalityType: mentor.personalityType || 'empathetic',
        });
      }

      // Add mentor response
      const mentorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'mentor',
        content: mentorResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, mentorMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'mentor',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Chat Messages */}
      <Card className="flex-1 border-primary/30 bg-gray-900 p-4 overflow-y-auto space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-center"
            >
              <div>
                <p className="text-4xl mb-4">👋</p>
                <p className="text-gray-400">Start a conversation with {mentor.name}!</p>
                <p className="text-xs text-gray-500 mt-2">
                  Ask questions about {mentor.specialty}
                </p>
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-black rounded-br-none'
                      : 'bg-gray-800 text-white rounded-bl-none border border-primary/30'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>

                  {/* Sentiment indicator for user messages */}
                  {message.sentiment && message.role === 'user' && (
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <span>{getEmotionEmoji(message.sentiment.emotion)}</span>
                      <span className={getEmotionColor(message.sentiment.emotion)}>
                        {message.sentiment.emotion.replace('_', ' ')}
                      </span>
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-primary/30 flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm">{mentor.name} is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Ask ${mentor.name} anything...`}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="bg-primary text-black hover:bg-primary/90 px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Sentiment Analysis Info */}
      {messages.length > 0 && messages[messages.length - 1].role === 'user' && messages[messages.length - 1].sentiment && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-400 text-center"
        >
          {mentor.name} is analyzing your emotional state to provide better support...
        </motion.div>
      )}
    </div>
  );
}
