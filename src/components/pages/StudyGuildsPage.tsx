import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { 
  Users, 
  Plus, 
  Search, 
  MessageCircle, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Phone,
  PhoneOff,
  Settings,
  Crown,
  Shield,
  Star,
  Send,
  Hash,
  Volume2,
  VolumeX,
  UserPlus,
  UserMinus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Share2
} from 'lucide-react';
import { useMember } from '@/integrations';

interface GuildMember {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  status: 'online' | 'away' | 'busy' | 'offline';
  level: number;
  joinedAt: Date;
  lastSeen: Date;
  isInVoice?: boolean;
  isMuted?: boolean;
  isDeafened?: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  reactions?: { emoji: string; users: string[] }[];
}

interface VoiceChannel {
  id: string;
  name: string;
  members: GuildMember[];
  maxMembers: number;
  isLocked: boolean;
}

interface TextChannel {
  id: string;
  name: string;
  description: string;
  messages: ChatMessage[];
  isPrivate: boolean;
}

interface StudyGuild {
  id: string;
  name: string;
  description: string;
  avatar: string;
  banner: string;
  memberCount: number;
  maxMembers: number;
  subject: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  isPrivate: boolean;
  owner: string;
  members: GuildMember[];
  textChannels: TextChannel[];
  voiceChannels: VoiceChannel[];
  createdAt: Date;
  tags: string[];
}

export default function StudyGuildsPage() {
  const { member } = useMember();
  const [selectedGuild, setSelectedGuild] = useState<StudyGuild | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [isInVoiceCall, setIsInVoiceCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock guilds data
  const studyGuilds: StudyGuild[] = [
    {
      id: '1',
      name: 'Code Ninjas',
      description: 'Master the art of programming together. From algorithms to full-stack development.',
      avatar: 'https://static.wixstatic.com/media/c5b305_b242c5a8ba82477880316758d16b1bbf~mv2.png?originWidth=384&originHeight=192',
      banner: 'https://static.wixstatic.com/media/c5b305_7658f94696134b589bbcd4ff61941cb7~mv2.png?originWidth=384&originHeight=192',
      memberCount: 1247,
      maxMembers: 2000,
      subject: 'Programming',
      level: 'Intermediate',
      isPrivate: false,
      owner: 'user1',
      members: [],
      textChannels: [
        {
          id: 'general',
          name: 'general',
          description: 'General discussion',
          messages: [
            {
              id: '1',
              userId: 'user1',
              userName: 'CyberSamurai',
              userAvatar: 'https://static.wixstatic.com/media/c5b305_5a947d28a52444b598e8040ddd72d2ea~mv2.png?originWidth=128&originHeight=128',
              content: 'Hey everyone! Just solved a really tricky algorithm problem. Anyone want to discuss dynamic programming?',
              timestamp: new Date(Date.now() - 300000),
              type: 'text'
            },
            {
              id: '2',
              userId: 'user2',
              userName: 'QuantumCoder',
              userAvatar: 'https://static.wixstatic.com/media/c5b305_07cbf53fdac9403280c3dd139e4cf584~mv2.png?originWidth=128&originHeight=128',
              content: 'I\'d love to! I\'ve been struggling with the knapsack problem. Mind sharing your approach?',
              timestamp: new Date(Date.now() - 240000),
              type: 'text'
            }
          ],
          isPrivate: false
        },
        {
          id: 'algorithms',
          name: 'algorithms',
          description: 'Algorithm discussions and challenges',
          messages: [],
          isPrivate: false
        }
      ],
      voiceChannels: [
        {
          id: 'study-room-1',
          name: 'Study Room 1',
          members: [],
          maxMembers: 10,
          isLocked: false
        },
        {
          id: 'coding-session',
          name: 'Coding Session',
          members: [],
          maxMembers: 6,
          isLocked: false
        }
      ],
      createdAt: new Date('2024-01-15'),
      tags: ['programming', 'algorithms', 'web-dev', 'competitive-coding']
    },
    {
      id: '2',
      name: 'Math Masters',
      description: 'Conquer mathematics from basic algebra to advanced calculus and beyond.',
      avatar: 'https://static.wixstatic.com/media/c5b305_96f5d01ea3f84c368b5c54cbb4c9819b~mv2.png?originWidth=384&originHeight=192',
      banner: 'https://static.wixstatic.com/media/c5b305_fd39254af0b94d768b7a663f885ce891~mv2.png?originWidth=384&originHeight=192',
      memberCount: 892,
      maxMembers: 1500,
      subject: 'Mathematics',
      level: 'Advanced',
      isPrivate: false,
      owner: 'user3',
      members: [],
      textChannels: [
        {
          id: 'general',
          name: 'general',
          description: 'General math discussions',
          messages: [],
          isPrivate: false
        }
      ],
      voiceChannels: [
        {
          id: 'math-study',
          name: 'Math Study Hall',
          members: [],
          maxMembers: 12,
          isLocked: false
        }
      ],
      createdAt: new Date('2024-02-01'),
      tags: ['mathematics', 'calculus', 'algebra', 'geometry']
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedGuild, selectedChannel]);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedGuild) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: member?.loginEmail || 'current-user',
      userName: member?.profile?.nickname || member?.contact?.firstName || 'You',
      userAvatar: member?.profile?.photo?.url || '',
      content: messageInput,
      timestamp: new Date(),
      type: 'text'
    };

    // In real implementation, this would send to backend
    const channelIndex = selectedGuild.textChannels.findIndex(ch => ch.id === selectedChannel);
    if (channelIndex !== -1) {
      selectedGuild.textChannels[channelIndex].messages.push(newMessage);
      setSelectedGuild({ ...selectedGuild });
    }

    setMessageInput('');
  };

  const joinVoiceChannel = (channelId: string) => {
    setIsInVoiceCall(true);
    // In real implementation, this would connect to voice chat
  };

  const leaveVoiceChannel = () => {
    setIsInVoiceCall(false);
    setIsMuted(false);
    setIsDeafened(false);
    setIsVideoOn(false);
  };

  const CreateGuildModal = () => (
    <AnimatePresence>
      {showCreateGuild && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateGuild(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">Create Study Guild</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-paragraph text-light-gray mb-2">Guild Name</label>
                <Input placeholder="Enter guild name..." className="bg-background border-primary/20" />
              </div>
              
              <div>
                <label className="block text-sm font-paragraph text-light-gray mb-2">Description</label>
                <Textarea 
                  placeholder="Describe your guild's purpose..." 
                  className="bg-background border-primary/20 min-h-[100px]" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-paragraph text-light-gray mb-2">Subject</label>
                <select className="w-full p-2 bg-background border border-primary/20 rounded text-foreground">
                  <option>Programming</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Languages</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="private" className="accent-primary" />
                <label htmlFor="private" className="text-sm font-paragraph text-light-gray">
                  Make this guild private
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => setShowCreateGuild(false)}
                variant="outline" 
                className="flex-1 border-primary text-primary"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setShowCreateGuild(false)}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Create Guild
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (selectedGuild) {
    const currentChannel = selectedGuild.textChannels.find(ch => ch.id === selectedChannel);
    
    return (
      <div className="h-screen bg-background text-foreground flex">
        {/* Guild Sidebar */}
        <div className="w-72 bg-dark-gray border-r border-primary/20 flex flex-col">
          {/* Guild Header */}
          <div className="p-4 border-b border-primary/20">
            <div className="flex items-center gap-3">
              <Image
                src={selectedGuild.avatar}
                alt={selectedGuild.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-heading font-bold text-foreground">{selectedGuild.name}</h3>
                <p className="text-xs text-light-gray">{selectedGuild.memberCount} members</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedGuild(null)}>
                ✕
              </Button>
            </div>
          </div>

          {/* Channels */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Text Channels */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="h-4 w-4 text-light-gray" />
                <span className="text-xs font-paragraph text-light-gray uppercase tracking-wider">
                  Text Channels
                </span>
              </div>
              <div className="space-y-1">
                {selectedGuild.textChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setSelectedChannel(channel.id);
                      setChannelType('text');
                    }}
                    className={`w-full text-left p-2 rounded flex items-center gap-2 ${
                      selectedChannel === channel.id && channelType === 'text'
                        ? 'bg-primary/20 text-primary'
                        : 'text-light-gray hover:text-foreground hover:bg-background'
                    }`}
                  >
                    <Hash className="h-4 w-4" />
                    {channel.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Channels */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="h-4 w-4 text-light-gray" />
                <span className="text-xs font-paragraph text-light-gray uppercase tracking-wider">
                  Voice Channels
                </span>
              </div>
              <div className="space-y-1">
                {selectedGuild.voiceChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => joinVoiceChannel(channel.id)}
                    className="w-full text-left p-2 rounded flex items-center gap-2 text-light-gray hover:text-foreground hover:bg-background"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span className="flex-1">{channel.name}</span>
                    <span className="text-xs">{channel.members.length}/{channel.maxMembers}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Voice Controls */}
          {isInVoiceCall && (
            <div className="p-4 border-t border-primary/20 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
                  <Volume2 className="h-4 w-4 text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-paragraph text-foreground">Connected to Voice</p>
                  <p className="text-xs text-light-gray">Study Room 1</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isMuted ? 'destructive' : 'outline'}
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex-1"
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isVideoOn ? 'default' : 'outline'}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className="flex-1"
                >
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={leaveVoiceChannel}
                  className="flex-1"
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="p-4 border-b border-primary/20 bg-dark-gray">
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-heading font-bold text-foreground">
                {currentChannel?.name}
              </h2>
              {currentChannel?.description && (
                <span className="text-light-gray">— {currentChannel.description}</span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChannel?.messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={message.userAvatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {message.userName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-foreground">
                      {message.userName}
                    </span>
                    <span className="text-xs text-light-gray">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="font-paragraph text-foreground">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-primary/20 bg-dark-gray">
            <div className="flex gap-3">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message #${currentChannel?.name}`}
                className="flex-1 bg-background border-primary/20"
              />
              <Button onClick={sendMessage} className="bg-primary text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        <div className="w-60 bg-dark-gray border-l border-primary/20 p-4">
          <h3 className="font-heading font-bold text-foreground mb-4">
            Members — {selectedGuild.memberCount}
          </h3>
          
          {/* Online Members */}
          <div className="space-y-2">
            <div className="text-xs font-paragraph text-light-gray uppercase tracking-wider mb-2">
              Online — 12
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 p-1 rounded hover:bg-background">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      U{i}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neon-green rounded-full border-2 border-dark-gray"></div>
                </div>
                <span className="text-sm font-paragraph text-foreground">User {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground p-8">
      <div className="max-w-[120rem] mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-5xl font-heading font-black text-primary mb-4">
              Study Guilds
            </h1>
            <p className="text-xl font-paragraph text-light-gray">
              Join study communities, collaborate with peers, and learn together
            </p>
          </div>
          
          <Button 
            onClick={() => setShowCreateGuild(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Guild
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-gray" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guilds..."
                className="pl-10 bg-dark-gray border-primary/20"
              />
            </div>
            <select className="px-4 py-2 bg-dark-gray border border-primary/20 rounded text-foreground">
              <option>All Subjects</option>
              <option>Programming</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
            </select>
            <select className="px-4 py-2 bg-dark-gray border border-primary/20 rounded text-foreground">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
        </motion.div>

        {/* My Guilds */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">My Guilds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGuilds.slice(0, 2).map((guild, index) => (
              <motion.div
                key={guild.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="bg-dark-gray border-primary/20 p-6 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setSelectedGuild(guild)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={guild.avatar}
                      alt={guild.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                        {guild.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-primary text-primary">
                          {guild.subject}
                        </Badge>
                        <Badge variant="outline" className="border-secondary text-secondary">
                          {guild.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="font-paragraph text-light-gray text-sm mb-4 line-clamp-2">
                    {guild.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-light-gray" />
                      <span className="text-sm font-paragraph text-light-gray">
                        {guild.memberCount} members
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {guild.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-light-gray text-light-gray">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Discover Guilds */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Discover Guilds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGuilds.map((guild, index) => (
              <motion.div
                key={guild.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-dark-gray border-primary/20 overflow-hidden hover:border-primary/50 transition-all">
                  {/* Guild Banner */}
                  <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20">
                    <Image
                      src={guild.banner}
                      alt={`${guild.name} banner`}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute top-4 right-4">
                      {guild.isPrivate ? (
                        <Badge className="bg-cyber-yellow text-black">Private</Badge>
                      ) : (
                        <Badge className="bg-neon-green text-black">Public</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={guild.avatar}
                        alt={guild.name}
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full border-2 border-primary"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-bold text-foreground">
                          {guild.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-primary text-primary text-xs">
                            {guild.subject}
                          </Badge>
                          <Badge variant="outline" className="border-secondary text-secondary text-xs">
                            {guild.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="font-paragraph text-light-gray text-sm mb-4 line-clamp-3">
                      {guild.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-light-gray" />
                        <span className="text-sm font-paragraph text-light-gray">
                          {guild.memberCount.toLocaleString()} / {guild.maxMembers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-cyber-yellow" />
                        <span className="text-sm font-paragraph text-light-gray">
                          4.8
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {guild.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-light-gray text-light-gray">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setSelectedGuild(guild)}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Join Guild
                      </Button>
                      <Button variant="outline" className="border-primary text-primary">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <CreateGuildModal />
      </div>
    </div>
  );
}