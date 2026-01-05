import React, { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { useLanguageStore, type Language } from '@/stores/languageStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Volume2, 
  Eye, 
  Lock, 
  User, 
  Palette, 
  Zap,
  Save,
  RotateCcw,
  LogOut,
  Shield,
  Smartphone,
  Mail,
  Globe,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserSettings {
  // Account Settings
  displayName: string;
  email: string;
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyReminders: boolean;
  achievementAlerts: boolean;
  
  // Sound & Audio
  soundEnabled: boolean;
  musicEnabled: boolean;
  masterVolume: number;
  
  // Display Settings
  theme: 'dark' | 'light' | 'auto';
  animationsEnabled: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  // Privacy Settings
  profileVisibility: 'public' | 'friends' | 'private';
  showOnLeaderboard: boolean;
  allowFriendRequests: boolean;
  
  // Learning Preferences
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyGoal: number;
  preferredLearningTime: string;
  
  // Pet Settings
  petNotifications: boolean;
  petReminders: boolean;
  petAutoFeed: boolean;
  
  // Language Settings
  language: Language;
}

const defaultSettings: UserSettings = {
  displayName: '',
  email: '',
  emailNotifications: true,
  pushNotifications: true,
  dailyReminders: true,
  achievementAlerts: true,
  soundEnabled: true,
  musicEnabled: true,
  masterVolume: 70,
  theme: 'dark',
  animationsEnabled: true,
  reducedMotion: false,
  fontSize: 'medium',
  profileVisibility: 'public',
  showOnLeaderboard: true,
  allowFriendRequests: true,
  difficultyLevel: 'intermediate',
  dailyGoal: 60,
  preferredLearningTime: 'morning',
  petNotifications: true,
  petReminders: true,
  petAutoFeed: false,
  language: 'en',
};

const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ko', name: '한국어' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ar', name: 'العربية' },
];

export default function SettingsPage() {
  const { member, actions } = useMember();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    
    // Set display name and email from member data
    if (member) {
      setSettings(prev => ({
        ...prev,
        displayName: member.profile?.nickname || member.contact?.firstName || '',
        email: member.loginEmail || '',
      }));
    }
    
    // Set language from store
    setSettings(prev => ({
      ...prev,
      language: currentLanguage,
    }));
  }, [member, currentLanguage]);

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // If language is being changed, update the language store
    if (key === 'language') {
      setLanguage(value as Language);
    }
    
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[120rem] mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-5xl md:text-6xl font-heading font-black text-foreground">
              Settings
            </h1>
          </div>
          <p className="text-light-gray text-lg">Customize your VEDNIX experience</p>
        </motion.div>

        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-neon-green/20 border border-neon-green text-neon-green rounded-lg flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            <span className="font-paragraph">Settings saved successfully!</span>
          </motion.div>
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Display</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Learning</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  {/* Display Name */}
                  <div>
                    <Label htmlFor="displayName" className="text-foreground font-heading mb-2 block">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => handleSettingChange('displayName', e.target.value)}
                      placeholder="Enter your display name"
                      className="bg-background border-primary/20 text-foreground"
                    />
                    <p className="text-xs text-light-gray mt-2">This is how other players will see you</p>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-foreground font-heading mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      disabled
                      className="bg-background/50 border-primary/20 text-light-gray cursor-not-allowed"
                    />
                    <p className="text-xs text-light-gray mt-2">Managed by your account provider</p>
                  </div>

                  {/* Password Change */}
                  <div>
                    <Label className="text-foreground font-heading mb-2 block">Password</Label>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <p className="text-xs text-light-gray mt-2">Update your password regularly for security</p>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="pt-4 border-t border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-foreground font-heading">Two-Factor Authentication</Label>
                        <p className="text-sm text-light-gray mt-1">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={false}
                        onCheckedChange={() => {}}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <Label className="text-foreground font-heading">Email Notifications</Label>
                        <p className="text-sm text-light-gray mt-1">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                    />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-secondary" />
                      <div>
                        <Label className="text-foreground font-heading">Push Notifications</Label>
                        <p className="text-sm text-light-gray mt-1">Get notified on your device</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
                    />
                  </div>

                  {/* Daily Reminders */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-cyber-yellow" />
                      <div>
                        <Label className="text-foreground font-heading">Daily Reminders</Label>
                        <p className="text-sm text-light-gray mt-1">Get reminded to study daily</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.dailyReminders}
                      onCheckedChange={(value) => handleSettingChange('dailyReminders', value)}
                    />
                  </div>

                  {/* Achievement Alerts */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-neon-green" />
                      <div>
                        <Label className="text-foreground font-heading">Achievement Alerts</Label>
                        <p className="text-sm text-light-gray mt-1">Celebrate your victories</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.achievementAlerts}
                      onCheckedChange={(value) => handleSettingChange('achievementAlerts', value)}
                    />
                  </div>

                  {/* Pet Notifications */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🐱</span>
                      <div>
                        <Label className="text-foreground font-heading">Pet Notifications</Label>
                        <p className="text-sm text-light-gray mt-1">Hear from your pet companion</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.petNotifications}
                      onCheckedChange={(value) => handleSettingChange('petNotifications', value)}
                    />
                  </div>

                  {/* Pet Reminders */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💖</span>
                      <div>
                        <Label className="text-foreground font-heading">Pet Reminders</Label>
                        <p className="text-sm text-light-gray mt-1">Reminders to care for your pet</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.petReminders}
                      onCheckedChange={(value) => handleSettingChange('petReminders', value)}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Display Settings Tab */}
          <TabsContent value="display" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Display Settings</h2>
                
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <Label className="text-foreground font-heading mb-3 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {['dark', 'light', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSettingChange('theme', theme as any)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.theme === theme
                              ? 'border-primary bg-primary/10'
                              : 'border-primary/20 bg-background/50 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-2">
                            {theme === 'dark' && <Moon className="h-6 w-6 text-primary" />}
                            {theme === 'light' && <Sun className="h-6 w-6 text-cyber-yellow" />}
                            {theme === 'auto' && <Eye className="h-6 w-6 text-secondary" />}
                          </div>
                          <p className="text-sm font-heading capitalize">{theme}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <Label className="text-foreground font-heading mb-3 block">Font Size</Label>
                    <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange('fontSize', value)}>
                      <SelectTrigger className="bg-background border-primary/20 text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-gray border-primary/20">
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Animations */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div>
                      <Label className="text-foreground font-heading">Animations</Label>
                      <p className="text-sm text-light-gray mt-1">Enable smooth animations</p>
                    </div>
                    <Switch
                      checked={settings.animationsEnabled}
                      onCheckedChange={(value) => handleSettingChange('animationsEnabled', value)}
                    />
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div>
                      <Label className="text-foreground font-heading">Reduce Motion</Label>
                      <p className="text-sm text-light-gray mt-1">Minimize animations for accessibility</p>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(value) => handleSettingChange('reducedMotion', value)}
                    />
                  </div>

                  {/* Sound Settings */}
                  <div className="pt-4 border-t border-primary/20">
                    <h3 className="text-lg font-heading font-bold text-foreground mb-4">Audio</h3>
                    
                    <div className="space-y-4">
                      {/* Sound Effects */}
                      <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-3">
                          <Volume2 className="h-5 w-5 text-primary" />
                          <div>
                            <Label className="text-foreground font-heading">Sound Effects</Label>
                            <p className="text-sm text-light-gray mt-1">Enable game sounds</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.soundEnabled}
                          onCheckedChange={(value) => handleSettingChange('soundEnabled', value)}
                        />
                      </div>

                      {/* Background Music */}
                      <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-3">
                          <Volume2 className="h-5 w-5 text-secondary" />
                          <div>
                            <Label className="text-foreground font-heading">Background Music</Label>
                            <p className="text-sm text-light-gray mt-1">Enable background music</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.musicEnabled}
                          onCheckedChange={(value) => handleSettingChange('musicEnabled', value)}
                        />
                      </div>

                      {/* Master Volume */}
                      <div>
                        <Label className="text-foreground font-heading mb-3 block">Master Volume</Label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.masterVolume}
                            onChange={(e) => handleSettingChange('masterVolume', parseInt(e.target.value))}
                            className="flex-1 h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-foreground font-heading w-12 text-right">{settings.masterVolume}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Privacy Settings Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <Label className="text-foreground font-heading mb-3 block">Profile Visibility</Label>
                    <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                      <SelectTrigger className="bg-background border-primary/20 text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-gray border-primary/20">
                        <SelectItem value="public">Public - Everyone can see your profile</SelectItem>
                        <SelectItem value="friends">Friends Only - Only friends can see</SelectItem>
                        <SelectItem value="private">Private - Only you can see</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Leaderboard */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div>
                      <Label className="text-foreground font-heading">Show on Leaderboard</Label>
                      <p className="text-sm text-light-gray mt-1">Appear in global rankings</p>
                    </div>
                    <Switch
                      checked={settings.showOnLeaderboard}
                      onCheckedChange={(value) => handleSettingChange('showOnLeaderboard', value)}
                    />
                  </div>

                  {/* Friend Requests */}
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div>
                      <Label className="text-foreground font-heading">Allow Friend Requests</Label>
                      <p className="text-sm text-light-gray mt-1">Let others add you as a friend</p>
                    </div>
                    <Switch
                      checked={settings.allowFriendRequests}
                      onCheckedChange={(value) => handleSettingChange('allowFriendRequests', value)}
                    />
                  </div>

                  {/* Data & Privacy */}
                  <div className="pt-4 border-t border-primary/20">
                    <h3 className="text-lg font-heading font-bold text-foreground mb-4">Data & Privacy</h3>
                    
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        Download Your Data
                      </Button>
                      <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10 justify-start">
                        <Zap className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Learning Preferences Tab */}
          <TabsContent value="learning" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-dark-gray border-primary/20 p-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Learning Preferences</h2>
                
                <div className="space-y-6">
                  {/* Language Selection */}
                  <div>
                    <Label className="text-foreground font-heading mb-3 block">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value as Language)}>
                      <SelectTrigger className="bg-background border-primary/20 text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-gray border-primary/20">
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-light-gray mt-2">Choose your preferred language for the entire platform</p>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <Label className="text-foreground font-heading mb-3 block">Difficulty Level</Label>
                    <Select value={settings.difficultyLevel} onValueChange={(value) => handleSettingChange('difficultyLevel', value)}>
                      <SelectTrigger className="bg-background border-primary/20 text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-gray border-primary/20">
                        <SelectItem value="beginner">Beginner - Start with basics</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Balanced challenge</SelectItem>
                        <SelectItem value="advanced">Advanced - Maximum difficulty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Daily Goal */}
                  <div>
                    <Label className="text-foreground font-heading mb-3 block">Daily Learning Goal (minutes)</Label>
                    <Input
                      type="number"
                      min="15"
                      max="480"
                      step="15"
                      value={settings.dailyGoal}
                      onChange={(e) => handleSettingChange('dailyGoal', parseInt(e.target.value))}
                      className="bg-background border-primary/20 text-foreground"
                    />
                    <p className="text-xs text-light-gray mt-2">Set your daily study target</p>
                  </div>

                  {/* Preferred Learning Time */}
                  <div>
                    <Label className="text-foreground font-heading mb-3 block">Preferred Learning Time</Label>
                    <Select value={settings.preferredLearningTime} onValueChange={(value) => handleSettingChange('preferredLearningTime', value)}>
                      <SelectTrigger className="bg-background border-primary/20 text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-gray border-primary/20">
                        <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6 PM - 12 AM)</SelectItem>
                        <SelectItem value="night">Night (12 AM - 6 AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pet Auto-Feed */}
                  <div className="pt-4 border-t border-primary/20">
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div>
                        <Label className="text-foreground font-heading">Auto-Feed Pet</Label>
                        <p className="text-sm text-light-gray mt-1">Automatically feed your pet during study sessions</p>
                      </div>
                      <Switch
                        checked={settings.petAutoFeed}
                        onCheckedChange={(value) => handleSettingChange('petAutoFeed', value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center"
        >
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              onClick={handleResetSettings}
              variant="outline"
              className="flex-1 sm:flex-none border-light-gray text-light-gray hover:bg-light-gray/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={!hasChanges}
              className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
          
          <Button
            onClick={actions.logout}
            variant="outline"
            className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* Back to Profile Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <Link to="/profile" className="text-primary hover:text-primary/80 transition-colors font-paragraph">
            ← Back to Profile
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
